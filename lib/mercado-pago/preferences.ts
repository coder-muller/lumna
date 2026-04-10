import { mercadoPagoRequest } from "@/lib/mercado-pago/client"
import {
  getMercadoPagoCheckoutReturnUrl,
  getMercadoPagoWebhookUrl,
  mercadoPagoConfig,
} from "@/lib/mercado-pago/config"
import { logMercadoPagoInfo } from "@/lib/mercado-pago/log"

type CreatePreferenceInput = {
  accessToken: string
  chargeId: string
  externalReference: string
  title: string
  description?: string | null
  amount: number
  payerEmail?: string | null
  expiresAt?: Date | null
  checkoutEnvironment: "LIVE" | "SANDBOX"
}

type MercadoPagoPreferenceResponse = {
  id: string
  init_point?: string
  sandbox_init_point?: string
}

export async function createCheckoutPreference(input: CreatePreferenceInput) {
  const marketplaceFee = mercadoPagoConfig.platformFeePercent
    ? Number(
        (input.amount * (mercadoPagoConfig.platformFeePercent / 100)).toFixed(2)
      )
    : undefined

  logMercadoPagoInfo("preference.create.request", {
    chargeId: input.chargeId,
    externalReference: input.externalReference,
    amount: input.amount,
    checkoutEnvironment: input.checkoutEnvironment,
  })

  const preference = await mercadoPagoRequest<MercadoPagoPreferenceResponse>(
    "/checkout/preferences",
    {
      accessToken: input.accessToken,
      method: "POST",
      body: {
        items: [
          {
            id: input.externalReference,
            title: input.title,
            description: input.description ?? undefined,
            quantity: 1,
            unit_price: input.amount,
            currency_id: "BRL",
          },
        ],
        external_reference: input.externalReference,
        payer: input.payerEmail ? { email: input.payerEmail } : undefined,
        back_urls: {
          success: getMercadoPagoCheckoutReturnUrl(input.chargeId, "success"),
          pending: getMercadoPagoCheckoutReturnUrl(input.chargeId, "pending"),
          failure: getMercadoPagoCheckoutReturnUrl(input.chargeId, "failure"),
        },
        auto_return: "approved",
        notification_url: getMercadoPagoWebhookUrl(),
        expires: Boolean(input.expiresAt),
        expiration_date_to: input.expiresAt?.toISOString(),
        marketplace_fee: marketplaceFee,
      },
    }
  )

  logMercadoPagoInfo("preference.create.success", {
    chargeId: input.chargeId,
    preferenceId: preference.id,
    checkoutEnvironment: input.checkoutEnvironment,
    hasInitPoint: Boolean(preference.init_point),
    hasSandboxInitPoint: Boolean(preference.sandbox_init_point),
  })

  return preference
}
