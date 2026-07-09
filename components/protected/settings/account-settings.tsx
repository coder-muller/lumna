"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import type { SessionUser } from "@/components/protected/layout/user-nav"
import { DeleteAccountDialog } from "@/components/protected/settings/delete-account-dialog"
import { useUpdateName } from "@/hooks/use-account"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  updateNameSchema,
  type UpdateNameInput,
} from "@/server/account/account-schema"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0 || !parts[0]) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type AccountSettingsProps = {
  user: SessionUser
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const updateName = useUpdateName()
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const form = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  })

  const isSubmitting = form.formState.isSubmitting || updateName.isPending

  React.useEffect(() => {
    form.reset({ name: user.name })
  }, [user.name, form])

  function onSubmit(data: UpdateNameInput) {
    updateName.mutate(data, {
      onSuccess: (result) => {
        toast.success("Nome atualizado")
        form.reset({ name: result.name })
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Seu nome aparece no app. E-mail e foto vêm do GitHub.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md space-y-4"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FieldContent>
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={!form.formState.isDirty || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </FieldGroup>
        </form>
      </section>

      <section className="space-y-3 rounded-lg border border-destructive/20 p-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-destructive">
            Excluir conta
          </h3>
          <p className="text-sm text-muted-foreground">
            Remove permanentemente sua conta e todos os dados associados.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => setIsDeleteOpen(true)}
        >
          Excluir conta
        </Button>

        <DeleteAccountDialog
          email={user.email}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      </section>
    </div>
  )
}
