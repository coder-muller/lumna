"use server"

import type { StripeOnboardingStatus } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server/get-server-session"

export type ConnectAccountStatus = {
  status: StripeOnboardingStatus
  chargesEnabled: boolean
  payoutsEnabled: boolean
}

export async function getConnectAccountStatus(): Promise<
  ConnectAccountStatus | { error: string }
> {
  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const stripeConnectAccount = await prisma.stripeConnectAccount.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      status: true,
      chargesEnabled: true,
      payoutsEnabled: true,
    },
  })

  if (!stripeConnectAccount) {
    return {
      error: "Conta Stripe não encontrada",
    }
  }

  return stripeConnectAccount
}
