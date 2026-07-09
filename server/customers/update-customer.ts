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
  findLocalConflict,
} from "./customer-helpers"
import {
  updateCustomerSchema,
  type UpdateCustomerInput,
} from "./customer-schema"

export async function updateCustomer(
  input: UpdateCustomerInput
): Promise<{ data: Customer } | { error: string }> {
  const parsed = updateCustomerSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const { id, ...data } = parsed.data

  const [existing] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))
    .limit(1)

  if (!existing) {
    return { error: "Cliente não encontrado" }
  }

  const conflict = await findLocalConflict({
    userId: session.user.id,
    email: data.email,
    taxId: data.taxId,
    excludeId: id,
  })

  if (conflict) {
    return { error: conflict }
  }

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

  const remote = await createAbacateCustomer(buildAbacatePayload(data))

  if ("error" in remote) {
    await db
      .update(customers)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
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
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
        syncStatus: "desynced",
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))

    return { error: "Já existe um cliente com este CPF/CNPJ" }
  }

  try {
    const [updated] = await db
      .update(customers)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
        abacatepayCustomerId: remote.data.id,
        syncStatus: "synced",
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))
      .returning()

    if (!updated) {
      return { error: "Não foi possível atualizar o cliente" }
    }

    return { data: updated }
  } catch {
    try {
      const [retry] = await db
        .update(customers)
        .set({
          name: data.name,
          email: data.email,
          phone: data.phone,
          taxId: data.taxId,
          abacatepayCustomerId: remote.data.id,
          syncStatus: "synced",
          updatedAt: new Date(),
        })
        .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))
        .returning()

      if (retry) {
        return { data: retry }
      }
    } catch {
      // fall through to desynced
    }

    await db
      .update(customers)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
        abacatepayCustomerId: remote.data.id,
        syncStatus: "desynced",
        updatedAt: new Date(),
      })
      .where(and(eq(customers.id, id), eq(customers.userId, session.user.id)))

    return {
      error:
        "Cliente recriado na AbacatePay, mas não foi possível sincronizar localmente. Tente ressincronizar.",
    }
  }
}
