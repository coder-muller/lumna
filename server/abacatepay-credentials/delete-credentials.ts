"use server"

import { eq } from "drizzle-orm"

import { deleteAbacateWebhook } from "@/lib/abacatepay/webhooks"
import { getSession } from "@/lib/auth/session"
import { decrypt } from "@/lib/crypto/encryption"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

export async function deleteCredentials(): Promise<
  { data: { deleted: true } } | { error: string }
> {
  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const [existing] = await db
    .select()
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))
    .limit(1)

  if (!existing) {
    return { error: "Nenhuma chave de API encontrada" }
  }

  if (existing.webhookId) {
    try {
      const apiKey = decrypt(existing.encryptedKey)
      await deleteAbacateWebhook(existing.webhookId, apiKey)
    } catch {
      // Best-effort: still remove local credentials if remote delete fails.
    }
  }

  await db
    .delete(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))

  return { data: { deleted: true } }
}
