type MercadoPagoLogLevel = "info" | "warn" | "error"

function log(level: MercadoPagoLogLevel, event: string, data?: unknown) {
  const payload =
    data === undefined
      ? `[mercado-pago] ${event}`
      : `[mercado-pago] ${event} ${JSON.stringify(data)}`

  if (level === "error") {
    console.error(payload)
    return
  }

  if (level === "warn") {
    console.warn(payload)
    return
  }

  console.info(payload)
}

export function logMercadoPagoInfo(event: string, data?: unknown) {
  log("info", event, data)
}

export function logMercadoPagoWarn(event: string, data?: unknown) {
  log("warn", event, data)
}

export function logMercadoPagoError(event: string, data?: unknown) {
  log("error", event, data)
}
