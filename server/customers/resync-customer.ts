"use server"

import { and, eq } from "drizzle-orm"

import {
  createAbacateCustomer,
  deleteAbacateCustomer,
} from "@/lib/abacatepay/customers"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers, type Customer } from "@/lib/db/schema"

import {
  buildAbacatePayload,
  findLinkedAbacateCustomer,
} from "./customer-helpers"
import { customerIdSchema } from "./customer-schema"

export async function resyncCustomer(input: {
  id: string
}): Promise<{ data: Customer } | { error: string }> {
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

  if (existing.abacatepayCustomerId) {
    const deleteResult = await deleteAbacateCustomer(
      existing.abacatepayCustomerId
    )

    if ("error" in deleteResult) {
      return {
        error:
          deleteResult.error ||
          "Não foi possível remover o cliente antigo na AbacatePay",
      }
    }
  }

  const remote = await createAbacateCustomer(
    buildAbacatePayload({
      email: existing.email,
      name: existing.name,
      phone: existing.phone,
      taxId: existing.taxId,
    })
  )

  if ("error" in remote) {
    await db
      .update(customers)
      .set({
        syncStatus: "desynced",
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))

    return {
      error: remote.error || "Não foi possível recriar o cliente na AbacatePay",
    }
  }

  const alreadyLinked = await findLinkedAbacateCustomer({
    userId: session.user.id,
    abacatepayCustomerId: remote.data.id,
    excludeId: id,
  })

  if (alreadyLinked) {
    await db
      .update(customers)
      .set({
        syncStatus: "desynced",
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))

    return { error: "Já existe um cliente com este CPF/CNPJ" }
  }

  const [updated] = await db
    .update(customers)
    .set({
      abacatepayCustomerId: remote.data.id,
      syncStatus: "synced",
      updatedAt: new Date(),
    })
    .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))
    .returning()

  if (!updated) {
    return { error: "Não foi possível ressincronizar o cliente" }
  }

  return { data: updated }
}
