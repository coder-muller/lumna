export const LUMNA_PLATFORM_FEE_RATE = 0.0099
export const STRIPE_BR_CARD_FEE_RATE = 0.0399
export const STRIPE_BR_CARD_FIXED_FEE_AMOUNT = 50

export function calculateLumnaPlatformFeeAmount(amountInCents: number) {
  return Math.round(amountInCents * LUMNA_PLATFORM_FEE_RATE)
}

export function calculateStripeProcessingFeeAmount(amountInCents: number) {
  if (amountInCents <= 0) {
    return 0
  }

  return (
    Math.round(amountInCents * STRIPE_BR_CARD_FEE_RATE) +
    STRIPE_BR_CARD_FIXED_FEE_AMOUNT
  )
}

export function calculateCheckoutApplicationFeeAmount(amountInCents: number) {
  const applicationFeeAmount =
    calculateLumnaPlatformFeeAmount(amountInCents) +
    calculateStripeProcessingFeeAmount(amountInCents)

  return Math.min(amountInCents, applicationFeeAmount)
}
