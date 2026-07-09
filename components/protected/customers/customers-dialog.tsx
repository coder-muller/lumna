"use client"

import type { Customer } from "@/lib/db/schema"
import { CustomerFormInput } from "@/server/customers/customer-schema"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon } from "lucide-react"
import { Controller, UseFormReturn } from "react-hook-form"
import { maskDocument, maskPhone } from "@/lib/masks/user-data"

interface CustomersDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CustomerFormInput) => void
  isSubmitting: boolean
  selectedCustomer: Customer | null
  form: UseFormReturn<CustomerFormInput>
}

export function CustomersDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  selectedCustomer,
  form,
}: CustomersDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedCustomer ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
          <DialogDescription>
            {selectedCustomer
              ? "Edite as informações do cliente"
              : "Crie um novo cliente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="João da Silva"
                      disabled={isSubmitting}
                      type="text"
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="joao@exemplo.com"
                      disabled={isSubmitting}
                      type="email"
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Telefone</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="(11) 99999-9999"
                      disabled={isSubmitting}
                      value={
                        field.value ? maskPhone(field.value as string) : ""
                      }
                      onChange={(e) =>
                        field.onChange(maskPhone(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="taxId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>CPF/CNPJ</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="000.000.000-00"
                      disabled={isSubmitting}
                      value={
                        field.value ? maskDocument(field.value as string) : ""
                      }
                      onChange={(e) =>
                        field.onChange(maskDocument(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <CheckIcon />}
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
