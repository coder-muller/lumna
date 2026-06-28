import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { syncStripeConnectAccountById } from "@/server/stripe/connect-account-utils"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const session = await getSession()
  const redirectUrl = new URL("/dashboard", url)

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", url))
  }

  const stripeConnectAccount = await prisma.stripeConnectAccount.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  if (!stripeConnectAccount) {
    return NextResponse.redirect(redirectUrl)
  }

  try {
    await syncStripeConnectAccountById(stripeConnectAccount.stripeAccountId)
  } catch (error) {
    console.error("[stripe/callback]", error)
  }

  return NextResponse.redirect(redirectUrl)
}
