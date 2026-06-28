export const LUMNA_PLATFORM_FEE_RATE = 0.0099

export function calculateLumnaPlatformFeeAmount(amountInCents: number) {
  return Math.round(amountInCents * LUMNA_PLATFORM_FEE_RATE)
}
