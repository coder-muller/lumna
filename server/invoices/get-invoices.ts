"use server"

import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { customers, invoices, type Invoice } from "@/lib/db/schema"

import { getInvoicesSchema, type GetInvoicesInput } from "./invoice-schema"

export type InvoiceWithCustomer = Invoice & {
  customerName: string
  customerEmail: string
}

export async function getInvoices(
  input: GetInvoicesInput = {}
): Promise<
  | { data: InvoiceWithCustomer[]; total: number; page: number; limit: number }
  | { error: string }
> {
  const parsed = getInvoicesSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const { page, limit, search, status } = parsed.data
  const offset = (page - 1) * limit

  const conditions: SQL[] = [eq(invoices.userId, session.user.id)]

  if (status) {
    conditions.push(eq(invoices.status, status))
  }

  if (search) {
    const pattern = `%${search}%`
    const searchCondition = or(
      ilike(invoices.title, pattern),
      ilike(customers.name, pattern),
      ilike(customers.email, pattern)
    )

    if (searchCondition) {
      conditions.push(searchCondition)
    }
  }

  const where = and(...conditions)

  const [totalRow] = await db
    .select({ total: count() })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(where)

  const rows = await db
    .select({
      id: invoices.id,
      userId: invoices.userId,
      customerId: invoices.customerId,
      title: invoices.title,
      description: invoices.description,
      value: invoices.value,
      status: invoices.status,
      paidAt: invoices.paidAt,
      refundedAt: invoices.refundedAt,
      abacatepayProductId: invoices.abacatepayProductId,
      abacatepayCheckoutId: invoices.abacatepayCheckoutId,
      checkoutUrl: invoices.checkoutUrl,
      refundFailedAt: invoices.refundFailedAt,
      refundError: invoices.refundError,
      createdAt: invoices.createdAt,
      updatedAt: invoices.updatedAt,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(where)
    .orderBy(desc(invoices.createdAt))
    .limit(limit)
    .offset(offset)

  return {
    data: rows,
    total: totalRow?.total ?? 0,
    page,
    limit,
  }
}
