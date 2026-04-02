export const chargeStatuses = [
  "DRAFT",
  "OPEN",
  "PENDING",
  "PAID",
  "CANCELLED",
  "EXPIRED",
  "FAILED",
  "REFUNDED",
] as const

export const paymentStatuses = [
  "PENDING",
  "APPROVED",
  "AUTHORIZED",
  "IN_PROCESS",
  "IN_MEDIATION",
  "REJECTED",
  "CANCELLED",
  "REFUNDED",
  "CHARGEDBACK",
] as const

export type ChargeStatusValue = (typeof chargeStatuses)[number]
export type PaymentStatusValue = (typeof paymentStatuses)[number]

const chargeStatusLabels: Record<ChargeStatusValue, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  PENDING: "Pendente",
  PAID: "Paga",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
  FAILED: "Falhou",
  REFUNDED: "Reembolsada",
}

export function getChargeStatusLabel(status: string | null | undefined) {
  if (!status || !(status in chargeStatusLabels)) {
    return "Sem status"
  }

  return chargeStatusLabels[status as ChargeStatusValue]
}

export function getChargeStatusBadgeVariant(status: string | null | undefined) {
  switch (status) {
    case "PAID":
      return "default" as const
    case "OPEN":
    case "PENDING":
      return "secondary" as const
    case "FAILED":
    case "CANCELLED":
    case "EXPIRED":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

export function mapMercadoPagoPaymentStatusToPaymentStatus(
  status: string | null | undefined
): PaymentStatusValue {
  switch (status) {
    case "approved":
      return "APPROVED"
    case "authorized":
      return "AUTHORIZED"
    case "in_process":
      return "IN_PROCESS"
    case "in_mediation":
      return "IN_MEDIATION"
    case "rejected":
      return "REJECTED"
    case "cancelled":
      return "CANCELLED"
    case "refunded":
      return "REFUNDED"
    case "charged_back":
      return "CHARGEDBACK"
    default:
      return "PENDING"
  }
}

export function mapMercadoPagoPaymentStatusToChargeStatus(
  status: string | null | undefined
): ChargeStatusValue {
  switch (status) {
    case "approved":
      return "PAID"
    case "authorized":
      return "PENDING"
    case "in_process":
    case "in_mediation":
      return "PENDING"
    case "rejected":
      return "FAILED"
    case "cancelled":
      return "CANCELLED"
    case "refunded":
    case "charged_back":
      return "REFUNDED"
    default:
      return "OPEN"
  }
}
