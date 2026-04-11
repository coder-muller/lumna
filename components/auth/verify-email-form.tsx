"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Field, FieldContent, FieldError } from "../ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { REGEXP_ONLY_DIGITS } from "input-otp"

const verifyEmailFormSchema = z.object({
  code: z
    .string()
    .length(6, "O código deve ter 6 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números"),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailFormSchema>

export default function VerifyEmailForm() {
  const router = useRouter()

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("Email verificado com sucesso!")
    router.push("/dashboard")
    form.reset()
  }

  async function onResend() {
    toast.success("Código reenviado!", {
      description: "Verifique sua caixa de entrada.",
    })
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                containerClassName="justify-center"
                aria-invalid={fieldState.invalid}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-12 text-lg" />
                  <InputOTPSlot index={1} className="size-12 text-lg" />
                  <InputOTPSlot index={2} className="size-12 text-lg" />
                  <InputOTPSlot index={3} className="size-12 text-lg" />
                  <InputOTPSlot index={4} className="size-12 text-lg" />
                  <InputOTPSlot index={5} className="size-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </FieldContent>
            {fieldState.error && (
              <FieldError className="text-center">
                {fieldState.error.message}
              </FieldError>
            )}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner /> : "Verificar email"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={onResend}
          className="cursor-pointer font-medium text-primary hover:underline"
        >
          Reenviar
        </button>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </p>
    </form>
  )
}
