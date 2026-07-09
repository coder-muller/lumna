import { z } from "zod"

export const saveCredentialsSchema = z.object({
  apiKey: z
    .string()
    .trim()
    .regex(
      /^abc_(dev|prod)_[A-Za-z0-9]+$/,
      "A chave deve começar com abc_dev_ ou abc_prod_"
    ),
})

export type SaveCredentialsInput = z.infer<typeof saveCredentialsSchema>

export type AbacatepayCredentialsPublic = {
  keyPrefix: string
  keyHint: string
}
