import {
  env,
  requireMercadoPagoAppUrl,
  requireMercadoPagoOAuthEnv,
} from "@/lib/env"
import type { CheckoutReturnValue } from "@/lib/billing/checkout"

export const mercadoPagoConfig = {
  apiBaseUrl: "https://api.mercadopago.com",
  authBaseUrl: "https://auth.mercadopago.com",
  platformFeePercent: env.mercadoPagoPlatformFeePercent,
} as const

export function getMercadoPagoWebhookUrl() {
  const url = new URL(`${requireMercadoPagoAppUrl()}/api/mercado-pago/webhook`)
  url.searchParams.set("source_news", "webhooks")

  return url.toString()
}

export function getMercadoPagoCheckoutReturnUrl(
  chargeId: string,
  checkout: CheckoutReturnValue
) {
  const url = new URL(
    `${requireMercadoPagoAppUrl()}/checkout/return/${chargeId}`
  )
  url.searchParams.set("checkout", checkout)

  return url.toString()
}

export function getMercadoPagoOAuthConfig() {
  const oauth = requireMercadoPagoOAuthEnv()

  return {
    ...oauth,
    authorizationUrl: `${mercadoPagoConfig.authBaseUrl}/authorization`,
  }
}
