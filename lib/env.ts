const ENV_KEYS = {
  appUrl: "APP_URL",
  betterAuthUrl: "BETTER_AUTH_URL",
  mercadoPagoClientId: "MERCADO_PAGO_CLIENT_ID",
  mercadoPagoClientSecret: "MERCADO_PAGO_CLIENT_SECRET",
  mercadoPagoRedirectUri: "MERCADO_PAGO_REDIRECT_URI",
  mercadoPagoWebhookSecret: "MERCADO_PAGO_WEBHOOK_SECRET",
  mercadoPagoEncryptionSecret: "MERCADO_PAGO_ENCRYPTION_SECRET",
  mercadoPagoPlatformFeePercent: "MERCADO_PAGO_PLATFORM_FEE_PERCENT",
} as const

type EnvKey = keyof typeof ENV_KEYS

function getOptionalEnv(key: EnvKey) {
  const value = process.env[ENV_KEYS[key]]?.trim()

  return value ? value : undefined
}

function getRequiredEnv(key: EnvKey) {
  const value = getOptionalEnv(key)

  if (!value) {
    throw new Error(`Missing required environment variable: ${ENV_KEYS[key]}`)
  }

  return value
}

function normalizeUrl(value: string) {
  return value.replace(/\/$/, "")
}

function getOptionalNumber(key: EnvKey) {
  const value = getOptionalEnv(key)

  if (!value) {
    return undefined
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric environment variable: ${ENV_KEYS[key]}`)
  }

  return parsed
}

export const env = {
  appUrl: (() => {
    const value = getOptionalEnv("appUrl") ?? getOptionalEnv("betterAuthUrl")

    return value ? normalizeUrl(value) : undefined
  })(),
  mercadoPagoClientId: getOptionalEnv("mercadoPagoClientId"),
  mercadoPagoClientSecret: getOptionalEnv("mercadoPagoClientSecret"),
  mercadoPagoRedirectUri: getOptionalEnv("mercadoPagoRedirectUri"),
  mercadoPagoWebhookSecret: getOptionalEnv("mercadoPagoWebhookSecret"),
  mercadoPagoEncryptionSecret: getOptionalEnv("mercadoPagoEncryptionSecret"),
  mercadoPagoPlatformFeePercent: getOptionalNumber(
    "mercadoPagoPlatformFeePercent"
  ),
} as const

export function requireAppUrl() {
  return env.appUrl ?? normalizeUrl(getRequiredEnv("appUrl"))
}

export function requireMercadoPagoOAuthEnv() {
  return {
    clientId: getRequiredEnv("mercadoPagoClientId"),
    clientSecret: getRequiredEnv("mercadoPagoClientSecret"),
    redirectUri: normalizeUrl(getRequiredEnv("mercadoPagoRedirectUri")),
  }
}

export function requireMercadoPagoEncryptionSecret() {
  return getRequiredEnv("mercadoPagoEncryptionSecret")
}
