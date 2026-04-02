import { NextResponse } from "next/server"
import { getRequestSession } from "@/lib/auth/functions"
import { encryptMercadoPagoToken, hashValue } from "@/lib/crypto"
import { requireAppUrl } from "@/lib/env"
import { exchangeMercadoPagoCode } from "@/lib/mercado-pago/oauth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const session = await getRequestSession(request)
  const appUrl = requireAppUrl()

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", appUrl))
  }

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const identifier = `mercado_pago_oauth_state:${session.user.id}`

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/configuracoes?tab=mercado-pago&error=oauth", appUrl)
    )
  }

  const verification = await prisma.verifications.findFirst({
    where: {
      identifier,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      expiresAt: "desc",
    },
  })

  if (!verification || verification.value !== hashValue(state)) {
    return NextResponse.redirect(
      new URL("/configuracoes?tab=mercado-pago&error=state", appUrl)
    )
  }

  await prisma.verifications.deleteMany({
    where: {
      identifier,
    },
  })

  try {
    const token = await exchangeMercadoPagoCode(code)
    const nextMercadoPagoUserId = String(token.user_id)
    const existingConnection = await prisma.mercadoPagoConnection.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        mercadoPagoUserId: true,
        charges: {
          where: {
            status: {
              in: ["DRAFT", "OPEN", "PENDING"],
            },
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    })

    if (
      existingConnection?.mercadoPagoUserId &&
      existingConnection.mercadoPagoUserId !== nextMercadoPagoUserId &&
      existingConnection.charges.length > 0
    ) {
      await prisma.mercadoPagoConnection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          status: "ERROR",
          lastErrorAt: new Date(),
          lastErrorMessage:
            "Finalize as cobranças em aberto antes de trocar a conta do Mercado Pago.",
        },
      })

      return NextResponse.redirect(
        new URL(
          "/configuracoes?tab=mercado-pago&error=different-account",
          appUrl
        )
      )
    }

    await prisma.mercadoPagoConnection.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        status: "CONNECTED",
        mercadoPagoUserId: nextMercadoPagoUserId,
        publicKey: token.public_key,
        liveMode: Boolean(token.live_mode),
        encryptedAccessToken: encryptMercadoPagoToken(token.access_token),
        encryptedRefreshToken: encryptMercadoPagoToken(token.refresh_token),
        accessTokenExpiresAt: new Date(Date.now() + token.expires_in * 1000),
        connectedAt: new Date(),
        lastErrorAt: null,
        lastErrorMessage: null,
      },
      update: {
        status: "CONNECTED",
        mercadoPagoUserId: nextMercadoPagoUserId,
        publicKey: token.public_key,
        liveMode: Boolean(token.live_mode),
        encryptedAccessToken: encryptMercadoPagoToken(token.access_token),
        encryptedRefreshToken: encryptMercadoPagoToken(token.refresh_token),
        accessTokenExpiresAt: new Date(Date.now() + token.expires_in * 1000),
        connectedAt: new Date(),
        lastErrorAt: null,
        lastErrorMessage: null,
      },
    })
  } catch (error) {
    await prisma.mercadoPagoConnection.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        status: "ERROR",
        lastErrorAt: new Date(),
        lastErrorMessage:
          error instanceof Error
            ? error.message
            : "Falha ao conectar com o Mercado Pago",
      },
      update: {
        status: "ERROR",
        lastErrorAt: new Date(),
        lastErrorMessage:
          error instanceof Error
            ? error.message
            : "Falha ao conectar com o Mercado Pago",
      },
    })

    return NextResponse.redirect(
      new URL("/configuracoes?tab=mercado-pago&error=exchange", appUrl)
    )
  }

  return NextResponse.redirect(
    new URL("/configuracoes?tab=mercado-pago&success=connected", appUrl)
  )
}
