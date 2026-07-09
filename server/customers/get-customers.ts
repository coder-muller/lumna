"use server"

import { and, asc, count, eq, ilike, or } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers, type Customer } from "@/lib/db/schema"
import { normalizeDocument } from "@/lib/validators/user-data"

import { getCustomersSchema, type GetCustomersInput } from "./customer-schema"

export async function getCustomers(
  input: GetCustomersInput
): Promise<{ data: Customer[]; total: number } | { error: string }> {
  const parsed = getCustomersSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const { page, limit, search } = parsed.data
  const userId = session.user.id

  const filters = [eq(customers.userId, userId)]

  if (search) {
    const phoneSearch = search.replace(/\D/g, "")
    const taxIdSearch = normalizeDocument(search)
    const searchFilters = [
      ilike(customers.name, `%${search}%`),
      ilike(customers.email, `%${search}%`),
    ]

    if (phoneSearch) {
      searchFilters.push(ilike(customers.phone, `%${phoneSearch}%`))
    }

    if (taxIdSearch) {
      searchFilters.push(ilike(customers.taxId, `%${taxIdSearch}%`))
    }

    filters.push(or(...searchFilters)!)
  }

  const where = and(...filters)
  const offset = (page - 1) * limit

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(where)
      .orderBy(asc(customers.name), asc(customers.email))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(customers).where(where),
  ])

  return {
    data: rows,
    total: totalRows[0]?.value ?? 0,
  }
}
