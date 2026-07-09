import {
  normalizeDocument,
  toLocalPhoneDigits,
} from "@/lib/validators/user-data"

export type UserDataFormatType = "cpf" | "cnpj" | "phone" | "document"

function formatCNPJValue(cleaned: string): string {
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
}

export function formatCPF(value: string | undefined | null): string {
  if (!value) return ""
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  return value
}

export function formatCNPJ(value: string | undefined | null): string {
  if (!value) return ""
  const cleaned = normalizeDocument(value)
  if (cleaned.length === 14) {
    return formatCNPJValue(cleaned)
  }
  return value
}

export function formatPhone(value: string | undefined | null): string {
  if (!value) return ""
  const digits = toLocalPhoneDigits(value)

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }

  return value
}

export function formatDocument(value: string | undefined | null): string {
  if (!value) return ""
  const cleaned = normalizeDocument(value)
  if (cleaned.length === 11 && /^\d{11}$/.test(cleaned)) {
    return formatCPF(cleaned)
  }
  return formatCNPJ(cleaned)
}

export function format(
  type: UserDataFormatType,
  value: string | undefined | null
): string {
  switch (type) {
    case "cpf":
      return formatCPF(value)
    case "cnpj":
      return formatCNPJ(value)
    case "phone":
      return formatPhone(value)
    case "document":
      return formatDocument(value)
    default:
      return value ?? ""
  }
}
