export function getAppUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.BETTER_AUTH_URL ??
    process.env.VERCEL_URL

  if (!fromEnv) {
    return "http://localhost:3000"
  }

  if (fromEnv.startsWith("http://") || fromEnv.startsWith("https://")) {
    return fromEnv.replace(/\/$/, "")
  }

  return `https://${fromEnv.replace(/\/$/, "")}`
}

/** AbacatePay rejects localhost and non-HTTPS webhook endpoints. */
export function canRegisterPublicWebhook(appUrl = getAppUrl()): boolean {
  try {
    const url = new URL(appUrl)

    if (url.protocol !== "https:") {
      return false
    }

    const host = url.hostname.toLowerCase()

    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}
