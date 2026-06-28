"use server"

import { TZDate } from "@date-fns/tz"
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

import { InvoiceStatus } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/server/get-server-session"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"

import { getDashboardSchema } from "./dashboard-schema"

const TIMEZONE = "America/Sao_Paulo"

export type DashboardStats = {
  receivedThisMonth: number
  openAmount: number
  paidTotal: number
  totalCount: number
}

export type RevenueMonth = {
  key: string
  label: string
  grossAmount: number
  netAmount: number
}

export type DashboardData = {
  stats: DashboardStats
  revenueChart: RevenueMonth[]
  recentInvoices: InvoiceWithCustomer[]
}

function getBrazilNow() {
  return new TZDate(new Date(), TIMEZONE)
}

function buildRevenueMonths(): RevenueMonth[] {
  const now = getBrazilNow()
  const months: RevenueMonth[] = []

  for (let index = 5; index >= 0; index -= 1) {
    const date = subMonths(now, index)
    const key = format(date, "yyyy-MM")
    const label = format(date, "MMM", { locale: ptBR })

    months.push({
      key,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      grossAmount: 0,
      netAmount: 0,
    })
  }

  return months
}

export async function getDashboard(): Promise<
  DashboardData | { error: string }
> {
  const result = getDashboardSchema.safeParse({})

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Dados inválidos",
    }
  }

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const userId = session.user.id
  const now = getBrazilNow()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const chartStart = startOfMonth(subMonths(now, 5))

  const [
    openAggregate,
    totalCount,
    paidInvoicesForStats,
    paidInvoicesForChart,
    recentInvoices,
  ] = await Promise.all([
    prisma.invoices.aggregate({
      where: {
        userId,
        status: InvoiceStatus.OPEN,
      },
      _sum: {
        value: true,
      },
    }),

    prisma.invoices.count({
      where: {
        userId,
      },
    }),

    prisma.invoices.findMany({
      where: {
        userId,
        status: InvoiceStatus.PAID,
      },
      select: {
        paidAt: true,
        value: true,
        netReceivedAmount: true,
      },
    }),

    prisma.invoices.findMany({
      where: {
        userId,
        status: InvoiceStatus.PAID,
        paidAt: {
          gte: chartStart,
          lte: monthEnd,
          not: null,
        },
      },
      select: {
        paidAt: true,
        value: true,
        netReceivedAmount: true,
      },
    }),

    prisma.invoices.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ])

  const revenueChart = buildRevenueMonths()
  const amountByKey = new Map(revenueChart.map((month) => [month.key, month]))

  for (const invoice of paidInvoicesForChart) {
    if (!invoice.paidAt) {
      continue
    }

    const paidDate = new TZDate(invoice.paidAt, TIMEZONE)
    const key = format(paidDate, "yyyy-MM")
    const month = amountByKey.get(key)

    if (month) {
      month.grossAmount += invoice.value
      month.netAmount += invoice.netReceivedAmount ?? invoice.value
    }
  }

  const nowTime = Date.now()
  const paidTotal = paidInvoicesForStats.reduce(
    (total, invoice) => total + (invoice.netReceivedAmount ?? invoice.value),
    0
  )
  const receivedThisMonth = paidInvoicesForStats.reduce((total, invoice) => {
    if (
      !invoice.paidAt ||
      invoice.paidAt < monthStart ||
      invoice.paidAt > monthEnd
    ) {
      return total
    }

    return total + (invoice.netReceivedAmount ?? invoice.value)
  }, 0)

  return {
    stats: {
      receivedThisMonth,
      openAmount: openAggregate._sum.value ?? 0,
      paidTotal,
      totalCount,
    },
    revenueChart,
    recentInvoices: recentInvoices.map((invoice) => ({
      ...invoice,
      isStripeCheckoutExpired:
        invoice.status === InvoiceStatus.OPEN &&
        Boolean(invoice.stripeCheckoutExpiresAt) &&
        invoice.stripeCheckoutExpiresAt!.getTime() < nowTime,
    })),
  }
}
