import "server-only"

import { getDecryptedApiKey } from "@/server/abacatepay-credentials/get-decrypted-api-key"

const BASE = "https://api.abacatepay.com/v2"

type AbacateEnvelope<T> = {
  data?: T
  success?: boolean
  error?: string | null
}

export type AbacateApiError = {
  error: string
  status?: number
}

export type AbacateFetchResult<T> = { data: T } | AbacateApiError

export async function abacateFetch<T>(
  path: string,
  init?: RequestInit
): Promise<AbacateFetchResult<T>> {
  const apiKeyResult = await getDecryptedApiKey()

  if ("error" in apiKeyResult) {
    return { error: apiKeyResult.error }
  }

  const hasBody = init?.body !== undefined && init?.body !== null

  try {
    const response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
        Authorization: `Bearer ${apiKeyResult.data}`,
      },
    })

    let envelope: AbacateEnvelope<T>

    try {
      envelope = (await response.json()) as AbacateEnvelope<T>
    } catch {
      if (!response.ok) {
        return {
          error: "Não foi possível processar a resposta da AbacatePay.",
          status: response.status,
        }
      }

      return { error: "Resposta inválida da AbacatePay." }
    }

    if (!response.ok) {
      return {
        error:
          envelope.error ??
          "Não foi possível concluir a operação na AbacatePay.",
        status: response.status,
      }
    }

    if (envelope.data === undefined) {
      return {
        error: envelope.error ?? "Resposta inválida da AbacatePay.",
      }
    }

    return { data: envelope.data }
  } catch {
    return {
      error:
        "Não foi possível conectar à AbacatePay. Verifique sua conexão e tente novamente.",
    }
  }
}
