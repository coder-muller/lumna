import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

// Public HMAC key from AbacatePay docs — used to verify X-Webhook-Signature.
const ABACATEPAY_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9"

export function verifyAbacateWebhookSignature(
  rawBody: string,
  signatureFromHeader: string | null
): boolean {
  if (!signatureFromHeader) {
    return false
  }

  const expectedSig = createHmac("sha256", ABACATEPAY_PUBLIC_KEY)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64")

  const expected = Buffer.from(expectedSig)
  const received = Buffer.from(signatureFromHeader)

  if (expected.length !== received.length) {
    return false
  }

  return timingSafeEqual(expected, received)
}
