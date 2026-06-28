import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

type CreateStripeConnectAccountParams = {
  userId: string
  email: string
}

export async function createStripeConnectAccountForUser({
  userId,
  email,
}: CreateStripeConnectAccountParams) {
  const existingAccount = await prisma.stripeConnectAccount.findUnique({
    where: {
      userId,
    },
  })

  if (existingAccount) {
    return existingAccount
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: "BR",
    email,
    business_type: "individual",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    metadata: {
      userId,
      onboarding_type: "deferred",
      platform: "lumna",
    },
  })

  const stripeConnectAccount = await prisma.stripeConnectAccount.create({
    data: {
      userId,
      stripeAccountId: account.id,
      status: "DEFERRED",
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
    },
  })

  return stripeConnectAccount
}
