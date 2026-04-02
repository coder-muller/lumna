import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { syncPaymentFromWebhook } from "@/lib/billing/sync"
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

export async function POST(request: Request) {
  const body = await request.text()
  let payload: WebhookPayload

  try {
    payload = JSON.parse(body || "{}") as WebhookPayload
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid-json" },
      { status: 400 }
    )
  }

  const topic = payload.topic ?? payload.type ?? "unknown"
  const action = payload.action ?? null
  const resourceId = payload.data?.id ? String(payload.data.id) : null
  const eventId = payload.id ? String(payload.id) : null
  const mercadoPagoUserId = payload.user_id ? String(payload.user_id) : null
  const signature = request.headers.get("x-signature")

  const signatureIsValid = validateMercadoPagoWebhookSignature({
    request,
    body,
    resourceId,
  })

  if (!signatureIsValid) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

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
        signature,
        requestBody: payload,
      },
    })
  }

  try {
    if (topic === "payment" && resourceId) {
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
