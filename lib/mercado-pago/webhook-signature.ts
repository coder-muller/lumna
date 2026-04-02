import { createHexHmac, safeCompareHex } from "@/lib/crypto"
import { env } from "@/lib/env"

function parseSignatureHeader(headerValue: string | null) {
  if (!headerValue) {
    return null
  }

  const entries = headerValue.split(",").map((part) => part.trim().split("="))
  const signature = Object.fromEntries(entries)

  if (!signature.ts || !signature.v1) {
    return null
  }

  return {
    ts: signature.ts,
    v1: signature.v1,
  }
}

type WebhookValidationInput = {
  request: Request
  body: string
  resourceId?: string | null
}

export function validateMercadoPagoWebhookSignature({
  request,
  body: _body,
  resourceId,
}: WebhookValidationInput) {
  const secret = env.mercadoPagoWebhookSecret

  if (!secret) {
    return process.env.NODE_ENV === "development"
  }

  const signature = parseSignatureHeader(request.headers.get("x-signature"))
  const requestId = request.headers.get("x-request-id")
  const dataId =
    resourceId ?? new URL(request.url).searchParams.get("data.id") ?? undefined

  if (!signature || !requestId || !dataId) {
    return false
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`
  const digest = createHexHmac(manifest, secret)

  return safeCompareHex(digest, signature.v1)
}
