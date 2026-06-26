"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { customerIdSchema } from "./customer-schema"

type DeleteCustomerInput = {
  id: string
}

export async function deleteCustomer(
  input: DeleteCustomerInput
): Promise<{ data: { success: true } } | { error: string }> {
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

  await prisma.customers.delete({
    where: {
      id: result.data.id,
    },
  })

  return {
    data: {
      success: true,
    },
  }
}
