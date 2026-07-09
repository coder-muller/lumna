/** Official AbacatePay URLs verified as reachable (HTTP 200). */
export const ABACATEPAY_APP_URL = "https://app.abacatepay.com"
export const ABACATEPAY_WEBHOOKS_DASHBOARD_URL =
  "https://app.abacatepay.com/webhooks"
export const ABACATEPAY_DOCS_AUTH_URL =
  "https://docs.abacatepay.com/pages/authentication"
export const ABACATEPAY_DOCS_WEBHOOKS_URL =
  "https://docs.abacatepay.com/pages/webhooks"

export const ABACATEPAY_REQUIRED_PERMISSIONS = [
  "STORE:READ",
  "CUSTOMER:CREATE",
  "CUSTOMER:DELETE",
  "PRODUCT:CREATE",
  "CHECKOUT:CREATE",
  "CHECKOUT:READ",
  "WEBHOOK:CREATE",
  "WEBHOOK:DELETE",
] as const
