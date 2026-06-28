import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { createStripeAccountLink } from "@/server/stripe/connect-account-utils"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", url))
  }

  const stripeConnectAccount = await prisma.stripeConnectAccount.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  if (!stripeConnectAccount) {
    return NextResponse.redirect(new URL("/dashboard", url))
  }

  try {
    const accountLink = await createStripeAccountLink(
      stripeConnectAccount.stripeAccountId
    )

    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("[stripe/refresh]", error)

    return NextResponse.redirect(new URL("/dashboard", url))
  }
}
