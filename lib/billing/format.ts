function coerceNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const parsed = typeof value === "number" ? value : Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

export function formatCurrency(
  value: number | string | null | undefined,
  currency = "BRL"
) {
  const numericValue = coerceNumber(value)

  if (numericValue === null) {
    return "-"
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(numericValue)
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value))
}
