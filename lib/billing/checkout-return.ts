import { prisma } from "@/lib/prisma"
import {
  isCheckoutReturnValue,
  mapCheckoutReturnValueToStatus,
  type CheckoutReturnValue,
} from "@/lib/billing/checkout"
import {
  syncChargePaymentById,
  syncChargePaymentsById,
} from "@/lib/billing/sync"
import {
  logMercadoPagoError,
  logMercadoPagoInfo,
} from "@/lib/mercado-pago/log"

type SearchParamValue = string | string[] | undefined

export type CheckoutReturnSearchParams = Record<string, SearchParamValue>

function getSingleValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function toPayload(searchParams: CheckoutReturnSearchParams) {
  return Object.fromEntries(
    Object.entries(searchParams)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, Array.isArray(value) ? value : String(value)])
  )
}

function getPaymentId(searchParams: CheckoutReturnSearchParams) {
  return (
    getSingleValue(searchParams.payment_id) ??
    getSingleValue(searchParams.collection_id) ??
    null
  )
}

export async function recordChargeCheckoutReturn(input: {
  chargeId: string
  searchParams: CheckoutReturnSearchParams
}) {
  const rawCheckout = getSingleValue(input.searchParams.checkout)
  const checkout = isCheckoutReturnValue(rawCheckout) ? rawCheckout : null
  const payload = toPayload(input.searchParams)

  const charge = await prisma.charge.findUnique({
    where: {
      id: input.chargeId,
    },
    include: {
      client: true,
      payments: {
        orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
        take: 1,
      },
    },
  })

  if (!charge) {
    return {
      charge: null,
      checkout,
      syncError: null,
    }
  }

  await prisma.charge.update({
    where: {
      id: charge.id,
    },
    data: {
      lastCheckoutReturnStatus: checkout
        ? mapCheckoutReturnValueToStatus(checkout)
        : undefined,
      lastCheckoutReturnPayload: payload,
      lastCheckoutReturnAt: new Date(),
    },
  })

  const paymentId = getPaymentId(input.searchParams)
  let syncError: string | null = null

  try {
    if (paymentId) {
      await syncChargePaymentById({
        chargeId: charge.id,
        paymentId,
      })
    } else {
      await syncChargePaymentsById(charge.id)
    }
  } catch (error) {
    syncError =
      error instanceof Error
        ? error.message
        : "Falha ao sincronizar a cobrança com o Mercado Pago."

    logMercadoPagoError("checkout.return.sync_failed", {
      chargeId: charge.id,
      preferenceId: charge.mercadoPagoPreferenceId,
      paymentId,
      checkout,
      message: syncError,
    })
  }

  logMercadoPagoInfo("checkout.return.recorded", {
    chargeId: charge.id,
    preferenceId: charge.mercadoPagoPreferenceId,
    paymentId,
    checkout,
    syncError,
  })

  return {
    charge: await prisma.charge.findUnique({
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
    }),
    checkout,
    syncError,
  }
}

export function getCheckoutReturnContent(
  checkout: CheckoutReturnValue | null,
  syncError: string | null
) {
  if (checkout === "success") {
    return {
      title: "Pagamento enviado",
      description:
        "Recebemos o retorno do Checkout Pro. O estabelecimento vai confirmar o pagamento automaticamente em instantes.",
      tone: "success" as const,
      showSyncWarning: Boolean(syncError),
    }
  }

  if (checkout === "pending") {
    return {
      title: "Pagamento em análise",
      description:
        "O Mercado Pago ainda está processando este pagamento. O estabelecimento será atualizado automaticamente quando a análise terminar.",
      tone: "warning" as const,
      showSyncWarning: Boolean(syncError),
    }
  }

  return {
    title: "Pagamento não concluído",
    description:
      "Você pode fechar esta aba e tentar novamente pelo mesmo link se ainda quiser concluir o pagamento.",
    tone: "danger" as const,
    showSyncWarning: Boolean(syncError),
  }
}
