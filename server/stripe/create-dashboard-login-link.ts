"use server"

import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function createDashboardLoginLink(): Promise<
  { url: string } | { error: string }
> {
  try {
    const session = await requireSession()

    const stripeConnectAccount = await prisma.stripeConnectAccount.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!stripeConnectAccount) {
      return {
        error: "Conta Stripe não encontrada",
      }
    }

    if (stripeConnectAccount.status !== "COMPLETE") {
      return {
        error: "Conclua a verificação antes de acessar o dashboard da Stripe",
      }
    }

    const loginLink = await stripe.accounts.createLoginLink(
      stripeConnectAccount.stripeAccountId
    )

    return {
      url: loginLink.url,
    }
  } catch (error) {
    console.error("[stripe/create-dashboard-login-link]", error)

    return {
      error: "Erro ao criar link do dashboard da Stripe",
    }
  }
}
