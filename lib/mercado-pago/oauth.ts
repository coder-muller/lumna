import { createSha256Base64Url } from "@/lib/crypto"
import { mercadoPagoRequest } from "@/lib/mercado-pago/client"
import { getMercadoPagoOAuthConfig } from "@/lib/mercado-pago/config"

type MercadoPagoOAuthTokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: number
  public_key?: string
  live_mode?: boolean
}

export function buildMercadoPagoAuthorizationUrl(
  state: string,
  codeChallenge: string
) {
  const oauth = getMercadoPagoOAuthConfig()
  const url = new URL(oauth.authorizationUrl)

  url.searchParams.set("client_id", oauth.clientId)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("platform_id", "mp")
  url.searchParams.set("state", state)
  url.searchParams.set("redirect_uri", oauth.redirectUri)
  url.searchParams.set("code_challenge", codeChallenge)
  url.searchParams.set("code_challenge_method", "S256")

  return url.toString()
}

export function createMercadoPagoCodeChallenge(codeVerifier: string) {
  return createSha256Base64Url(codeVerifier)
}

export async function exchangeMercadoPagoCode(
  code: string,
  codeVerifier: string
) {
  const oauth = getMercadoPagoOAuthConfig()

  return mercadoPagoRequest<MercadoPagoOAuthTokenResponse>("/oauth/token", {
    method: "POST",
    body: {
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: oauth.redirectUri,
      code_verifier: codeVerifier,
    },
  })
}
