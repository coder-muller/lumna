"use client"

import { useMemo, useState } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useCustomers } from "@/hooks/use-customers"
import { cn } from "@/lib/utils"
import type { InvoiceFormInput } from "@/server/invoices/invoice-schema"

interface InvoicesDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InvoiceFormInput) => void
  isSubmitting: boolean
  form: UseFormReturn<InvoiceFormInput>
  canCreatePaymentLink: boolean
  connectRequirementMessage?: string
}

function formatCurrencyInput(value: unknown) {
  const cents = typeof value === "number" ? value : 0

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

function parseCurrencyInput(value: string) {
  const cents = Number(value.replace(/\D/g, ""))

  return Number.isNaN(cents) ? 0 : cents
}

export function InvoicesDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  form,
  canCreatePaymentLink,
  connectRequirementMessage,
}: InvoicesDialogProps) {
  const [isCustomerPopoverOpen, setIsCustomerPopoverOpen] = useState(false)
  const { customers, isLoadingCustomers, search, handleSearchChange } =
    useCustomers()

  const syncedCustomers = useMemo(
    () =>
      customers?.data.filter((customer) => customer.syncStatus === "synced") ??
      [],
    [customers?.data]
  )

  const selectedCustomer = syncedCustomers.find(
    (customer) => customer.id === form.watch("customerId")
  )
  const hasSelectedCustomer = Boolean(form.watch("customerId"))
  const hasSyncedCustomers = syncedCustomers.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova cobrança</DialogTitle>
          <DialogDescription>
            Crie uma cobrança para um cliente sincronizado
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {!canCreatePaymentLink && connectRequirementMessage ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {connectRequirementMessage}
              </div>
            ) : null}
            <Controller
              control={form.control}
              name="customerId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Cliente</FieldLabel>
                  <FieldContent>
                    <Popover
                      open={isCustomerPopoverOpen}
                      onOpenChange={setIsCustomerPopoverOpen}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={isCustomerPopoverOpen}
                            aria-invalid={fieldState.invalid}
                            disabled={isSubmitting || !canCreatePaymentLink}
                            className="w-full justify-between"
                          />
                        }
                      >
                        <span className="truncate">
                          {selectedCustomer
                            ? selectedCustomer.name
                            : "Selecione um cliente"}
                        </span>
                        <ChevronsUpDownIcon className="opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--anchor-width) p-0"
                        align="start"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Buscar cliente"
                            value={search}
                            onValueChange={handleSearchChange}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {isLoadingCustomers
                                ? "Carregando clientes..."
                                : "Nenhum cliente sincronizado encontrado"}
                            </CommandEmpty>
                            <CommandGroup>
                              {syncedCustomers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  value={customer.id}
                                  data-checked={customer.id === field.value}
                                  onSelect={() => {
                                    field.onChange(customer.id)
                                    setIsCustomerPopoverOpen(false)
                                  }}
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {customer.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {customer.email}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FieldContent>
                  {!hasSyncedCustomers && !isLoadingCustomers ? (
                    <p className="text-xs text-muted-foreground">
                      Nenhum cliente sincronizado disponível para criar
                      cobranças.
                    </p>
                  ) : null}
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Título</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Mensalidade de junho"
                      disabled={isSubmitting || !canCreatePaymentLink}
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
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
                  <FieldContent>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Detalhes da cobrança"
                      disabled={isSubmitting || !canCreatePaymentLink}
                      value={field.value ? String(field.value) : ""}
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
              name="value"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Valor</FieldLabel>
                  <FieldContent>
                    <Input
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      disabled={isSubmitting || !canCreatePaymentLink}
                      inputMode="numeric"
                      value={formatCurrencyInput(field.value)}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(parseCurrencyInput(event.target.value))
                      }
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant="default"
                disabled={
                  isSubmitting ||
                  !hasSelectedCustomer ||
                  !hasSyncedCustomers ||
                  !canCreatePaymentLink
                }
                className={cn(!hasSyncedCustomers && "cursor-not-allowed")}
              >
                {isSubmitting ? <Spinner /> : <CheckIcon />}
                {isSubmitting ? "Criando..." : "Criar cobrança"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
