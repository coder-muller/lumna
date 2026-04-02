import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { getRequestSession } from "@/lib/auth/functions"
import { hashValue } from "@/lib/crypto"
import { requireAppUrl } from "@/lib/env"
import { buildMercadoPagoAuthorizationUrl } from "@/lib/mercado-pago/oauth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const session = await getRequestSession(request)
  const appUrl = requireAppUrl()

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", appUrl))
  }

  const state = randomBytes(32).toString("base64url")
  const stateHash = hashValue(state)
  const identifier = `mercado_pago_oauth_state:${session.user.id}`

  await prisma.verifications.deleteMany({
    where: {
      identifier,
    },
  })

  await prisma.verifications.create({
    data: {
      id: randomBytes(16).toString("hex"),
      identifier,
      value: stateHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  })

  return NextResponse.redirect(buildMercadoPagoAuthorizationUrl(state))
}
