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

const signInFormSchema = z.object({
  email: z.email("Email inválido").trim(),
  password: z.string().trim().min(1, "A senha é obrigatória"),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function SignInForm() {
  const router = useRouter()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
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
            <div className="flex w-full items-center justify-between">
              <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground transition-colors duration-200 hover:text-primary hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
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
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? <Spinner /> : "Entrar"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  )
}
