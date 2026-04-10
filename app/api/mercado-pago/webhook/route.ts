import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { syncPaymentFromWebhook } from "@/lib/billing/sync"
import {
  logMercadoPagoError,
  logMercadoPagoInfo,
  logMercadoPagoWarn,
} from "@/lib/mercado-pago/log"
import { validateMercadoPagoWebhookSignature } from "@/lib/mercado-pago/webhook-signature"

export const runtime = "nodejs"

type WebhookPayload = {
  action?: string
  type?: string
  topic?: string
  id?: string | number
  user_id?: string | number
  data?: {
    id?: string | number
  }
}

function parseWebhookQueryPayload(request: Request): WebhookPayload {
  const searchParams = new URL(request.url).searchParams

  return {
    action: searchParams.get("action") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    topic: searchParams.get("topic") ?? undefined,
    id: searchParams.get("id") ?? undefined,
    user_id: searchParams.get("user_id") ?? undefined,
    data: searchParams.get("data.id")
      ? {
          id: searchParams.get("data.id") ?? undefined,
        }
      : undefined,
  }
}

function extractHeaders(request: Request) {
  return {
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    contentType: request.headers.get("content-type"),
    userAgent: request.headers.get("user-agent"),
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const queryPayload = parseWebhookQueryPayload(request)
  let parsedBody: WebhookPayload | null = null

  try {
    parsedBody = body ? (JSON.parse(body) as WebhookPayload) : null
  } catch {
    if (!queryPayload.topic && !queryPayload.type && !queryPayload.data?.id) {
      return NextResponse.json(
        { ok: false, error: "invalid-json" },
        { status: 400 }
      )
    }
  }

  const payload = parsedBody ?? queryPayload

  const topic = payload.topic ?? payload.type ?? "unknown"
  const action = payload.action ?? null
  const resourceId = payload.data?.id ? String(payload.data.id) : null
  const eventId = payload.id ? String(payload.id) : null
  const mercadoPagoUserId = payload.user_id ? String(payload.user_id) : null
  const headers = extractHeaders(request)
  const validation = validateMercadoPagoWebhookSignature({
    request,
    resourceId,
  })

  let event = await prisma.mercadoPagoWebhookEvent.findFirst({
    where: eventId
      ? { mercadoPagoEventId: eventId }
      : {
          topic,
          action,
          mercadoPagoResourceId: resourceId,
        },
  })

  if (!event) {
    event = await prisma.mercadoPagoWebhookEvent.create({
      data: {
        topic,
        action,
        mercadoPagoEventId: eventId,
        mercadoPagoResourceId: resourceId,
        mercadoPagoUserId,
        signature: headers.xSignature,
        requestBody: {
          rawBody: body || null,
          parsedBody,
          queryPayload,
          headers,
        },
      },
    })
  } else {
    event = await prisma.mercadoPagoWebhookEvent.update({
      where: {
        id: event.id,
      },
      data: {
        signature: headers.xSignature,
        requestBody: {
          rawBody: body || null,
          parsedBody,
          queryPayload,
          headers,
        },
      },
    })
  }

  if (validation.shouldReject) {
    logMercadoPagoError("webhook.rejected", {
      topic,
      action,
      eventId,
      resourceId,
      mercadoPagoUserId,
      reason: validation.reason,
    })

    await prisma.mercadoPagoWebhookEvent.update({
      where: {
        id: event.id,
      },
      data: {
        processingError: validation.reason ?? "webhook signature validation failed",
      },
    })

    return NextResponse.json({ ok: false }, { status: 401 })
  }

  if (validation.mode !== "signed" && validation.reason) {
    logMercadoPagoWarn("webhook.accepted_without_signature", {
      topic,
      action,
      eventId,
      resourceId,
      mercadoPagoUserId,
      reason: validation.reason,
    })
  }

  try {
    if (topic === "payment" && resourceId) {
      logMercadoPagoInfo("webhook.received.payment", {
        eventId,
        paymentId: resourceId,
        mercadoPagoUserId,
        mode: validation.mode,
      })

      await syncPaymentFromWebhook({
        mercadoPagoUserId,
        paymentId: resourceId,
      })
    }

    await prisma.mercadoPagoWebhookEvent.update({
      where: {
        id: event.id,
      },
      data: {
        processedAt: new Date(),
        processingError: null,
      },
    })
  } catch (error) {
    logMercadoPagoError("webhook.processing_failed", {
      topic,
      action,
      eventId,
      resourceId,
      mercadoPagoUserId,
      message: error instanceof Error ? error.message : "unknown-error",
    })

    await prisma.mercadoPagoWebhookEvent.update({
      where: {
        id: event.id,
      },
      data: {
        processingError:
          error instanceof Error
            ? error.message.slice(0, 1000)
            : "Webhook processing failed",
      },
    })

    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
