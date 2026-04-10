"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId } from "@/lib/auth/functions"
import { prisma } from "@/lib/prisma"
import { getConnectionAccessToken } from "@/lib/mercado-pago/client"
import { createCheckoutPreference } from "@/lib/mercado-pago/preferences"
import { syncChargePayments } from "@/lib/billing/sync"
import { logMercadoPagoError, logMercadoPagoInfo } from "@/lib/mercado-pago/log"

function parseAmount(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? "")
    .replace(/[^\d.,]/g, "")
    .trim()

  if (!rawValue) {
    throw new Error("Informe um valor válido para a cobrança")
  }

  const separators = rawValue.match(/[.,]/g) ?? []
  const lastSeparatorIndex = Math.max(
    rawValue.lastIndexOf(","),
    rawValue.lastIndexOf(".")
  )

  const normalized =
    lastSeparatorIndex === -1
      ? rawValue.replace(/[.,]/g, "")
      : (() => {
          const integerPart = rawValue
            .slice(0, lastSeparatorIndex)
            .replace(/[.,]/g, "")
          const fractionPart = rawValue
            .slice(lastSeparatorIndex + 1)
            .replace(/[.,]/g, "")

          if (separators.length === 1 && fractionPart.length > 2) {
            return `${integerPart}${fractionPart}`
          }

          return fractionPart ? `${integerPart}.${fractionPart}` : integerPart
        })()

  const parsed = Number(normalized)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Informe um valor válido para a cobrança")
  }

  return parsed
}

function parseOptionalDate(value: FormDataEntryValue | null) {
  if (!value) {
    return null
  }

  const [year, month, day] = String(value)
    .split("-")
    .map((part) => Number(part))

  if (!year || !month || !day) {
    return null
  }

  // Keep the due date valid through the selected calendar day in Brazil.
  const parsed = new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59, 999))

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
}

function getCheckoutEnvironment() {
  return "SANDBOX" as const
}

async function createPreferenceForCharge(input: {
  connection: {
    id: string
    liveMode: boolean
    encryptedAccessToken: string | null
    encryptedRefreshToken: string | null
    accessTokenExpiresAt: Date | null
  }
  charge: {
    id: string
    externalReference: string
    title: string
    description: string | null
    amount: { toString(): string }
    expiresAt: Date | null
  }
  payerEmail: string | null
}) {
  const checkoutEnvironment = getCheckoutEnvironment()
  const preference = await createCheckoutPreference({
    accessToken: await getConnectionAccessToken(input.connection),
    chargeId: input.charge.id,
    externalReference: input.charge.externalReference,
    title: input.charge.title,
    description: input.charge.description,
    amount: Number(input.charge.amount.toString()),
    expiresAt: input.charge.expiresAt,
    payerEmail: input.payerEmail,
    checkoutEnvironment,
  })

  return {
    preference,
    checkoutEnvironment,
  }
}

export async function createClientAction(formData: FormData) {
  const userId = await requireUserId()
  const name = String(formData.get("name") ?? "").trim()
  const email = normalizeEmail(formData.get("email"))
  const phone = String(formData.get("phone") ?? "").trim() || null
  const notes = String(formData.get("notes") ?? "").trim() || null

  if (!name || !email) {
    throw new Error("Nome e email do cliente são obrigatórios")
  }

  const existingClient = await prisma.billingClient.findFirst({
    where: {
      userId,
      email,
    },
  })

  if (existingClient) {
    throw new Error("Já existe um cliente com esse email")
  }

  await prisma.billingClient.create({
    data: {
      userId,
      name,
      email,
      phone,
      notes,
    },
  })

  revalidatePath("/clientes")
  revalidatePath("/cobrancas/nova")
}

export async function createChargeAction(formData: FormData) {
  const userId = await requireUserId()
  const connection = await prisma.mercadoPagoConnection.findUnique({
    where: {
      userId,
    },
  })

  if (!connection?.encryptedAccessToken) {
    throw new Error(
      "Conecte uma conta do Mercado Pago antes de criar cobranças"
    )
  }

  let clientId = String(formData.get("clientId") ?? "").trim()

  if (!clientId) {
    const quickClientName = String(formData.get("quickClientName") ?? "").trim()
    const quickClientEmail = normalizeEmail(formData.get("quickClientEmail"))

    if (!quickClientName || !quickClientEmail) {
      throw new Error("Selecione um cliente ou preencha o cliente rápido")
    }

    const existingClient = await prisma.billingClient.findFirst({
      where: {
        userId,
        email: quickClientEmail,
      },
    })

    if (existingClient) {
      clientId = existingClient.id
    } else {
      const client = await prisma.billingClient.create({
        data: {
          userId,
          name: quickClientName,
          email: quickClientEmail,
        },
      })

      clientId = client.id
    }
  }

  const client = await prisma.billingClient.findFirst({
    where: {
      id: clientId,
      userId,
    },
  })

  if (!client) {
    throw new Error("Cliente inválido")
  }

  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim() || null
  const amount = parseAmount(formData.get("amount"))
  const expiresAt = parseOptionalDate(formData.get("expiresAt"))
  const chargeId = randomUUID()

  if (!title) {
    throw new Error("Título da cobrança é obrigatório")
  }

  const createdCharge = await prisma.charge.create({
    data: {
      id: chargeId,
      userId,
      clientId: client.id,
      mercadoPagoConnectionId: connection.id,
      title,
      description,
      amount: amount.toFixed(2),
      status: "DRAFT",
      externalReference: chargeId,
      checkoutEnvironment: getCheckoutEnvironment(),
      expiresAt,
    },
  })

  try {
    const { preference, checkoutEnvironment } = await createPreferenceForCharge({
      connection,
      charge: createdCharge,
      payerEmail: client.email,
    })

    await prisma.charge.update({
      where: {
        id: createdCharge.id,
      },
      data: {
        status: "OPEN",
        mercadoPagoPreferenceId: preference.id,
        checkoutUrl: preference.init_point,
        sandboxCheckoutUrl: preference.sandbox_init_point,
        checkoutEnvironment,
      },
    })
  } catch (error) {
    logMercadoPagoError("charge.create.failed", {
      chargeId: createdCharge.id,
      preferenceId: createdCharge.mercadoPagoPreferenceId,
      mercadoPagoUserId: connection.mercadoPagoUserId,
      message: error instanceof Error ? error.message : "unknown-error",
    })

    await prisma.charge.update({
      where: {
        id: createdCharge.id,
      },
      data: {
        status: "FAILED",
      },
    })

    throw error
  }

  revalidatePath("/dashboard")
  revalidatePath("/cobrancas")
  revalidatePath("/clientes")
  redirect("/cobrancas")
}

export async function syncChargeAction(formData: FormData) {
  const userId = await requireUserId()
  const chargeId = String(formData.get("chargeId") ?? "").trim()

  if (!chargeId) {
    throw new Error("Cobrança inválida")
  }

  await syncChargePayments(chargeId, userId)
  revalidatePath("/dashboard")
  revalidatePath("/cobrancas")
}

export async function refreshOpenChargePreferencesAction() {
  const userId = await requireUserId()
  const connection = await prisma.mercadoPagoConnection.findUnique({
    where: {
      userId,
    },
  })

  if (!connection?.encryptedAccessToken) {
    throw new Error("Conecte uma conta do Mercado Pago antes de atualizar links")
  }

  const charges = await prisma.charge.findMany({
    where: {
      userId,
      mercadoPagoConnectionId: connection.id,
      status: {
        in: ["OPEN", "PENDING"],
      },
      payments: {
        none: {
          status: "APPROVED",
        },
      },
    },
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  let refreshedCount = 0

  for (const charge of charges) {
    const { preference, checkoutEnvironment } = await createPreferenceForCharge({
      connection,
      charge,
      payerEmail: charge.client.email,
    })

    await prisma.charge.update({
      where: {
        id: charge.id,
      },
      data: {
        mercadoPagoPreferenceId: preference.id,
        checkoutUrl: preference.init_point,
        sandboxCheckoutUrl: preference.sandbox_init_point,
        checkoutEnvironment,
      },
    })

    refreshedCount += 1
  }

  logMercadoPagoInfo("charge.preferences.backfill.completed", {
    userId,
    mercadoPagoUserId: connection.mercadoPagoUserId,
    refreshedCount,
  })

  revalidatePath("/dashboard")
  revalidatePath("/cobrancas")
  revalidatePath("/configuracoes")
  redirect(
    `/configuracoes?tab=mercado-pago&success=${
      refreshedCount > 0 ? "preferences-refreshed" : "preferences-noop"
    }`
  )
}

export async function disconnectMercadoPagoAction() {
  const userId = await requireUserId()
  const connection = await prisma.mercadoPagoConnection.findUnique({
    where: {
      userId,
    },
  })

  if (!connection) {
    return
  }

  await prisma.mercadoPagoConnection.update({
    where: {
      id: connection.id,
    },
    data: {
      status: "DISCONNECTED",
      mercadoPagoUserId: null,
      publicKey: null,
      liveMode: false,
      encryptedAccessToken: null,
      encryptedRefreshToken: null,
      accessTokenExpiresAt: null,
      connectedAt: null,
      lastErrorAt: null,
      lastErrorMessage: null,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/cobrancas")
  revalidatePath("/configuracoes")
}
