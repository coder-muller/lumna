import {
  normalizeDocument,
  toLocalPhoneDigits,
} from "@/lib/validators/user-data"

const onlyDigits = (v: string) => v.replace(/\D/g, "")
const limit = (v: string, max: number) => v.slice(0, max)

function cleanCNPJInput(value: string): string {
  const chars: string[] = []

  for (const char of value.toUpperCase()) {
    if (/[./\- ]/.test(char)) continue
    if (!/[A-Z0-9]/.test(char)) continue

    const index = chars.length
    if (index < 12) {
      chars.push(char)
    } else if (/\d/.test(char)) {
      chars.push(char)
    }

    if (chars.length >= 14) break
  }

  return chars.join("")
}

function formatCNPJProgressive(value: string): string {
  if (value.length > 12) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`
  }
  if (value.length > 8) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`
  }
  if (value.length > 5) {
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`
  }
  if (value.length > 2) {
    return `${value.slice(0, 2)}.${value.slice(2)}`
  }
  return value
}

export function maskCPF(value?: string): string {
  if (!value) return ""
  const v = limit(onlyDigits(value), 11)

  if (v.length > 9) {
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
  }
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3")
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, "$1.$2")
  return v
}

export function maskCNPJ(value?: string): string {
  if (!value) return ""
  const v = cleanCNPJInput(value)
  return formatCNPJProgressive(v)
}

export function maskPhone(value?: string): string {
  if (!value) return ""
  const v = limit(toLocalPhoneDigits(value), 11)

  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, "($1) $2")
  return v
}

export function maskDocument(value?: string): string {
  if (!value) return ""
  const cleaned = normalizeDocument(value)
  if (/[A-Z]/.test(cleaned) || cleaned.length > 11) return maskCNPJ(value)
  return maskCPF(value)
}

export function removeMask(value: string): string {
  if (!value) return ""
  return value.replace(/\D/g, "")
}

export function removeDocumentMask(value: string): string {
  return normalizeDocument(value)
}

export type UserDataMaskType = "cpf" | "cnpj" | "phone" | "document"

export function applyMask(mask: UserDataMaskType, value?: string): string {
  switch (mask) {
    case "cpf":
      return maskCPF(value)
    case "cnpj":
      return maskCNPJ(value)
    case "phone":
      return maskPhone(value)
    case "document":
      return maskDocument(value)
    default:
      return value ?? ""
  }
}
