import "server-only"

import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not set")
  }

  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    return Buffer.from(key, "hex")
  }

  const decoded = Buffer.from(key, "base64")
  if (decoded.length === 32) {
    return decoded
  }

  throw new Error(
    "ENCRYPTION_KEY must be 32 bytes as hex (64 hex chars) or base64 that decodes to 32 bytes"
  )
}

export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [iv, ciphertext, tag].map((part) => part.toString("base64")).join(":")
}

export function decrypt(payload: string): string {
  const key = getEncryptionKey()
  const parts = payload.split(":")

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format")
  }

  const [ivBase64, ciphertextBase64, tagBase64] = parts
  const iv = Buffer.from(ivBase64, "base64")
  const ciphertext = Buffer.from(ciphertextBase64, "base64")
  const tag = Buffer.from(tagBase64, "base64")
  const decipher = createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8")
}
