import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/lib/generated/prisma/client"
import type { ChargeStatusValue } from "@/lib/billing/status"

type ChargeFilters = {
  query?: string
  status?: ChargeStatusValue | "ALL"
}

type ClientFilters = {
  query?: string
}

export async function getMercadoPagoConnection(userId: string) {
  return prisma.mercadoPagoConnection.findUnique({
    where: {
      userId,
    },
  })
}

export async function getProtectedLayoutData(userId: string) {
  const connection = await getMercadoPagoConnection(userId)

  return {
    connection,
  }
}

export async function getDashboardData(userId: string) {
  const connection = await getMercadoPagoConnection(userId)
  const charges = await prisma.charge.findMany({
    where: { userId },
  })
  const recentCharges = await prisma.charge.findMany({
    where: { userId },
    include: {
      client: true,
      payments: {
        orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })
  const totalClients = await prisma.billingClient.count({
    where: { userId },
  })

  return {
    connection,
    stats: {
      totalCharges: charges.length,
      totalBilled: charges.reduce(
        (sum, charge) => sum + Number(charge.amount),
        0
      ),
      totalReceived: charges.reduce(
        (sum, charge) => sum + Number(charge.paidAmount ?? 0),
        0
      ),
      totalClients,
      paidCharges: charges.filter((charge) => charge.status === "PAID").length,
    },
    recentCharges,
  }
}

export async function getChargesData(userId: string, filters: ChargeFilters) {
  const where: Prisma.ChargeWhereInput = {
    userId,
    ...(filters.status && filters.status !== "ALL"
      ? { status: filters.status }
      : {}),
    ...(filters.query
      ? {
          OR: [
            {
              title: { contains: filters.query, mode: "insensitive" as const },
            },
            {
              description: {
                contains: filters.query,
                mode: "insensitive" as const,
              },
            },
            {
              client: {
                name: { contains: filters.query, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  }

  const connection = await getMercadoPagoConnection(userId)
  const charges = await prisma.charge.findMany({
    where,
    include: {
      client: true,
      payments: {
        orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
        take: 1,
      },
    },
    orderBy: [{ createdAt: "desc" }],
  })

  return {
    connection,
    charges,
  }
}

export async function getClientsData(userId: string, filters: ClientFilters) {
  const connection = await getMercadoPagoConnection(userId)
  const clients = await prisma.billingClient.findMany({
    where: {
      userId,
      ...(filters.query
        ? {
            OR: [
              {
                name: {
                  contains: filters.query,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: filters.query,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    },
    include: {
      charges: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return {
    connection,
    clients,
  }
}

export async function getNewChargeData(userId: string) {
  const connection = await getMercadoPagoConnection(userId)
  const clients = await prisma.billingClient.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  })

  return {
    connection,
    clients,
  }
}

export async function getSettingsData(userId: string) {
  const [connection, user, refreshableChargesCount] = await Promise.all([
    getMercadoPagoConnection(userId),
    prisma.users.findUnique({
      where: {
        id: userId,
      },
    }),
    prisma.charge.count({
      where: {
        userId,
        status: {
          in: ["OPEN", "PENDING"],
        },
        payments: {
          none: {
            status: "APPROVED",
          },
        },
      },
    }),
  ])

  return {
    connection,
    refreshableChargesCount,
    user,
  }
}
