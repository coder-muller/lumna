const onlyDigits = (v: string) => v.replace(/\D/g, "")
const limit = (v: string, max: number) => v.slice(0, max)

/**
 * Applies Brazilian phone mask progressively during input
 * @example maskPhone("11987654321") // "(11) 98765-4321"
 */
export function maskPhone(value?: string): string {
  if (!value) return ""
  const v = limit(onlyDigits(value), 11)

  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, "($1) $2")
  return v
}

/**
 * Removes all masks from a string, keeping only digits
 * @example removeMask("(12) 34567-8909") // "12345678909"
 */
export function removeMask(value: string): string {
  if (!value) return ""
  return value.replace(/\D/g, "")
}

export type UserDataMaskType = "phone"

/**
 * Generic mask function for user phone
 * @example applyMask("phone", "12345678909") // "(12) 34567-8909"
 */
export function applyMask(mask: UserDataMaskType, value?: string): string {
  switch (mask) {
    case "phone":
      return maskPhone(value)
    default:
      return value ?? ""
  }
}
