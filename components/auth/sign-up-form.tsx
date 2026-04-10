"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Field, FieldContent, FieldLabel, FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

import { useRouter } from "next/navigation"
import Link from "next/link"

const signUpFormSchema = z.object({
  name: z.string().trim().min(6, "O nome deve conter pelo menos 6 caracteres"),
  email: z.email("Email inválido").trim(),
  password: z
    .string()
    .trim()
    .min(8, "A senha deve conter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
    ),
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export default function SignUpForm() {
  const router = useRouter()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/dashboard")
    form.reset()
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="João da Silva"
                type="text"
                disabled={isSubmitting}
              />
            </FieldContent>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="joao@example.com"
                type="email"
                disabled={isSubmitting}
              />
            </FieldContent>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                type="password"
                disabled={isSubmitting}
              />
            </FieldContent>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? <Spinner /> : "Criar conta"}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        Já tem uma conta?{" "}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  )
}
