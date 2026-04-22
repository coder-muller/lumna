"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const changePasswordFormSchema = z
    .object({
        currentPassword: z.string().min(1, "Informe sua senha atual"),
        newPassword: z
            .string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .max(128, "A senha deve ter no máximo 128 caracteres"),
        confirmPassword: z.string().min(1, "Confirme a nova senha"),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
    })

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

export function ChangePasswordForm() {
    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(_values: ChangePasswordFormValues) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        toast.success("Senha alterada", {
            description: "As outras sessões foram encerradas por segurança.",
        })
        form.reset()
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-medium text-balance">Senha</h2>
                    <p className="text-[13px] leading-relaxed text-pretty text-muted-foreground">
                        Atualize sua senha e encerre as outras sessões automaticamente.
                    </p>
                </div>

                <FieldGroup>
                    <Controller
                        control={form.control}
                        name="currentPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Senha atual</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder="Digite sua senha atual"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </FieldContent>
                                {fieldState.error ? (
                                    <FieldError>{fieldState.error.message}</FieldError>
                                ) : (
                                    <FieldDescription>
                                        Precisamos confirmar a senha atual antes de aplicar a troca.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="newPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nova senha</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder="Digite a nova senha"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </FieldContent>
                                {fieldState.error ? (
                                    <FieldError>{fieldState.error.message}</FieldError>
                                ) : (
                                    <FieldDescription>Mínimo de 6 caracteres.</FieldDescription>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Confirmar nova senha
                                </FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder="Repita a nova senha"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </FieldContent>
                                {fieldState.error ? (
                                    <FieldError>{fieldState.error.message}</FieldError>
                                ) : (
                                    <FieldDescription>
                                        Repita a nova senha para confirmar.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex justify-start">
                        <Button type="submit" disabled={isSubmitting} className="min-w-36">
                            {isSubmitting ? <Spinner /> : "Alterar senha"}
                        </Button>
                    </div>
                </FieldGroup>
            </div>
        </form>
    )
}
