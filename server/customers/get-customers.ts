"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import {
  Customers,
  CustomerStatus,
  Prisma,
} from "@/lib/generated/prisma/client"
import { getCustomersSchema, GetCustomersInput } from "./customer-schema"

export async function getCustomers(
  input: GetCustomersInput
): Promise<{ data: Customers[]; total: number } | { error: string }> {
  const result = getCustomersSchema.safeParse(input)

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

  const where: Prisma.CustomersWhereInput = {
    userId: session.user.id,
    status: data.archived ? CustomerStatus.ARCHIVED : CustomerStatus.ACTIVE,
  }

  if (data.search) {
    const search = data.search
    const phoneSearch = search.replace(/\D/g, "")

    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ]

    if (phoneSearch) {
      where.OR.push({
        phone: {
          contains: phoneSearch,
          mode: "insensitive",
        },
      })
    }
  }

  const orderBy: Prisma.CustomersOrderByWithRelationInput[] = [
    { name: "asc" },
    { email: "asc" },
    { createdAt: "desc" },
  ]

  const take = data.limit
  const skip = (data.page - 1) * take

  const [customers, total] = await Promise.all([
    prisma.customers.findMany({
      where,
      orderBy,
      take,
      skip,
    }),

    prisma.customers.count({
      where,
    }),
  ])

  return {
    data: customers,
    total,
  }
}
