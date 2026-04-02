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

export function buildMercadoPagoAuthorizationUrl(state: string) {
  const oauth = getMercadoPagoOAuthConfig()
  const url = new URL(oauth.authorizationUrl)

  url.searchParams.set("client_id", oauth.clientId)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("platform_id", "mp")
  url.searchParams.set("state", state)
  url.searchParams.set("redirect_uri", oauth.redirectUri)

  return url.toString()
}

export async function exchangeMercadoPagoCode(code: string) {
  const oauth = getMercadoPagoOAuthConfig()

  return mercadoPagoRequest<MercadoPagoOAuthTokenResponse>("/oauth/token", {
    method: "POST",
    body: {
      client_id: oauth.clientId,
      client_secret: oauth.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: oauth.redirectUri,
    },
  })
}
