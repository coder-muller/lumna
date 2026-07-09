import "server-only"

import { abacateFetch } from "./client"

export type AbacateProduct = {
  id: string
}

export type CreateAbacateProductInput = {
  externalId: string
  name: string
  price: number
  currency?: "BRL"
  description?: string | null
}

export async function createAbacateProduct(
  input: CreateAbacateProductInput
): Promise<{ data: AbacateProduct } | { error: string; status?: number }> {
  const body = {
    externalId: input.externalId,
    name: input.name,
    price: input.price,
    currency: input.currency ?? "BRL",
    ...(input.description ? { description: input.description } : {}),
  }

  return abacateFetch<AbacateProduct>("/products/create", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
