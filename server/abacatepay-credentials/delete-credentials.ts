"use server"

import { eq } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

export async function deleteCredentials(): Promise<
  { data: { deleted: true } } | { error: string }
> {
  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const deleted = await db
    .delete(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))
    .returning({ id: abacatepayCredentials.id })

  if (deleted.length === 0) {
    return { error: "Nenhuma chave de API encontrada" }
  }

  return { data: { deleted: true } }
}
