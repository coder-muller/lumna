"use server"

import { eq } from "drizzle-orm"

import { validateAbacatePayApiKey } from "@/lib/abacatepay/validate-api-key"
import { parseApiKeyParts } from "@/lib/abacatepay/key-format"
import { getSession } from "@/lib/auth/session"
import { encrypt } from "@/lib/crypto/encryption"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

import {
  saveCredentialsSchema,
  type AbacatepayCredentialsPublic,
  type SaveCredentialsInput,
} from "./credentials-schema"

export async function saveCredentials(
  input: SaveCredentialsInput
): Promise<{ data: AbacatepayCredentialsPublic } | { error: string }> {
  const parsed = saveCredentialsSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const { apiKey } = parsed.data
  const parts = parseApiKeyParts(apiKey)

  if (!parts) {
    return { error: "A chave deve começar com abc_dev_ ou abc_prod_" }
  }

  const validation = await validateAbacatePayApiKey(apiKey)

  if (!validation.ok) {
    return { error: validation.error }
  }

  let encryptedKey: string

  try {
    encryptedKey = encrypt(apiKey)
  } catch {
    return { error: "Não foi possível criptografar a chave de API" }
  }

  const now = new Date()
  const [existing] = await db
    .select({ id: abacatepayCredentials.id })
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))
    .limit(1)

  if (existing) {
    await db
      .update(abacatepayCredentials)
      .set({
        encryptedKey,
        keyPrefix: parts.keyPrefix,
        keyHint: parts.keyHint,
        updatedAt: now,
      })
      .where(eq(abacatepayCredentials.id, existing.id))
  } else {
    await db.insert(abacatepayCredentials).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      encryptedKey,
      keyPrefix: parts.keyPrefix,
      keyHint: parts.keyHint,
      createdAt: now,
      updatedAt: now,
    })
  }

  return {
    data: {
      keyPrefix: parts.keyPrefix,
      keyHint: parts.keyHint,
    },
  }
}
