import "server-only"

import { abacateFetch } from "./client"

export type AbacateCustomer = {
  id: string
  email: string
  name?: string | null
  cellphone?: string | null
  taxId?: string | null
}

export type CreateAbacateCustomerInput = {
  email: string
  name?: string
  cellphone?: string
  taxId?: string
}

export type DeleteAbacateCustomerResult =
  { data: { deleted: true } } | { error: string; status?: number }

export function toAbacateCellphone(phoneDigitsWith55: string): string {
  return phoneDigitsWith55.startsWith("+")
    ? phoneDigitsWith55
    : `+${phoneDigitsWith55}`
}

export async function createAbacateCustomer(
  input: CreateAbacateCustomerInput
): Promise<{ data: AbacateCustomer } | { error: string; status?: number }> {
  // OpenAPI v2 expects customer fields at the root (not wrapped in `data`).
  const body = {
    email: input.email,
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.cellphone !== undefined ? { cellphone: input.cellphone } : {}),
    ...(input.taxId !== undefined ? { taxId: input.taxId } : {}),
  }

  return abacateFetch<AbacateCustomer>("/customers/create", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function deleteAbacateCustomer(
  id: string
): Promise<DeleteAbacateCustomerResult> {
  // OpenAPI v2 expects `id` as a required query parameter.
  const result = await abacateFetch<unknown>(
    `/customers/delete?id=${encodeURIComponent(id)}`,
    { method: "POST" }
  )

  if ("error" in result) {
    if (result.status === 404) {
      return { data: { deleted: true } }
    }

    return result
  }

  return { data: { deleted: true } }
}
