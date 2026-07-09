"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { useDeleteAccount } from "@/hooks/use-account"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

type DeleteAccountDialogProps = {
  email: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function createDeleteAccountSchema(expectedEmail: string) {
  return z.object({
    email: z
      .string()
      .trim()
      .refine((value) => value.toLowerCase() === expectedEmail.toLowerCase(), {
        message: "O e-mail informado não corresponde à sua conta",
      }),
  })
}

type DeleteAccountFormValues = z.infer<
  ReturnType<typeof createDeleteAccountSchema>
>

export function DeleteAccountDialog({
  email,
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const deleteAccount = useDeleteAccount()
  const schema = React.useMemo(() => createDeleteAccountSchema(email), [email])

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  })

  const isSubmitting = form.formState.isSubmitting || deleteAccount.isPending

  React.useEffect(() => {
    if (!open) {
      form.reset({ email: "" })
    }
  }, [open, form])

  function onSubmit(data: DeleteAccountFormValues) {
    deleteAccount.mutate(
      { email: data.email },
      {
        onError: (error) => toast.error(error.message),
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir conta definitivamente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é permanente e não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Digite {email} para confirmar
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      type="email"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={fieldState.invalid}
                      placeholder={email}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FieldContent>
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : (
                    <FieldDescription>
                      Todos os seus dados serão removidos permanentemente.
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Excluindo...
                </>
              ) : (
                "Excluir conta definitivamente"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
