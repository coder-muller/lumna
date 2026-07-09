const API_KEY_PATTERN = /^(abc_(?:dev|prod))_(.+)$/

export function parseApiKeyParts(
  apiKey: string
): { keyPrefix: string; keyHint: string } | null {
  const match = apiKey.match(API_KEY_PATTERN)

  if (!match) {
    return null
  }

  const [, keyPrefix, secret] = match

  if (secret.length < 4) {
    return null
  }

  return {
    keyPrefix,
    keyHint: secret.slice(0, 4),
  }
}

export function formatMaskedKey(keyPrefix: string, keyHint: string): string {
  return `${keyPrefix}_${keyHint}••••••••`
}
