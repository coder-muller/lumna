"use server"

import { and, eq } from "drizzle-orm"

import { createAbacateCheckout } from "@/lib/abacatepay/checkouts"
import { createAbacateProduct } from "@/lib/abacatepay/products"
import { getAppUrl } from "@/lib/app-url"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers, invoices, type Invoice } from "@/lib/db/schema"
import { ensureAbacateWebhook } from "@/server/abacatepay-credentials/ensure-webhook"

import { invoiceFormSchema, type InvoiceFormInput } from "./invoice-schema"

export async function createInvoice(
  input: InvoiceFormInput
): Promise<{ data: Invoice } | { error: string }> {
  const parsed = invoiceFormSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  // Best-effort: invoices can be created without a webhook in local/dev.
  // Payment status only auto-updates when a public HTTPS webhook is registered.
  const webhook = await ensureAbacateWebhook(session.user.id)

  if ("error" in webhook) {
    return { error: webhook.error }
  }

  const [customer] = await db
    .select()
    .from(customers)
    .where(
      and(
        eq(customers.id, parsed.data.customerId),
        eq(customers.userId, session.user.id)
      )
    )
    .limit(1)

  if (!customer) {
    return { error: "Cliente não encontrado" }
  }

  if (customer.syncStatus !== "synced") {
    return {
      error:
        "Este cliente está dessincronizado. Reenvie os dados para a AbacatePay antes de criar a cobrança.",
    }
  }

  const invoiceId = crypto.randomUUID()
  const appUrl = getAppUrl()

  const product = await createAbacateProduct({
    externalId: `invoice-${invoiceId}`,
    name: parsed.data.title,
    price: parsed.data.value,
    currency: "BRL",
    description: parsed.data.description,
  })

  if ("error" in product) {
    return {
      error: product.error || "Não foi possível criar o produto na AbacatePay",
    }
  }

  const checkout = await createAbacateCheckout({
    items: [{ id: product.data.id, quantity: 1 }],
    customerId: customer.abacatepayCustomerId,
    externalId: invoiceId,
    returnUrl: `${appUrl}/checkout/cancel?invoice_id=${invoiceId}`,
    completionUrl: `${appUrl}/checkout/success?invoice_id=${invoiceId}`,
    methods: ["PIX", "CARD"],
    frequency: "ONE_TIME",
  })

  if ("error" in checkout) {
    return {
      error:
        checkout.error || "Não foi possível criar o checkout na AbacatePay",
    }
  }

  if (!checkout.data.url) {
    return {
      error: "A AbacatePay não retornou um link de pagamento para a cobrança.",
    }
  }

  const now = new Date()

  try {
    const [created] = await db
      .insert(invoices)
      .values({
        id: invoiceId,
        userId: session.user.id,
        customerId: customer.id,
        title: parsed.data.title,
        description: parsed.data.description,
        value: parsed.data.value,
        status: "OPEN",
        abacatepayProductId: product.data.id,
        abacatepayCheckoutId: checkout.data.id,
        checkoutUrl: checkout.data.url,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    if (!created) {
      return { error: "Não foi possível salvar a cobrança" }
    }

    return { data: created }
  } catch {
    return { error: "Não foi possível salvar a cobrança" }
  }
}
