import { z } from "zod"

export const invoiceFormSchema = z.object({
  customerId: z.uuid("Cliente inválido"),

  title: z
    .string()
    .trim()
    .min(4, "O título deve ter no mínimo 4 caracteres")
    .max(128, "O título deve ter no máximo 128 caracteres"),

  description: z
    .preprocess((value) => {
      if (value === "" || value === null || value === undefined) {
        return null
      }

      return value
    }, z.string().trim().max(512, "A descrição deve ter no máximo 512 caracteres").nullable())
    .transform((value) => value ?? null),

  value: z.coerce
    .number()
    .int("O valor deve ser um número inteiro")
    .min(1, "O valor deve ser maior que 0"),
})

export const invoiceIdSchema = z.object({
  id: z.uuid("Cobrança inválida"),
})

export const getInvoicesSchema = z.object({
  search: z
    .string()
    .trim()
    .max(128, "A busca deve ter no máximo 128 caracteres")
    .optional()
    .transform((value) => value || undefined),

  page: z.coerce
    .number()
    .int("A página deve ser um número inteiro")
    .min(1, "A página deve ser maior que 0")
    .default(1),

  limit: z.coerce
    .number()
    .int("O limite deve ser um número inteiro")
    .min(1, "O limite deve ser maior que 0")
    .max(100, "O limite deve ser no máximo 100")
    .default(6),

  status: z.enum(["OPEN", "PAID", "CANCELED"]).optional(),
})

export type InvoiceFormInput = z.input<typeof invoiceFormSchema>
export type InvoiceFormData = z.output<typeof invoiceFormSchema>

export type GetInvoicesInput = z.input<typeof getInvoicesSchema>
export type GetInvoicesData = z.output<typeof getInvoicesSchema>
