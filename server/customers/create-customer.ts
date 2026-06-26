"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { Customers } from "@/lib/generated/prisma/client"
import { customerFormSchema, CustomerFormInput } from "./customer-schema"

export async function createCustomer(
  input: CustomerFormInput
): Promise<{ data: Customers } | { error: string }> {
  const result = customerFormSchema.safeParse(input)

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

  const customer = await prisma.customers.create({
    data: {
      userId: session.user.id,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
    },
  })

  return {
    data: customer,
  }
}
