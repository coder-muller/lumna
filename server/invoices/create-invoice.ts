"use server"

import { randomUUID } from "node:crypto"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { CustomerStatus, Invoices } from "@/lib/generated/prisma/client"
import { calculateLumnaPlatformFeeAmount } from "@/lib/stripe/fee"
import { stripe } from "@/lib/stripe"
import { getAppUrl } from "@/server/stripe/connect-account-utils"
import { invoiceFormSchema, InvoiceFormInput } from "./invoice-schema"

export async function createInvoice(
  input: InvoiceFormInput
): Promise<{ data: Invoices } | { error: string }> {
  const result = invoiceFormSchema.safeParse(input)

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Dados inválidos",
    }
  }

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const customerExists = await prisma.customers.findFirst({
    where: {
      id: result.data.customerId,
      userId: session.user.id,
      status: CustomerStatus.ACTIVE,
    },
  })

  if (!customerExists) {
    return {
      error: "Cliente não encontrado",
    }
  }

  const stripeConnectAccount = await prisma.stripeConnectAccount.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      stripeAccountId: true,
      status: true,
      chargesEnabled: true,
      payoutsEnabled: true,
    },
  })

  if (
    !stripeConnectAccount ||
    stripeConnectAccount.status !== "COMPLETE" ||
    !stripeConnectAccount.chargesEnabled ||
    !stripeConnectAccount.payoutsEnabled
  ) {
    return {
      error:
        "Finalize a conexão com a Stripe antes de criar cobranças com link de pagamento.",
    }
  }

  const appUrl = getAppUrl()
  const invoiceId = randomUUID()
  const platformFeeAmount = calculateLumnaPlatformFeeAmount(result.data.value)
  const description = result.data.description ?? undefined

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerExists.email,
    client_reference_id: invoiceId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: result.data.value,
          product_data: {
            name: result.data.title,
            description,
          },
        },
      },
    ],
    metadata: {
      invoiceId,
      userId: session.user.id,
      customerId: customerExists.id,
    },
    payment_intent_data: {
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: stripeConnectAccount.stripeAccountId,
      },
      metadata: {
        invoiceId,
        userId: session.user.id,
        customerId: customerExists.id,
      },
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?invoice_id=${invoiceId}`,
  })

  if (!checkoutSession.url) {
    return {
      error: "A Stripe não retornou um link de pagamento para a cobrança.",
    }
  }

  const invoice = await prisma.invoices.create({
    data: {
      id: invoiceId,
      userId: session.user.id,
      customerId: result.data.customerId,
      title: result.data.title,
      description: result.data.description,
      value: result.data.value,
      stripeCheckoutSessionId: checkoutSession.id,
      stripeCheckoutUrl: checkoutSession.url,
      stripeCheckoutExpiresAt: checkoutSession.expires_at
        ? new Date(checkoutSession.expires_at * 1000)
        : null,
      platformFeeAmount,
    },
  })

  return {
    data: invoice,
  }
}
