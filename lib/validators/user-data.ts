const VALID_DDDS = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "24",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "53",
  "54",
  "55",
  "61",
  "62",
  "64",
  "63",
  "65",
  "66",
  "67",
  "68",
  "69",
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
]

const CNPJ_WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const
const CNPJ_WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const

function cnpjCharValue(char: string): number {
  return char.charCodeAt(0) - 48
}

function calcCnpjCheckDigit(base: string, weights: readonly number[]): number {
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += cnpjCharValue(base[i]) * weights[i]
  }
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function normalizeDocument(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

export function validateCPF(value: string): boolean {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i], 10) * (10 - i)
  }
  let firstCheck = 11 - (sum % 11)
  if (firstCheck >= 10) firstCheck = 0
  if (firstCheck !== parseInt(cleaned[9], 10)) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i], 10) * (11 - i)
  }
  let secondCheck = 11 - (sum % 11)
  if (secondCheck >= 10) secondCheck = 0

  return secondCheck === parseInt(cleaned[10], 10)
}

export function validateCNPJ(value: string): boolean {
  const cleaned = normalizeDocument(value)
  if (cleaned.length !== 14) return false
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cleaned)) return false
  if (/^(.)\1{13}$/.test(cleaned)) return false

  const base = cleaned.slice(0, 12)
  const digit1 = calcCnpjCheckDigit(base, CNPJ_WEIGHTS_1)
  const digit2 = calcCnpjCheckDigit(base + String(digit1), CNPJ_WEIGHTS_2)

  return (
    digit1 === parseInt(cleaned[12], 10) && digit2 === parseInt(cleaned[13], 10)
  )
}

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "")
}

export function toLocalPhoneDigits(value: string): string {
  const digits = normalizePhoneDigits(value)
  if (digits.startsWith("55") && digits.length >= 12) {
    return digits.slice(2)
  }
  return digits
}

export function toStoragePhone(value: string): string | null {
  const digits = normalizePhoneDigits(value)
  if (!digits) return null

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }

  if (
    digits.startsWith("55") &&
    (digits.length === 12 || digits.length === 13)
  ) {
    return digits
  }

  return null
}

export function validatePhone(value: string): boolean {
  const cleaned = toLocalPhoneDigits(value)
  if (cleaned.length !== 10 && cleaned.length !== 11) return false

  const ddd = cleaned.substring(0, 2)
  if (!VALID_DDDS.includes(ddd)) return false

  if (cleaned.length === 10) {
    const firstDigit = cleaned[2]
    if (!/[2-5]/.test(firstDigit)) return false
    return true
  }

  if (cleaned.length === 11) {
    if (cleaned[2] !== "9") return false
    return true
  }

  return false
}

export function validateDocument(value: string): boolean {
  const normalized = normalizeDocument(value)

  if (/[A-Z]/.test(normalized) || normalized.length === 14) {
    return validateCNPJ(value)
  }

  if (normalized.length === 11 && /^\d{11}$/.test(normalized)) {
    return validateCPF(value)
  }

  return false
}

export type UserDataValidationType = "cpf" | "cnpj" | "phone" | "document"

export function validate(type: UserDataValidationType, value: string): boolean {
  switch (type) {
    case "cpf":
      return validateCPF(value)
    case "cnpj":
      return validateCNPJ(value)
    case "phone":
      return validatePhone(value)
    case "document":
      return validateDocument(value)
    default:
      return false
  }
}
