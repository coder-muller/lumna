"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useSaveAbacatepayCredentials } from "@/hooks/use-abacatepay-credentials"
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
import {
  saveCredentialsSchema,
  type SaveCredentialsInput,
} from "@/server/abacatepay-credentials/credentials-schema"

type ApiKeyFormProps = {
  submitLabel?: string
  onSuccess?: () => void
  onCancel?: () => void
  autoFocus?: boolean
}

export function ApiKeyForm({
  submitLabel = "Salvar chave",
  onSuccess,
  onCancel,
  autoFocus,
}: ApiKeyFormProps) {
  const saveCredentials = useSaveAbacatepayCredentials()

  const form = useForm<SaveCredentialsInput>({
    resolver: zodResolver(saveCredentialsSchema),
    defaultValues: { apiKey: "" },
  })

  const isSubmitting = form.formState.isSubmitting || saveCredentials.isPending

  function onSubmit(data: SaveCredentialsInput) {
    saveCredentials.mutate(data, {
      onSuccess: () => {
        toast.success("Chave da AbacatePay salva")
        form.reset()
        onSuccess?.()
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="apiKey"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Chave de API</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={fieldState.invalid}
                  placeholder="abc_dev_..."
                  autoFocus={autoFocus}
                  disabled={isSubmitting}
                  {...field}
                />
              </FieldContent>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : (
                <FieldDescription>
                  Aceita chaves abc_dev_ ou abc_prod_ com permissão STORE:READ.
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                Validando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </FieldGroup>
    </form>
  )
}
