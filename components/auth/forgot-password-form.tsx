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
import { toast } from "sonner"

const forgotPasswordFormSchema = z.object({
  email: z.email("Email inválido").trim(),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>

export default function ForgotPasswordForm() {
  const router = useRouter()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("Link de recuperação enviado!", {
      description: "Verifique seu email para redefinir sua senha.",
    })
    router.push("/reset-password")
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
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? <Spinner /> : "Enviar link de recuperação"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Lembrou da sua senha?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}
