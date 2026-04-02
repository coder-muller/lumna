import { decryptMercadoPagoToken, encryptMercadoPagoToken } from "@/lib/crypto"
import { requireMercadoPagoOAuthEnv } from "@/lib/env"
import { mercadoPagoConfig } from "@/lib/mercado-pago/config"
import { prisma } from "@/lib/prisma"

type MercadoPagoRefreshTokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in: number
  public_key?: string
  live_mode?: boolean
}

type MercadoPagoRequestOptions = {
  accessToken?: string
  method?: "GET" | "POST"
  body?: unknown
  headers?: HeadersInit
}

export async function mercadoPagoRequest<T>(
  path: string,
  options: MercadoPagoRequestOptions = {}
) {
  const response = await fetch(`${mercadoPagoConfig.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    | T
    | { message?: string }
    | null

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message
        : undefined

    throw new Error(
      message || `Mercado Pago request failed with status ${response.status}`
    )
  }

  return payload as T
}

async function refreshConnectionAccessToken(connection: {
  id: string
  encryptedRefreshToken: string | null
}) {
  if (!connection.encryptedRefreshToken) {
    throw new Error(
      "A conexão com o Mercado Pago expirou. Conecte a conta novamente."
    )
  }

  const oauth = requireMercadoPagoOAuthEnv()
  const refreshToken = decryptMercadoPagoToken(connection.encryptedRefreshToken)
  const refreshed = await mercadoPagoRequest<MercadoPagoRefreshTokenResponse>(
    "/oauth/token",
    {
      method: "POST",
      body: {
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
    }
  )

  await prisma.mercadoPagoConnection.update({
    where: {
      id: connection.id,
    },
    data: {
      encryptedAccessToken: encryptMercadoPagoToken(refreshed.access_token),
      encryptedRefreshToken: refreshed.refresh_token
        ? encryptMercadoPagoToken(refreshed.refresh_token)
        : connection.encryptedRefreshToken,
      accessTokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      publicKey: refreshed.public_key,
      liveMode: refreshed.live_mode ?? undefined,
      status: "CONNECTED",
      lastErrorAt: null,
      lastErrorMessage: null,
    },
  })

  return refreshed.access_token
}

export async function getConnectionAccessToken(connection: {
  id: string
  encryptedAccessToken: string | null
  encryptedRefreshToken?: string | null
  accessTokenExpiresAt?: Date | null
}) {
  if (!connection.encryptedAccessToken) {
    throw new Error("Mercado Pago access token is not available")
  }

  const expiresSoon = connection.accessTokenExpiresAt
    ? connection.accessTokenExpiresAt.getTime() <= Date.now() + 60_000
    : false

  if (!expiresSoon) {
    return decryptMercadoPagoToken(connection.encryptedAccessToken)
  }

  try {
    return await refreshConnectionAccessToken({
      id: connection.id,
      encryptedRefreshToken: connection.encryptedRefreshToken ?? null,
    })
  } catch (error) {
    await prisma.mercadoPagoConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        status: "ERROR",
        lastErrorAt: new Date(),
        lastErrorMessage:
          error instanceof Error
            ? error.message.slice(0, 1000)
            : "Falha ao renovar a conexão com o Mercado Pago",
      },
    })

    throw error
  }
}
