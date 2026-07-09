"use server"

import { and, eq } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { invoices, type Invoice } from "@/lib/db/schema"

import { invoiceIdSchema } from "./invoice-schema"

export async function cancelInvoice(input: {
  id: string
}): Promise<{ data: Invoice } | { error: string }> {
  const parsed = invoiceIdSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Cobrança inválida" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const [existing] = await db
    .select()
    .from(invoices)
    .where(
      and(eq(invoices.id, parsed.data.id), eq(invoices.userId, session.user.id))
    )
    .limit(1)

  if (!existing) {
    return { error: "Cobrança não encontrada" }
  }

  if (existing.status !== "OPEN") {
    return { error: "Só é possível cancelar cobranças abertas" }
  }

  const [updated] = await db
    .update(invoices)
    .set({
      status: "CANCELED",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(invoices.id, existing.id),
        eq(invoices.userId, session.user.id),
        eq(invoices.status, "OPEN")
      )
    )
    .returning()

  if (!updated) {
    return { error: "Não foi possível cancelar a cobrança" }
  }

  return { data: updated }
}
