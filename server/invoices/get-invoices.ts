"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { InvoiceStatus, Invoices, Prisma } from "@/lib/generated/prisma/client"
import { getInvoicesSchema, GetInvoicesInput } from "./invoice-schema"

export type InvoiceWithCustomer = Invoices & {
  customer: {
    name: string
    email: string
  }
  isStripeCheckoutExpired: boolean
}

export type InvoiceCounts = {
  all: number
  open: number
  paid: number
  canceled: number
}

export async function getInvoices(
  input: GetInvoicesInput
): Promise<
  | { data: InvoiceWithCustomer[]; total: number; counts: InvoiceCounts }
  | { error: string }
> {
  const result = getInvoicesSchema.safeParse(input)

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Dados inválidos",
    }
  }

  const data = result.data

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const baseWhere: Prisma.InvoicesWhereInput = {
    userId: session.user.id,
  }

  if (data.search) {
    const search = data.search

    baseWhere.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        customer: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ]
  }

  const where: Prisma.InvoicesWhereInput = {
    ...baseWhere,
  }

  if (data.status) {
    where.status = data.status
  }

  const take = data.limit
  const skip = (data.page - 1) * take

  const [invoices, total, all, open, paid, canceled] = await Promise.all([
    prisma.invoices.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      take,
      skip,
    }),

    prisma.invoices.count({
      where,
    }),

    prisma.invoices.count({
      where: baseWhere,
    }),

    prisma.invoices.count({
      where: {
        ...baseWhere,
        status: InvoiceStatus.OPEN,
      },
    }),

    prisma.invoices.count({
      where: {
        ...baseWhere,
        status: InvoiceStatus.PAID,
      },
    }),

    prisma.invoices.count({
      where: {
        ...baseWhere,
        status: InvoiceStatus.CANCELED,
      },
    }),
  ])

  const now = Date.now()

  return {
    data: invoices.map((invoice) => ({
      ...invoice,
      isStripeCheckoutExpired:
        invoice.status === InvoiceStatus.OPEN &&
        Boolean(invoice.stripeCheckoutExpiresAt) &&
        invoice.stripeCheckoutExpiresAt!.getTime() < now,
    })),
    total,
    counts: {
      all,
      open,
      paid,
      canceled,
    },
  }
}
