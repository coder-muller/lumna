"use server"

import { and, eq } from "drizzle-orm"

import { deleteAbacateCustomer } from "@/lib/abacatepay/customers"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

import { customerIdSchema } from "./customer-schema"

export async function deleteCustomer(input: {
  id: string
}): Promise<{ data: { success: true } } | { error: string }> {
  const parsed = customerIdSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Cliente inválido" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const { id } = parsed.data

  const [existing] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))
    .limit(1)

  if (!existing) {
    return { error: "Cliente não encontrado" }
  }

  const remote = await deleteAbacateCustomer(existing.abacatepayCustomerId)

  if ("error" in remote) {
    return {
      error: remote.error || "Não foi possível remover o cliente na AbacatePay",
    }
  }

  await db
    .delete(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))

  return { data: { success: true } }
}
