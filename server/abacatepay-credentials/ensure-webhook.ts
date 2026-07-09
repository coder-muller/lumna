import "server-only"

import { randomBytes } from "node:crypto"

import { eq } from "drizzle-orm"

import { mapAbacatePayError } from "@/lib/abacatepay/errors"
import {
  createAbacateWebhook,
  deleteAbacateWebhook,
} from "@/lib/abacatepay/webhooks"
import { canRegisterPublicWebhook, getAppUrl } from "@/lib/app-url"
import { decrypt, encrypt } from "@/lib/crypto/encryption"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

const WEBHOOK_EVENTS = ["checkout.completed", "checkout.refunded"] as const

function buildWebhookEndpoint(secret: string): string {
  return `${getAppUrl()}/api/webhooks/abacatepay?webhookSecret=${encodeURIComponent(secret)}`
}

export async function ensureAbacateWebhook(
  userId: string
): Promise<
  | { data: { webhookId: string } }
  | { skipped: true; reason: string }
  | { error: string }
> {
  const [credentials] = await db
    .select()
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, userId))
    .limit(1)

  if (!credentials) {
    return { error: "Nenhuma chave de API cadastrada" }
  }

  if (credentials.webhookId && credentials.encryptedWebhookSecret) {
    return { data: { webhookId: credentials.webhookId } }
  }

  if (!canRegisterPublicWebhook()) {
    return {
      skipped: true,
      reason:
        "Webhook ainda não configurado: a AbacatePay exige uma URL HTTPS pública. Em desenvolvimento local, use um tunnel e defina NEXT_PUBLIC_APP_URL.",
    }
  }

  let apiKey: string

  try {
    apiKey = decrypt(credentials.encryptedKey)
  } catch {
    return { error: "Não foi possível descriptografar a chave de API" }
  }

  return registerAbacateWebhook({
    userId,
    apiKey,
    existingWebhookId: credentials.webhookId,
  })
}

export async function registerAbacateWebhook(input: {
  userId: string
  apiKey: string
  existingWebhookId?: string | null
}): Promise<
  | { data: { webhookId: string } }
  | { skipped: true; reason: string }
  | { error: string }
> {
  const { userId, apiKey, existingWebhookId } = input

  if (!canRegisterPublicWebhook()) {
    return {
      skipped: true,
      reason:
        "Webhook ainda não configurado: a AbacatePay exige uma URL HTTPS pública. Em desenvolvimento local, use um tunnel e defina NEXT_PUBLIC_APP_URL.",
    }
  }

  if (existingWebhookId) {
    await deleteAbacateWebhook(existingWebhookId, apiKey)
  }

  const secret = randomBytes(32).toString("hex")
  const endpoint = buildWebhookEndpoint(secret)

  const created = await createAbacateWebhook(
    {
      name: "Lumna Cobranças",
      endpoint,
      secret,
      events: [...WEBHOOK_EVENTS],
    },
    apiKey
  )

  if ("error" in created) {
    return {
      error: mapAbacatePayError(
        created.error ||
          "Não foi possível registrar o webhook na AbacatePay. Verifique as permissões da chave."
      ),
    }
  }

  let encryptedWebhookSecret: string

  try {
    encryptedWebhookSecret = encrypt(secret)
  } catch {
    return { error: "Não foi possível criptografar o secret do webhook" }
  }

  await db
    .update(abacatepayCredentials)
    .set({
      webhookId: created.data.id,
      encryptedWebhookSecret,
      updatedAt: new Date(),
    })
    .where(eq(abacatepayCredentials.userId, userId))

  return { data: { webhookId: created.data.id } }
}
