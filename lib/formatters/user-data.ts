export type UserDataFormatType = "phone"

/**
 * Formats a Brazilian phone number for display
 * @example formatPhone("11987654321") // "(11) 98765-4321"
 */
export function formatPhone(value: string | undefined | null): string {
  if (!value) return ""
  const digits = value.replace(/\D/g, "")

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }

  return value
}

/**
 * Generic formatter function for user data
 * @example format("phone", "12345678909") // "(12) 34567-8909"
 */
export function format(
  type: UserDataFormatType,
  value: string | undefined | null
): string {
  switch (type) {
    case "phone":
      return formatPhone(value)
    default:
      return value ?? ""
  }
}
