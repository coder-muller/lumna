"use server"

import { eq } from "drizzle-orm"

import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

import type { AbacatepayCredentialsPublic } from "./credentials-schema"

export async function getCredentials(): Promise<
  { data: AbacatepayCredentialsPublic | null } | { error: string }
> {
  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  const [credentials] = await db
    .select({
      keyPrefix: abacatepayCredentials.keyPrefix,
      keyHint: abacatepayCredentials.keyHint,
    })
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, session.user.id))
    .limit(1)

  return { data: credentials ?? null }
}
