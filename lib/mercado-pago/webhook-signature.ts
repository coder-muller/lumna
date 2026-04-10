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
  resourceId?: string | null
}

export type MercadoPagoWebhookValidationResult = {
  isValid: boolean
  shouldReject: boolean
  mode: "signed" | "unsigned" | "development-bypass"
  reason?: string
}

export function validateMercadoPagoWebhookSignature({
  request,
  resourceId,
}: WebhookValidationInput): MercadoPagoWebhookValidationResult {
  const secret = env.mercadoPagoWebhookSecret
  const signatureHeader = request.headers.get("x-signature")
  const requestId = request.headers.get("x-request-id")

  if (!signatureHeader) {
    return {
      isValid: true,
      shouldReject: false,
      mode: "unsigned",
      reason: "missing x-signature header",
    }
  }

  if (!secret) {
    const isDevelopment = process.env.NODE_ENV === "development"

    return {
      isValid: isDevelopment,
      shouldReject: !isDevelopment,
      mode: isDevelopment ? "development-bypass" : "signed",
      reason: isDevelopment
        ? "webhook secret not configured; bypass enabled in development"
        : "missing webhook secret configuration",
    }
  }

  const signature = parseSignatureHeader(signatureHeader)
  const dataId =
    resourceId ?? new URL(request.url).searchParams.get("data.id") ?? undefined

  if (!signature) {
    return {
      isValid: false,
      shouldReject: true,
      mode: "signed",
      reason: "invalid x-signature header format",
    }
  }

  if (!requestId) {
    return {
      isValid: false,
      shouldReject: true,
      mode: "signed",
      reason: "missing x-request-id header",
    }
  }

  if (!dataId) {
    return {
      isValid: false,
      shouldReject: true,
      mode: "signed",
      reason: "missing data.id for signature validation",
    }
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`
  const digest = createHexHmac(manifest, secret)
  const isValid = safeCompareHex(digest, signature.v1)

  return {
    isValid,
    shouldReject: !isValid,
    mode: "signed",
    reason: isValid ? undefined : "signature digest mismatch",
  }
}
