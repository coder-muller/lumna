"use server"

import { getServerSession } from "@/lib/server/get-server-session"
import { prisma } from "@/lib/prisma"
import { InvoiceStatus, Invoices } from "@/lib/generated/prisma/client"
import { invoiceIdSchema } from "./invoice-schema"

type CancelInvoiceInput = {
  id: string
}

export async function cancelInvoice(
  input: CancelInvoiceInput
): Promise<{ data: Invoices } | { error: string }> {
  const result = invoiceIdSchema.safeParse(input)

  if (!result.success) {
    return {
      error: result.error.issues[0]?.message ?? "Cobrança inválida",
    }
  }

  const session = await getServerSession()

  if ("error" in session) {
    return {
      error: session.error,
    }
  }

  const invoiceExists = await prisma.invoices.findFirst({
    where: {
      id: result.data.id,
      userId: session.user.id,
    },
  })

  if (!invoiceExists) {
    return {
      error: "Cobrança não encontrada",
    }
  }

  if (invoiceExists.status !== InvoiceStatus.OPEN) {
    return {
      error: "Só cobranças abertas podem ser canceladas",
    }
  }

  const invoice = await prisma.invoices.update({
    where: {
      id: result.data.id,
    },
    data: {
      status: InvoiceStatus.CANCELED,
    },
  })

  return {
    data: invoice,
  }
}
