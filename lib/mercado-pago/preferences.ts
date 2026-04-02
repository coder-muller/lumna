import { mercadoPagoRequest } from "@/lib/mercado-pago/client"
import {
  getMercadoPagoWebhookUrl,
  mercadoPagoConfig,
} from "@/lib/mercado-pago/config"
import { requireAppUrl } from "@/lib/env"

type CreatePreferenceInput = {
  accessToken: string
  externalReference: string
  title: string
  description?: string | null
  amount: number
  payerEmail?: string | null
  expiresAt?: Date | null
}

type MercadoPagoPreferenceResponse = {
  id: string
  init_point?: string
  sandbox_init_point?: string
}

export async function createCheckoutPreference(input: CreatePreferenceInput) {
  const appUrl = requireAppUrl()
  const marketplaceFee = mercadoPagoConfig.platformFeePercent
    ? Number(
        (input.amount * (mercadoPagoConfig.platformFeePercent / 100)).toFixed(2)
      )
    : undefined

  return mercadoPagoRequest<MercadoPagoPreferenceResponse>(
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
          success: `${appUrl}/cobrancas?checkout=success`,
          pending: `${appUrl}/cobrancas?checkout=pending`,
          failure: `${appUrl}/cobrancas?checkout=failure`,
        },
        auto_return: "approved",
        notification_url: getMercadoPagoWebhookUrl(),
        expires: Boolean(input.expiresAt),
        expiration_date_to: input.expiresAt?.toISOString(),
        marketplace_fee: marketplaceFee,
      },
    }
  )
}
