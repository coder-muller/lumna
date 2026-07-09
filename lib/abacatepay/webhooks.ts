import "server-only"

import { abacateFetch, abacateFetchWithKey } from "./client"

export type AbacateWebhook = {
  id: string
  name: string
  endpoint: string
  events: string[]
  devMode?: boolean
  v2?: boolean
}

export type CreateAbacateWebhookInput = {
  name: string
  endpoint: string
  secret: string
  events: string[]
}

export async function createAbacateWebhook(
  input: CreateAbacateWebhookInput,
  apiKey?: string
): Promise<{ data: AbacateWebhook } | { error: string; status?: number }> {
  const body = JSON.stringify(input)

  if (apiKey) {
    return abacateFetchWithKey<AbacateWebhook>(apiKey, "/webhooks/create", {
      method: "POST",
      body,
    })
  }

  return abacateFetch<AbacateWebhook>("/webhooks/create", {
    method: "POST",
    body,
  })
}

export async function deleteAbacateWebhook(
  id: string,
  apiKey?: string
): Promise<{ data: { deleted: true } } | { error: string; status?: number }> {
  const path = `/webhooks/delete?id=${encodeURIComponent(id)}`
  const result = apiKey
    ? await abacateFetchWithKey<unknown>(apiKey, path, { method: "POST" })
    : await abacateFetch<unknown>(path, { method: "POST" })

  if ("error" in result) {
    if (result.status === 404) {
      return { data: { deleted: true } }
    }

    return result
  }

  return { data: { deleted: true } }
}
