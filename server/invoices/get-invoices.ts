"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { Invoices, Prisma } from "@/lib/generated/prisma/client"
import { getInvoicesSchema, GetInvoicesInput } from "./invoice-schema"

export type InvoiceWithCustomer = Invoices & {
  customer: {
    name: string
    email: string
  }
}

export async function getInvoices(
  input: GetInvoicesInput
): Promise<{ data: InvoiceWithCustomer[]; total: number } | { error: string }> {
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

  const where: Prisma.InvoicesWhereInput = {
    userId: session.user.id,
  }

  if (data.status) {
    where.status = data.status
  }

  if (data.search) {
    const search = data.search

    where.OR = [
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
    ]
  }

  const take = data.limit
  const skip = (data.page - 1) * take

  const [invoices, total] = await Promise.all([
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
  ])

  return {
    data: invoices,
    total,
  }
}
