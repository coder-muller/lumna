"use server"

import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { createStripeAccountLink } from "./connect-account-utils"

export async function createOnboardingLink(): Promise<
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

    const accountLink = await createStripeAccountLink(
      stripeConnectAccount.stripeAccountId
    )

    await prisma.stripeConnectAccount.update({
      where: {
        userId: session.user.id,
      },
      data: {
        status: "IN_PROGRESS",
        onboardingPromptShown: true,
        onboardingPromptAt: new Date(),
      },
    })

    return {
      url: accountLink.url,
    }
  } catch (error) {
    console.error("[stripe/create-onboarding-link]", error)

    return {
      error: "Erro ao criar link de verificação da Stripe",
    }
  }
}
