import { prisma } from "@/lib/prisma"
import {
  mapMercadoPagoPaymentStatusToChargeStatus,
  mapMercadoPagoPaymentStatusToPaymentStatus,
} from "@/lib/billing/status"
import { getConnectionAccessToken } from "@/lib/mercado-pago/client"
import {
  getMercadoPagoPaymentById,
  searchMercadoPagoPaymentsByExternalReference,
  type MercadoPagoPayment,
} from "@/lib/mercado-pago/payments"

function toDecimal(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null
  }

  return value.toFixed(2)
}

function getPaymentFinancials(payment: MercadoPagoPayment) {
  let gatewayFeeAmount = 0
  let marketplaceFeeAmount = payment.marketplace_fee ?? 0

  for (const detail of payment.fee_details ?? []) {
    const amount = detail.amount ?? 0

    if (detail.type === "application_fee") {
      marketplaceFeeAmount ||= amount
      continue
    }

    gatewayFeeAmount += amount
  }

  const paidAmount =
    payment.transaction_details?.total_paid_amount ??
    payment.transaction_amount ??
    null

  const netAmount =
    payment.transaction_details?.net_received_amount ??
    (paidAmount !== null
      ? paidAmount - gatewayFeeAmount - marketplaceFeeAmount
      : null)

  return {
    transactionAmount: toDecimal(payment.transaction_amount),
    paidAmount: toDecimal(paidAmount),
    marketplaceFeeAmount: toDecimal(marketplaceFeeAmount || undefined),
    gatewayFeeAmount: toDecimal(gatewayFeeAmount || undefined),
    netAmount: toDecimal(netAmount),
  }
}

function getApprovedAt(payment: MercadoPagoPayment) {
  return payment.date_approved ? new Date(payment.date_approved) : null
}

function getPaymentTimestamp(payment: MercadoPagoPayment) {
  const value =
    payment.date_approved ?? payment.date_last_updated ?? payment.date_created

  return value ? new Date(value).getTime() : 0
}

function pickChargeSnapshotPayment(payments: MercadoPagoPayment[]) {
  if (!payments.length) {
    return null
  }

  return [...payments].sort((left, right) => {
    const leftApproved = left.status === "approved"
    const rightApproved = right.status === "approved"

    if (leftApproved !== rightApproved) {
      return leftApproved ? -1 : 1
    }

    return getPaymentTimestamp(right) - getPaymentTimestamp(left)
  })[0]
}

async function updateChargeSnapshot(
  connection: {
    id: string
    userId: string
  },
  payment: MercadoPagoPayment
) {
  const chargeId = payment.external_reference

  if (!chargeId) {
    return null
  }

  const charge = await prisma.charge.findFirst({
    where: {
      id: chargeId,
      userId: connection.userId,
      mercadoPagoConnectionId: connection.id,
    },
  })

  if (!charge) {
    return null
  }

  const financials = getPaymentFinancials(payment)
  const paidAt = getApprovedAt(payment)

  await prisma.charge.update({
    where: {
      id: charge.id,
    },
    data: {
      status: mapMercadoPagoPaymentStatusToChargeStatus(payment.status),
      paidAt,
      ...financials,
    },
  })

  return charge.id
}

async function markConnectionSynced(connectionId: string) {
  await prisma.mercadoPagoConnection.update({
    where: {
      id: connectionId,
    },
    data: {
      status: "CONNECTED",
      lastSyncedAt: new Date(),
      lastErrorAt: null,
      lastErrorMessage: null,
    },
  })
}

export async function upsertMercadoPagoPayment(
  connection: {
    id: string
    userId: string
  },
  payment: MercadoPagoPayment
) {
  const chargeId = payment.external_reference

  if (!chargeId) {
    return null
  }

  const charge = await prisma.charge.findFirst({
    where: {
      id: chargeId,
      userId: connection.userId,
      mercadoPagoConnectionId: connection.id,
    },
  })

  if (!charge) {
    return null
  }

  const paymentId = String(payment.id)
  const paymentStatus = mapMercadoPagoPaymentStatusToPaymentStatus(
    payment.status
  )
  const paidAt = getApprovedAt(payment)
  const financials = getPaymentFinancials(payment)

  await prisma.payment.upsert({
    where: {
      mercadoPagoPaymentId: paymentId,
    },
    create: {
      chargeId: charge.id,
      mercadoPagoPaymentId: paymentId,
      status: paymentStatus,
      statusDetail: payment.status_detail,
      currency: payment.currency_id,
      payerEmail: payment.payer?.email,
      paymentMethodId: payment.payment_method_id,
      paymentTypeId: payment.payment_type_id,
      paidAt,
      rawData: payment,
      ...financials,
    },
    update: {
      status: paymentStatus,
      statusDetail: payment.status_detail,
      currency: payment.currency_id,
      payerEmail: payment.payer?.email,
      paymentMethodId: payment.payment_method_id,
      paymentTypeId: payment.payment_type_id,
      paidAt,
      rawData: payment,
      ...financials,
    },
  })

  return charge.id
}

export async function syncChargePayments(chargeId: string, userId: string) {
  const charge = await prisma.charge.findFirst({
    where: {
      id: chargeId,
      userId,
    },
    include: {
      mercadoPagoConnection: true,
    },
  })

  if (!charge) {
    throw new Error("Cobrança não encontrada")
  }

  const accessToken = await getConnectionAccessToken(
    charge.mercadoPagoConnection
  )
  const payments = await searchMercadoPagoPaymentsByExternalReference(
    accessToken,
    charge.externalReference
  )

  for (const payment of payments) {
    await upsertMercadoPagoPayment(charge.mercadoPagoConnection, payment)
  }

  const snapshotPayment = pickChargeSnapshotPayment(payments)

  if (snapshotPayment) {
    await updateChargeSnapshot(charge.mercadoPagoConnection, snapshotPayment)
  }

  await markConnectionSynced(charge.mercadoPagoConnection.id)

  return prisma.charge.findUnique({
    where: {
      id: charge.id,
    },
    include: {
      client: true,
      payments: {
        orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
        take: 1,
      },
    },
  })
}

export async function syncPaymentFromWebhook(input: {
  mercadoPagoUserId?: string | null
  paymentId: string
}) {
  if (!input.mercadoPagoUserId) {
    return null
  }

  const connection = await prisma.mercadoPagoConnection.findFirst({
    where: {
      mercadoPagoUserId: input.mercadoPagoUserId,
    },
  })

  if (!connection) {
    return null
  }

  const accessToken = await getConnectionAccessToken(connection)
  const payment = await getMercadoPagoPaymentById(accessToken, input.paymentId)

  const payments = payment.external_reference
    ? await searchMercadoPagoPaymentsByExternalReference(
        accessToken,
        payment.external_reference
      )
    : [payment]

  for (const item of payments) {
    await upsertMercadoPagoPayment(connection, item)
  }

  const snapshotPayment = pickChargeSnapshotPayment(payments)

  if (!snapshotPayment) {
    return null
  }

  await markConnectionSynced(connection.id)

  return updateChargeSnapshot(connection, snapshotPayment)
}
