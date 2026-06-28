"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckIcon } from "lucide-react"

import { toast } from "sonner"
import { authClient } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

interface UserInfoFormProps {
  userName: string
  userEmail: string
}

const formSchema = z.object({
  email: z.email({ message: "Endereço de e-mail inválido" }),
  name: z
    .string()
    .min(6, { message: "O nome deve ter pelo menos 6 caracteres" })
    .max(64, { message: "O nome deve ter no máximo 64 caracteres" }),
})

type FormSchema = z.infer<typeof formSchema>

export function UserInfoForm({ userName, userEmail }: UserInfoFormProps) {
  const router = useRouter()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      name: userName,
    },
  })

  async function onSubmit(data: FormSchema) {
    try {
      await authClient.updateUser(
        {
          name: data.name,
        },
        {
          onSuccess: () => {
            toast.success("Informações do usuário atualizados com sucesso!")
            router.refresh()
          },
          onError: (error) => {
            toast.error("Falha ao atualizar informações do usuário")
            console.error("Failed to update user information: ", error)
          },
        }
      )
    } catch (error) {
      toast.error("Falha ao atualizar informações do usuário")
      console.error("Failed to update user information: ", error)
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="email"
                  placeholder="email@exemplo.com"
                  disabled={true}
                  {...field}
                />
              </FieldContent>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : (
                <FieldDescription>
                  O seu endereço de e-mail não pode ser alterado.
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="text"
                  placeholder="João da Silva"
                  disabled={isSubmitting}
                  {...field}
                />
              </FieldContent>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <CheckIcon />}
            {isSubmitting ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
