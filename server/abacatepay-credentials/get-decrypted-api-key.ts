import "server-only"

import { eq } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { decrypt } from "@/lib/crypto/encryption"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

/** Server-only helper for future AbacatePay API calls. Never expose as a client action. */
export async function getDecryptedApiKey(): Promise<
  { data: string } | { error: string }
> {
  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const [credentials] = await db
    .select({
      encryptedKey: abacatepayCredentials.encryptedKey,
    })
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))
    .limit(1)

  if (!credentials) {
    return { error: "Nenhuma chave de API cadastrada" }
  }

  try {
    return { data: decrypt(credentials.encryptedKey) }
  } catch {
    return { error: "Não foi possível descriptografar a chave de API" }
  }
}
