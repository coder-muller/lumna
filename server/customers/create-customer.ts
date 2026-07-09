"use server"

import { createAbacateCustomer } from "@/lib/abacatepay/customers"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers, type Customer } from "@/lib/db/schema"

import {
  buildAbacatePayload,
  findLinkedAbacateCustomer,
  findLocalConflict,
} from "./customer-helpers"
import { customerFormSchema, type CustomerFormInput } from "./customer-schema"

export async function createCustomer(
  input: CustomerFormInput
): Promise<{ data: Customer } | { error: string }> {
  const parsed = customerFormSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const data = parsed.data
  const conflict = await findLocalConflict({
    userId: session.user.id,
    email: data.email,
    taxId: data.taxId,
  })

  if (conflict) {
    return { error: conflict }
  }

  const remote = await createAbacateCustomer(buildAbacatePayload(data))

  if ("error" in remote) {
    return { error: remote.error }
  }

  const alreadyLinked = await findLinkedAbacateCustomer({
    userId: session.user.id,
    abacatepayCustomerId: remote.data.id,
  })

  if (alreadyLinked) {
    return { error: "Já existe um cliente com este CPF/CNPJ" }
  }

  const now = new Date()

  try {
    const [created] = await db
      .insert(customers)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        abacatepayCustomerId: remote.data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId,
        syncStatus: "synced",
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    if (!created) {
      return { error: "Não foi possível salvar o cliente" }
    }

    return { data: created }
  } catch {
    return { error: "Não foi possível salvar o cliente" }
  }
}
