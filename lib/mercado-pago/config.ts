import { env, requireAppUrl, requireMercadoPagoOAuthEnv } from "@/lib/env"

export const mercadoPagoConfig = {
  apiBaseUrl: "https://api.mercadopago.com",
  authBaseUrl: "https://auth.mercadopago.com.br",
  platformFeePercent: env.mercadoPagoPlatformFeePercent,
} as const

export function getMercadoPagoWebhookUrl() {
  return `${requireAppUrl()}/api/mercado-pago/webhook`
}

export function getMercadoPagoOAuthConfig() {
  const oauth = requireMercadoPagoOAuthEnv()

  return {
    ...oauth,
    authorizationUrl: `${mercadoPagoConfig.authBaseUrl}/authorization`,
  }
}
