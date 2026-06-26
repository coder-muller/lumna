"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { Customers, CustomerStatus } from "@/lib/generated/prisma/client"
import { customerIdSchema } from "./customer-schema"

type ArchiveCustomerInput = {
  id: string
}

export async function archiveCustomer(
  input: ArchiveCustomerInput
): Promise<{ data: Customers } | { error: string }> {
  const result = customerIdSchema.safeParse(input)

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Cliente inválido",
    }
  }

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const customerExists = await prisma.customers.findFirst({
    where: {
      id: result.data.id,
      userId: session.user.id,
    },
  })

  if (!customerExists) {
    return {
      error: "Cliente não encontrado",
    }
  }

  const customer = await prisma.customers.update({
    where: {
      id: result.data.id,
    },
    data: {
      status: CustomerStatus.ARCHIVED,
    },
  })

  return {
    data: customer,
  }
}
