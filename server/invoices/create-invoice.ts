"use server"

import { randomUUID } from "node:crypto"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { CustomerStatus, Invoices } from "@/lib/generated/prisma/client"
import { calculateLumnaPlatformFeeAmount } from "@/lib/stripe/fee"
import { createInvoiceCheckoutSession } from "./checkout-session"
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

  const invoiceId = randomUUID()
  const platformFeeAmount = calculateLumnaPlatformFeeAmount(result.data.value)

  const checkoutSession = await createInvoiceCheckoutSession({
    invoiceId,
    userId: session.user.id,
    customerId: customerExists.id,
    customerEmail: customerExists.email,
    title: result.data.title,
    description: result.data.description,
    value: result.data.value,
    platformFeeAmount,
    stripeAccountId: stripeConnectAccount.stripeAccountId,
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
