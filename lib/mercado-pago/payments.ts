import { mercadoPagoRequest } from "@/lib/mercado-pago/client"

export type MercadoPagoPayment = {
  id: number | string
  status?: string
  status_detail?: string
  date_created?: string
  date_last_updated?: string
  transaction_amount?: number
  marketplace_fee?: number
  fee_details?: Array<{ amount?: number; type?: string }>
  transaction_details?: {
    total_paid_amount?: number
    net_received_amount?: number
  }
  currency_id?: string
  date_approved?: string
  payer?: {
    email?: string
  }
  external_reference?: string
  payment_method_id?: string
  payment_type_id?: string
}

type SearchPaymentsResponse = {
  results?: MercadoPagoPayment[]
}

export async function getMercadoPagoPaymentById(
  accessToken: string,
  paymentId: string
) {
  return mercadoPagoRequest<MercadoPagoPayment>(`/v1/payments/${paymentId}`, {
    accessToken,
  })
}

export async function searchMercadoPagoPaymentsByExternalReference(
  accessToken: string,
  externalReference: string
) {
  const searchParams = new URLSearchParams({
    external_reference: externalReference,
    sort: "date_created",
    criteria: "desc",
    limit: "20",
  })

  const response = await mercadoPagoRequest<SearchPaymentsResponse>(
    `/v1/payments/search?${searchParams.toString()}`,
    {
      accessToken,
    }
  )

  return response.results ?? []
}
