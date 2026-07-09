export function mapAbacatePayError(message: string | null | undefined): string {
  if (!message) {
    return "Não foi possível concluir a operação na AbacatePay."
  }

  const normalized = message.toLowerCase()

  if (
    normalized.includes("https") &&
    (normalized.includes("webhook") || normalized.includes("url"))
  ) {
    return "A AbacatePay só aceita webhooks em HTTPS público. Em localhost, use um tunnel (ngrok, Cloudflare Tunnel) e defina NEXT_PUBLIC_APP_URL com essa URL."
  }

  if (normalized.includes("permission") || normalized.includes("forbidden")) {
    return "Sua chave não tem a permissão necessária na AbacatePay. Edite a chave no dashboard e inclua as permissões pedidas no onboarding."
  }

  return message
}
