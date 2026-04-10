import { type ChargeStatusValue, isChargeStatus } from "@/lib/billing/status"

const checkoutStatuses = ["success", "pending", "failure"] as const

const mercadoPagoReturnParamKeys = [
  "status",
  "payment_id",
  "collection_id",
  "collection_status",
  "external_reference",
  "payment_type",
  "merchant_order_id",
  "preference_id",
  "site_id",
  "processing_mode",
  "merchant_account_id",
] as const

type SearchParamValue = string | string[] | undefined

export type ChargeCheckoutValue = (typeof checkoutStatuses)[number]
export type RawChargeSearchParams = Record<string, SearchParamValue>
export type ParsedChargeSearchParams = {
  query?: string
  chargeStatus?: ChargeStatusValue | "ALL"
  checkout?: ChargeCheckoutValue
  shouldRedirectToCanonicalUrl: boolean
  canonicalSearch: string
}

function getSearchParamValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function normalizeSearchParam(value: SearchParamValue) {
  const normalized = getSearchParamValue(value)?.trim()

  return normalized ? normalized : undefined
}

function isCheckoutValue(
  value: string | undefined
): value is ChargeCheckoutValue {
  return (
    value !== undefined &&
    checkoutStatuses.includes(value as ChargeCheckoutValue)
  )
}

export function buildChargeSearch(params: {
  query?: string
  chargeStatus?: ChargeStatusValue | "ALL"
  checkout?: ChargeCheckoutValue
}) {
  const searchParams = new URLSearchParams()

  if (params.query) {
    searchParams.set("q", params.query)
  }

  if (params.chargeStatus && params.chargeStatus !== "ALL") {
    searchParams.set("chargeStatus", params.chargeStatus)
  }

  if (params.checkout) {
    searchParams.set("checkout", params.checkout)
  }

  return searchParams.toString()
}

export function parseChargeSearchParams(
  searchParams: RawChargeSearchParams
): ParsedChargeSearchParams {
  const rawQuery = getSearchParamValue(searchParams.q)
  const rawChargeStatus = normalizeSearchParam(searchParams.chargeStatus)
  const rawLegacyStatus = normalizeSearchParam(searchParams.status)
  const rawCheckout = normalizeSearchParam(searchParams.checkout)

  const query = normalizeSearchParam(searchParams.q)
  const chargeStatus =
    rawChargeStatus === "ALL"
      ? "ALL"
      : isChargeStatus(rawChargeStatus)
        ? rawChargeStatus
        : rawChargeStatus === undefined && isChargeStatus(rawLegacyStatus)
          ? rawLegacyStatus
          : undefined
  const checkout = isCheckoutValue(rawCheckout) ? rawCheckout : undefined
  const canonicalSearch = buildChargeSearch({
    query,
    chargeStatus,
    checkout,
  })

  const hasMercadoPagoReturnParams = mercadoPagoReturnParamKeys.some(
    (key) => searchParams[key] !== undefined
  )
  const usedLegacyStatus =
    rawChargeStatus === undefined && isChargeStatus(rawLegacyStatus)
  const hasInvalidChargeStatus =
    rawChargeStatus !== undefined &&
    rawChargeStatus !== "ALL" &&
    !isChargeStatus(rawChargeStatus)
  const hasExplicitAllChargeStatus = rawChargeStatus === "ALL"
  const hasInvalidCheckout =
    rawCheckout !== undefined && !isCheckoutValue(rawCheckout)
  const hasNormalizedQuery = searchParams.q !== undefined && query !== rawQuery

  return {
    query,
    chargeStatus,
    checkout,
    shouldRedirectToCanonicalUrl:
      hasMercadoPagoReturnParams ||
      usedLegacyStatus ||
      hasInvalidChargeStatus ||
      hasExplicitAllChargeStatus ||
      hasInvalidCheckout ||
      hasNormalizedQuery,
    canonicalSearch,
  }
}
