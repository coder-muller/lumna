import "server-only"

import { abacateFetch, abacateFetchWithKey } from "./client"

export type AbacateCheckout = {
  id: string
  url: string
  amount: number
  status: string
  externalId?: string | null
  customerId?: string | null
}

export type CreateAbacateCheckoutInput = {
  items: Array<{ id: string; quantity: number }>
  customerId: string
  externalId: string
  returnUrl: string
  completionUrl: string
  methods?: Array<"PIX" | "CARD">
  frequency?: "ONE_TIME"
}

export type RefundAbacateCheckoutInput = {
  id: string
  reason?: string
}

export async function createAbacateCheckout(
  input: CreateAbacateCheckoutInput
): Promise<{ data: AbacateCheckout } | { error: string; status?: number }> {
  const body = {
    items: input.items,
    customerId: input.customerId,
    externalId: input.externalId,
    returnUrl: input.returnUrl,
    completionUrl: input.completionUrl,
    methods: input.methods ?? ["PIX", "CARD"],
    frequency: input.frequency ?? "ONE_TIME",
  }

  return abacateFetch<AbacateCheckout>("/checkouts/create", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function refundAbacateCheckout(
  input: RefundAbacateCheckoutInput,
  apiKey?: string
): Promise<{ data: AbacateCheckout } | { error: string; status?: number }> {
  const body = JSON.stringify({
    id: input.id,
    ...(input.reason ? { reason: input.reason } : {}),
  })

  if (apiKey) {
    return abacateFetchWithKey<AbacateCheckout>(apiKey, "/checkouts/refund", {
      method: "POST",
      body,
    })
  }

  return abacateFetch<AbacateCheckout>("/checkouts/refund", {
    method: "POST",
    body,
  })
}
