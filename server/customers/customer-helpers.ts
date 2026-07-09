import { and, eq, ne } from "drizzle-orm"

import { toAbacateCellphone } from "@/lib/abacatepay/customers"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"

export async function findLocalConflict(params: {
  userId: string
  email: string
  taxId: string | null
  excludeId?: string
}): Promise<string | null> {
  const emailFilters = [
    eq(customers.userId, params.userId),
    eq(customers.email, params.email),
  ]
  if (params.excludeId) {
    emailFilters.push(ne(customers.id, params.excludeId))
  }

  const [emailConflict] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(and(...emailFilters))
    .limit(1)

  if (emailConflict) {
    return "Já existe um cliente com este email"
  }

  if (!params.taxId) {
    return null
  }

  const taxIdFilters = [
    eq(customers.userId, params.userId),
    eq(customers.taxId, params.taxId),
  ]
  if (params.excludeId) {
    taxIdFilters.push(ne(customers.id, params.excludeId))
  }

  const [taxIdConflict] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(and(...taxIdFilters))
    .limit(1)

  if (taxIdConflict) {
    return "Já existe um cliente com este CPF/CNPJ"
  }

  return null
}

export async function findLinkedAbacateCustomer(params: {
  userId: string
  abacatepayCustomerId: string
  excludeId?: string
}): Promise<boolean> {
  const filters = [
    eq(customers.userId, params.userId),
    eq(customers.abacatepayCustomerId, params.abacatepayCustomerId),
  ]
  if (params.excludeId) {
    filters.push(ne(customers.id, params.excludeId))
  }

  const [existing] = await db
    .select({ id: customers.id })
    .from(customers)
    .where(and(...filters))
    .limit(1)

  return Boolean(existing)
}

export function buildAbacatePayload(data: {
  email: string
  name: string
  phone: string | null
  taxId: string | null
}) {
  return {
    email: data.email,
    name: data.name,
    ...(data.phone ? { cellphone: toAbacateCellphone(data.phone) } : {}),
    ...(data.taxId ? { taxId: data.taxId } : {}),
  }
}
