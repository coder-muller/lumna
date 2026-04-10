type ChargeCheckoutLinkInput = {
  checkoutEnvironment: "LIVE" | "SANDBOX"
  checkoutUrl?: string | null
  sandboxCheckoutUrl?: string | null
}

export const checkoutReturnValues = ["success", "pending", "failure"] as const

export type CheckoutReturnValue = (typeof checkoutReturnValues)[number]

export function isCheckoutReturnValue(
  value: string | null | undefined
): value is CheckoutReturnValue {
  return (
    value !== null &&
    value !== undefined &&
    checkoutReturnValues.includes(value as CheckoutReturnValue)
  )
}

export function mapCheckoutReturnValueToStatus(value: CheckoutReturnValue) {
  switch (value) {
    case "success":
      return "SUCCESS" as const
    case "pending":
      return "PENDING" as const
    case "failure":
      return "FAILURE" as const
  }
}

export function resolveChargeCheckoutUrl(input: ChargeCheckoutLinkInput) {
  if (input.checkoutEnvironment === "LIVE") {
    return input.checkoutUrl ?? input.sandboxCheckoutUrl ?? null
  }

  return input.sandboxCheckoutUrl ?? input.checkoutUrl ?? null
}
