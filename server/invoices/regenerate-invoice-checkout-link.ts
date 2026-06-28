"use server"

import { InvoiceStatus, Invoices } from "@/lib/generated/prisma/client"
import {
  calculateCheckoutApplicationFeeAmount,
  calculateLumnaPlatformFeeAmount,
} from "@/lib/stripe/fee"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server/get-server-session"

import { createInvoiceCheckoutSession } from "./checkout-session"
import { invoiceIdSchema } from "./invoice-schema"

type RegenerateInvoiceCheckoutLinkInput = {
  id: string
}

export async function regenerateInvoiceCheckoutLink(
  input: RegenerateInvoiceCheckoutLinkInput
): Promise<{ data: Invoices } | { error: string }> {
  const result = invoiceIdSchema.safeParse(input)

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Cobrança inválida",
    }
  }

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const invoice = await prisma.invoices.findFirst({
    where: {
      id: result.data.id,
      userId: session.user.id,
    },
    include: {
      customer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  })

  if (!invoice) {
    return {
      error: "Cobrança não encontrada",
    }
  }

  if (invoice.status !== InvoiceStatus.OPEN) {
    return {
      error: "Só cobranças abertas podem gerar um novo link",
    }
  }

  if (
    !invoice.stripeCheckoutExpiresAt ||
    invoice.stripeCheckoutExpiresAt.getTime() > Date.now()
  ) {
    return {
      error: "O link atual ainda não expirou",
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
        "Finalize a conexão com a Stripe antes de gerar um novo link de pagamento.",
    }
  }

  const platformFeeAmount =
    invoice.platformFeeAmount || calculateLumnaPlatformFeeAmount(invoice.value)
  const applicationFeeAmount = calculateCheckoutApplicationFeeAmount(
    invoice.value
  )

  const checkoutSession = await createInvoiceCheckoutSession({
    invoiceId: invoice.id,
    userId: session.user.id,
    customerId: invoice.customer.id,
    customerEmail: invoice.customer.email,
    title: invoice.title,
    description: invoice.description,
    value: invoice.value,
    applicationFeeAmount,
    stripeAccountId: stripeConnectAccount.stripeAccountId,
  })

  if (!checkoutSession.url) {
    return {
      error: "A Stripe não retornou um novo link de pagamento.",
    }
  }

  const updatedInvoice = await prisma.invoices.update({
    where: {
      id: invoice.id,
    },
    data: {
      stripeCheckoutSessionId: checkoutSession.id,
      stripeCheckoutUrl: checkoutSession.url,
      stripeCheckoutExpiresAt: checkoutSession.expires_at
        ? new Date(checkoutSession.expires_at * 1000)
        : null,
      platformFeeAmount,
    },
  })

  return {
    data: updatedInvoice,
  }
}
