"use client"

import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DicesIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

function generateDicebearUrl(seed: string) {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`
}

function generateRandomSeed() {
    return crypto.randomUUID()
}

const profileFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "O nome deve conter pelo menos 2 caracteres")
        .max(80, "O nome deve ter no máximo 80 caracteres"),
    image: z.string().url("Imagem inválida"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type ProfileFormProps = {
    userName: string
    userImage: string
}

function getInitials(value: string) {
    return value
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

export function ProfileForm({ userName, userImage }: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: userName,
            image: userImage,
        },
    })

    const isSubmitting = form.formState.isSubmitting

    const watchedName = useWatch({ control: form.control, name: "name" })
    const watchedImage = useWatch({ control: form.control, name: "image" })

    async function onSubmit(_values: ProfileFormValues) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        toast.success("Perfil atualizado")
        form.reset(_values)
    }

    function handleRandomizeAvatar() {
        form.setValue("image", generateDicebearUrl(generateRandomSeed()), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <FieldGroup>
                    <Field>
                        <FieldLabel>Foto de perfil</FieldLabel>
                        <FieldContent>
                            <div className="flex items-center gap-4 rounded-lg border p-4">
                                <Avatar className="size-16">
                                    <AvatarImage src={watchedImage} alt={watchedName} />
                                    <AvatarFallback>
                                        {getInitials(watchedName || userName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">Avatar DiceBear</p>
                                        <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
                                            A imagem usa uma seed UUID e pode ser trocada a qualquer
                                            momento.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRandomizeAvatar}
                                            disabled={isSubmitting}
                                        >
                                            <DicesIcon className="size-4" />
                                            Randomizar imagem
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </FieldContent>
                    </Field>

                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                                <FieldContent>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                        placeholder="Seu nome"
                                        type="text"
                                    />
                                </FieldContent>
                                {fieldState.error ? (
                                    <FieldError>{fieldState.error.message}</FieldError>
                                ) : (
                                    <FieldDescription>
                                        Esse nome será exibido na navegação e na sua conta.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex justify-start">
                        <Button type="submit" disabled={isSubmitting} className="min-w-36">
                            {isSubmitting ? <Spinner /> : "Salvar alterações"}
                        </Button>
                    </div>
                </FieldGroup>
            </div>
        </form>
    )
}
