"use client"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useCustomers } from "@/hooks/use-customers"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  customerFormSchema,
  CustomerFormInput,
} from "@/server/customers/customer-schema"
import type { Customer } from "@/lib/db/schema"
import { removeDocumentMask, removeMask } from "@/lib/masks/user-data"
import { CustomersLoadingState } from "@/components/protected/customers/loading-state"
import { CustomersErrorState } from "@/components/protected/customers/error-state"
import { CustomersNoResultState } from "@/components/protected/customers/no-result-state"
import { CustomersEmptyState } from "@/components/protected/customers/empty-state"
import { CustomerCard } from "@/components/protected/customers/customer-card"
import { CustomersPagination } from "@/components/protected/customers/customers-pagination"
import { CustomersDialog } from "@/components/protected/customers/customers-dialog"

type PendingAction = "delete" | "resync" | null

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

const emptyFormValues = {
  name: "",
  email: "",
  phone: "",
  taxId: "",
}

export default function CustomersPage() {
  const [pendingAction, setPendingAction] = useState<{
    type: PendingAction
    customerId: string | null
  }>({
    type: null,
    customerId: null,
  })
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    customers,
    isLoadingCustomers,
    isFetchingCustomers,
    errorCustomers,
    refetchCustomers,
    createCustomerMutation,
    updateCustomerMutation,
    resyncCustomerMutation,
    deleteCustomerMutation,
    handlePageChange,
    handleSearchChange,
    hasCustomers,
    hasNextPage,
    hasPreviousPage,
    page,
    limit,
    search,
  } = useCustomers()

  const form = useForm<CustomerFormInput>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: emptyFormValues,
  })

  function handleOpenCreateDialog() {
    setSelectedCustomer(null)
    form.reset(emptyFormValues)
    setIsDialogOpen(true)
  }

  function handleOpenEditDialog(customer: Customer) {
    setSelectedCustomer(customer)
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      taxId: customer.taxId ?? "",
    })
    setIsDialogOpen(true)
  }

  function resetDialog() {
    setSelectedCustomer(null)
    setIsDialogOpen(false)
    form.reset(emptyFormValues)
  }

  async function handleSubmitCustomer(data: CustomerFormInput) {
    const formattedData = {
      name: data.name,
      email: data.email,
      phone: data.phone ? removeMask(data.phone as string) : "",
      taxId: data.taxId ? removeDocumentMask(data.taxId as string) : "",
    }

    const isEditing = Boolean(selectedCustomer)

    try {
      if (selectedCustomer) {
        await updateCustomerMutation.mutateAsync({
          id: selectedCustomer.id,
          ...formattedData,
        })
        toast.success("Cliente atualizado com sucesso")
      } else {
        await createCustomerMutation.mutateAsync(formattedData)
        toast.success("Cliente criado com sucesso")
      }
      resetDialog()
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          isEditing
            ? "Ocorreu um erro ao atualizar o cliente"
            : "Ocorreu um erro ao criar o cliente"
        )
      )
      if (isEditing) {
        resetDialog()
      }
    }
  }

  const isSubmitting = form.formState.isSubmitting

  async function handleResyncCustomer(
    e: React.MouseEvent<HTMLDivElement>,
    customerId: string
  ) {
    e.preventDefault()

    if (!customerId) {
      toast.error("Cliente inválido")
      return
    }

    setPendingAction({ type: "resync", customerId })

    try {
      await resyncCustomerMutation.mutateAsync(customerId)
      toast.success("Cliente ressincronizado com sucesso")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Ocorreu um erro ao ressincronizar o cliente")
      )
    } finally {
      setPendingAction({ type: null, customerId: null })
    }
  }

  async function handleDeleteCustomer(
    e: React.MouseEvent<HTMLButtonElement>,
    customerId: string
  ) {
    e.preventDefault()

    if (!customerId) {
      toast.error("Cliente inválido")
      return
    }

    setPendingAction({ type: "delete", customerId })

    try {
      await deleteCustomerMutation.mutateAsync(customerId)
      toast.success("Cliente deletado com sucesso")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Ocorreu um erro ao deletar o cliente")
      )
    } finally {
      setPendingAction({ type: null, customerId: null })
    }
  }

  const content = (() => {
    if (isLoadingCustomers) {
      return <CustomersLoadingState />
    }

    if (errorCustomers) {
      return <CustomersErrorState onRetry={refetchCustomers} />
    }

    if (!hasCustomers && search) {
      return (
        <CustomersNoResultState
          search={search}
          onClearSearch={() => handleSearchChange("")}
        />
      )
    }

    if (!hasCustomers) {
      return <CustomersEmptyState onCreate={handleOpenCreateDialog} />
    }

    return (
      <>
        <div
          className={cn(
            "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
            isFetchingCustomers && "animate-pulse"
          )}
        >
          {customers?.data.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleOpenEditDialog}
              onResync={handleResyncCustomer}
              onDelete={handleDeleteCustomer}
              resyncingCustomerId={
                pendingAction.type === "resync"
                  ? pendingAction.customerId
                  : null
              }
              deletingCustomerId={
                pendingAction.type === "delete"
                  ? pendingAction.customerId
                  : null
              }
            />
          ))}
        </div>

        <Separator className="my-4" />

        <CustomersPagination
          page={page}
          limit={limit}
          total={customers?.total || 0}
          onPageChange={handlePageChange}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
        />
      </>
    )
  })()

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus clientes e suas informações
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Buscar cliente"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </InputGroup>
          <Button variant="default" onClick={handleOpenCreateDialog}>
            <PlusIcon />
            <span className="hidden md:block">Novo cliente</span>
            <span className="md:hidden">Cliente</span>
          </Button>
        </div>

        {content}
      </div>
      <CustomersDialog
        isOpen={isDialogOpen}
        onClose={resetDialog}
        onSubmit={handleSubmitCustomer}
        isSubmitting={isSubmitting}
        selectedCustomer={selectedCustomer}
        form={form}
      />
    </>
  )
}
