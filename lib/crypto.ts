import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto"
import { requireMercadoPagoEncryptionSecret } from "@/lib/env"

function getKey() {
  return createHash("sha256")
    .update(requireMercadoPagoEncryptionSecret())
    .digest()
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url")
}

export function encryptMercadoPagoToken(value: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [iv, encrypted, authTag]
    .map((item) => item.toString("base64url"))
    .join(".")
}

export function decryptMercadoPagoToken(value: string) {
  const [iv, encrypted, authTag] = value.split(".")

  if (!iv || !encrypted || !authTag) {
    throw new Error("Invalid encrypted token payload")
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(),
    decodeBase64Url(iv)
  )
  decipher.setAuthTag(decodeBase64Url(authTag))

  return Buffer.concat([
    decipher.update(decodeBase64Url(encrypted)),
    decipher.final(),
  ]).toString("utf8")
}

export function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function createSha256Base64Url(value: string) {
  return createHash("sha256").update(value).digest("base64url")
}

export function createHexHmac(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function safeCompareHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex")
  const rightBuffer = Buffer.from(right, "hex")

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}
