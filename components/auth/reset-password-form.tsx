"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Field, FieldContent, FieldLabel, FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

const resetPasswordFormSchema = z.object({
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
    ),
    confirmPassword: z.string().min(8, "A confirmação de senha deve ter no mínimo 8 caracteres").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
    ),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>

export default function ResetPasswordForm() {
    const router = useRouter()

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit() {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Senha redefinida com sucesso!", {
            description: "Você pode agora fazer login com sua nova senha."
        })
        router.push("/sign-in")
        form.reset()
    }

    const isSubmitting = form.formState.isSubmitting

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
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
            <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Confirmar nova senha</FieldLabel>
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
                {isSubmitting ? <Spinner /> : "Redefinir senha"}
            </Button>
        </form>
    )
}
