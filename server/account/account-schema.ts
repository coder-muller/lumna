import { z } from "zod"

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres")
    .max(80, "O nome deve ter no máximo 80 caracteres"),
})

export type UpdateNameInput = z.infer<typeof updateNameSchema>

export const deleteAccountSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
})

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>
