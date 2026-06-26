import { z } from "zod"
import { validatePhone } from "@/lib/validators/user-data"

export const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, "O nome deve ter no mínimo 4 caracteres")
    .max(128, "O nome deve ter no máximo 128 caracteres"),

  email: z.email("Email inválido").trim().toLowerCase(),

  phone: z
    .preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return null
        }

        return value
      },
      z
        .string()
        .trim()
        .refine((value) => validatePhone(value), "Telefone inválido")
        .nullable()
    )
    .transform((value) => value ?? null),
})

export const customerIdSchema = z.object({
  id: z.string().uuid("Cliente inválido"),
})

export const updateCustomerSchema = customerIdSchema.merge(customerFormSchema)

export const getCustomersSchema = z.object({
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

  archived: z.boolean().optional().default(false),
})

export type CustomerFormInput = z.input<typeof customerFormSchema>
export type CustomerFormData = z.output<typeof customerFormSchema>

export type UpdateCustomerInput = z.input<typeof updateCustomerSchema>
export type UpdateCustomerData = z.output<typeof updateCustomerSchema>

export type GetCustomersInput = z.input<typeof getCustomersSchema>
export type GetCustomersData = z.output<typeof getCustomersSchema>
