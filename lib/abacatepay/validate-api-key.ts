export type ValidateApiKeyResult = { ok: true } | { ok: false; error: string }

const ABACATEPAY_STORES_URL = "https://api.abacatepay.com/v2/stores/get"

export async function validateAbacatePayApiKey(
  apiKey: string
): Promise<ValidateApiKeyResult> {
  try {
    const response = await fetch(ABACATEPAY_STORES_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.status === 200) {
      return { ok: true }
    }

    if (response.status === 401) {
      return {
        ok: false,
        error: "Chave de API inválida ou revogada",
      }
    }

    if (response.status === 403) {
      return {
        ok: false,
        error:
          "Esta chave não tem permissão para ler a loja. Crie uma chave com a permissão STORE:READ no dashboard da AbacatePay.",
      }
    }

    return {
      ok: false,
      error: "Não foi possível validar a chave de API. Tente novamente.",
    }
  } catch {
    return {
      ok: false,
      error:
        "Não foi possível conectar à AbacatePay. Verifique sua conexão e tente novamente.",
    }
  }
}
