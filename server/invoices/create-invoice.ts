"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { CustomerStatus, Invoices } from "@/lib/generated/prisma/client"
import { invoiceFormSchema, InvoiceFormInput } from "./invoice-schema"

export async function createInvoice(
  input: InvoiceFormInput
): Promise<{ data: Invoices } | { error: string }> {
  const result = invoiceFormSchema.safeParse(input)

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
      id: result.data.customerId,
      userId: session.user.id,
      status: CustomerStatus.ACTIVE,
    },
  })

  if (!customerExists) {
    return {
      error: "Cliente não encontrado",
    }
  }

  const invoice = await prisma.invoices.create({
    data: {
      userId: session.user.id,
      customerId: result.data.customerId,
      title: result.data.title,
      description: result.data.description,
      value: result.data.value,
    },
  })

  return {
    data: invoice,
  }
}
