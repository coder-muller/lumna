import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { Customers } from "@/lib/generated/prisma/client"
import { updateCustomerSchema, UpdateCustomerInput } from "./customer-schema"

export async function updateCustomer(
  input: UpdateCustomerInput
): Promise<{ data: Customers } | { error: string }> {
  const result = updateCustomerSchema.safeParse(input)

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
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
    },
  })

  return {
    data: customer,
  }
}
