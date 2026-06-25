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

/**
 * Validates a Brazilian phone number
 * @example validatePhone("11987654321") // true
 */
export function validatePhone(value: string): boolean {
  const cleaned = value.replace(/\D/g, "")
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

export type UserDataValidationType = "phone"

export function validate(type: UserDataValidationType, value: string): boolean {
  switch (type) {
    case "phone":
      return validatePhone(value)
    default:
      return false
  }
}
