import { randomBytes } from "node:crypto"
import { NextResponse } from "next/server"
import { getRequestSession } from "@/lib/auth/functions"
import {
  encryptMercadoPagoToken,
  hashValue,
} from "@/lib/crypto"
import { requireAppUrl } from "@/lib/env"
import { logMercadoPagoInfo } from "@/lib/mercado-pago/log"
import {
  buildMercadoPagoAuthorizationUrl,
  createMercadoPagoCodeChallenge,
} from "@/lib/mercado-pago/oauth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const session = await getRequestSession(request)
  const appUrl = requireAppUrl()

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", appUrl))
  }

  const state = randomBytes(32).toString("base64url")
  const codeVerifier = randomBytes(64).toString("base64url")
  const codeChallenge = createMercadoPagoCodeChallenge(codeVerifier)
  const stateHash = hashValue(state)
  const stateIdentifier = `mercado_pago_oauth_state:${session.user.id}`
  const codeVerifierIdentifier = `mercado_pago_oauth_code_verifier:${session.user.id}`

  await prisma.verifications.deleteMany({
    where: {
      identifier: {
        in: [stateIdentifier, codeVerifierIdentifier],
      },
    },
  })

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.verifications.createMany({
    data: [
      {
        id: randomBytes(16).toString("hex"),
        identifier: stateIdentifier,
        value: stateHash,
        expiresAt,
      },
      {
        id: randomBytes(16).toString("hex"),
        identifier: codeVerifierIdentifier,
        value: encryptMercadoPagoToken(codeVerifier),
        expiresAt,
      },
    ],
  })

  logMercadoPagoInfo("oauth.start", {
    userId: session.user.id,
  })

  return NextResponse.redirect(
    buildMercadoPagoAuthorizationUrl(state, codeChallenge)
  )
}
