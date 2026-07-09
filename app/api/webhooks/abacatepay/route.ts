import { and, eq, isNotNull } from "drizzle-orm"
import { NextResponse } from "next/server"

import { refundAbacateCheckout } from "@/lib/abacatepay/checkouts"
import { verifyAbacateWebhookSignature } from "@/lib/abacatepay/verify-webhook"
import { decrypt } from "@/lib/crypto/encryption"
import { db } from "@/lib/db"
import { abacatepayCredentials, invoices } from "@/lib/db/schema"

export const runtime = "nodejs"

type WebhookPayload = {
  id?: string
  event?: string
  data?: {
    checkout?: {
      id?: string
      externalId?: string | null
      status?: string
    }
  }
}

async function findCredentialsByWebhookSecret(secret: string) {
  // Secrets are stored encrypted, so we decrypt and compare per row.
  // Fine for MVP (one credential row per seller).
  const rows = await db
    .select()
    .from(abacatepayCredentials)
    .where(isNotNull(abacatepayCredentials.encryptedWebhookSecret))

  for (const row of rows) {
    if (!row.encryptedWebhookSecret) {
      continue
    }

    try {
      if (decrypt(row.encryptedWebhookSecret) === secret) {
        return row
      }
    } catch {
      continue
    }
  }

  return null
}

async function findInvoice(input: {
  userId: string
  checkoutId?: string
  externalId?: string | null
}) {
  const { userId, checkoutId, externalId } = input

  if (checkoutId) {
    const [byCheckout] = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          eq(invoices.abacatepayCheckoutId, checkoutId)
        )
      )
      .limit(1)

    if (byCheckout) {
      return byCheckout
    }
  }

  if (externalId) {
    const [byExternal] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.userId, userId), eq(invoices.id, externalId)))
      .limit(1)

    if (byExternal) {
      return byExternal
    }
  }

  return null
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const webhookSecret = url.searchParams.get("webhookSecret")

  if (!webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const credentials = await findCredentialsByWebhookSecret(webhookSecret)

  if (!credentials) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get("X-Webhook-Signature")

  if (!verifyAbacateWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let payload: WebhookPayload

  try {
    payload = JSON.parse(rawBody) as WebhookPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const event = payload.event
  const checkout = payload.data?.checkout
  const checkoutId = checkout?.id
  const externalId = checkout?.externalId

  if (!event || (!checkoutId && !externalId)) {
    return NextResponse.json({ ok: true })
  }

  const invoice = await findInvoice({
    userId: credentials.userId,
    checkoutId,
    externalId,
  })

  if (!invoice) {
    return NextResponse.json({ ok: true })
  }

  const now = new Date()

  if (event === "checkout.completed") {
    if (invoice.status === "PAID" || invoice.status === "REFUNDED") {
      return NextResponse.json({ ok: true })
    }

    if (invoice.status === "OPEN") {
      await db
        .update(invoices)
        .set({
          status: "PAID",
          paidAt: now,
          updatedAt: now,
        })
        .where(and(eq(invoices.id, invoice.id), eq(invoices.status, "OPEN")))

      return NextResponse.json({ ok: true })
    }

    if (invoice.status === "CANCELED") {
      let apiKey: string

      try {
        apiKey = decrypt(credentials.encryptedKey)
      } catch {
        await db
          .update(invoices)
          .set({
            status: "PAID",
            paidAt: now,
            refundFailedAt: now,
            refundError: "Não foi possível descriptografar a chave de API",
            updatedAt: now,
          })
          .where(eq(invoices.id, invoice.id))

        return NextResponse.json({ ok: true })
      }

      const refund = await refundAbacateCheckout(
        {
          id: invoice.abacatepayCheckoutId,
          reason: "Cobrança cancelada pelo vendedor.",
        },
        apiKey
      )

      if ("error" in refund) {
        await db
          .update(invoices)
          .set({
            status: "PAID",
            paidAt: now,
            refundFailedAt: now,
            refundError: refund.error,
            updatedAt: now,
          })
          .where(eq(invoices.id, invoice.id))

        return NextResponse.json({ ok: true })
      }

      await db
        .update(invoices)
        .set({
          status: "REFUNDED",
          paidAt: now,
          refundedAt: now,
          refundFailedAt: null,
          refundError: null,
          updatedAt: now,
        })
        .where(eq(invoices.id, invoice.id))

      return NextResponse.json({ ok: true })
    }
  }

  if (event === "checkout.refunded") {
    if (invoice.status === "REFUNDED") {
      return NextResponse.json({ ok: true })
    }

    await db
      .update(invoices)
      .set({
        status: "REFUNDED",
        refundedAt: now,
        paidAt: invoice.paidAt ?? now,
        refundFailedAt: null,
        refundError: null,
        updatedAt: now,
      })
      .where(eq(invoices.id, invoice.id))

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
