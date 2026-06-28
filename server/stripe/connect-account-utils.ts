import type Stripe from "stripe"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL ou BETTER_AUTH_URL não foi definida")
  }

  return appUrl.replace(/\/$/, "")
}

export function getConnectAccountStatus(account: Stripe.Account) {
  if (account.charges_enabled && account.payouts_enabled) {
    return "COMPLETE"
  }

  if (account.requirements?.disabled_reason) {
    return "REJECTED"
  }

  if (
    account.details_submitted ||
    account.requirements?.currently_due?.length
  ) {
    return "IN_PROGRESS"
  }

  return "DEFERRED"
}

export async function createStripeAccountLink(stripeAccountId: string) {
  const appUrl = getAppUrl()

  return stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${appUrl}/stripe/refresh`,
    return_url: `${appUrl}/stripe/callback`,
    type: "account_onboarding",
  })
}

export async function syncStripeConnectAccount(account: Stripe.Account) {
  const status = getConnectAccountStatus(account)

  return prisma.stripeConnectAccount.update({
    where: {
      stripeAccountId: account.id,
    },
    data: {
      status,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      onboardingCompletedAt: status === "COMPLETE" ? new Date() : undefined,
    },
  })
}

export async function syncStripeConnectAccountById(stripeAccountId: string) {
  const account = await stripe.accounts.retrieve(stripeAccountId)

  if (account.deleted) {
    throw new Error("Conta Stripe removida")
  }

  return syncStripeConnectAccount(account)
}
