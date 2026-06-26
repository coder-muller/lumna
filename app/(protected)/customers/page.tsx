"use client"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ArchiveIcon, CircleIcon, PlusIcon, SearchIcon } from "lucide-react"
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
import { Customers } from "@/lib/generated/prisma/client"
import { removeMask } from "@/lib/masks/user-data"
import { CustomersLoadingState } from "@/components/protected/customers/loading-state"
import { CustomersErrorState } from "@/components/protected/customers/error-state"
import { CustomersNoResultState } from "@/components/protected/customers/no-result-state"
import { CustomersEmptyArchivedState } from "@/components/protected/customers/empty-archived-state"
import { CustomersEmptyState } from "@/components/protected/customers/empty-state"
import { CustomerCard } from "@/components/protected/customers/customer-card"
import { CustomersPagination } from "@/components/protected/customers/customers-pagination"
import { CustomersDialog } from "@/components/protected/customers/customers-dialog"

type PendingAction = "archive" | "unarchive" | "delete" | null

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

const emptyFormValues = {
  name: "",
  email: "",
  phone: "",
}

export default function CustomersPage() {
  const [pendingAction, setPendingAction] = useState<{
    type: PendingAction
    customerId: string | null
  }>({
    type: null,
    customerId: null,
  })
  const [selectedCustomer, setSelectedCustomer] = useState<Customers | null>(
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
    archiveCustomerMutation,
    unarchiveCustomerMutation,
    deleteCustomerMutation,
    handlePageChange,
    handleSearchChange,
    handleArchivedChange,
    hasCustomers,
    hasNextPage,
    hasPreviousPage,
    page,
    limit,
    search,
    archived,
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

  function handleOpenEditDialog(customer: Customers) {
    setSelectedCustomer(customer)
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
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
      phone: data.phone ? removeMask(data.phone as string) : null,
    }

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
          selectedCustomer
            ? "Ocorreu um erro ao atualizar o cliente"
            : "Ocorreu um erro ao criar o cliente"
        )
      )
    }
  }

  const isSubmitting = form.formState.isSubmitting

  async function handleArchiveCustomer(
    e: React.MouseEvent<HTMLDivElement>,
    customerId: string
  ) {
    e.preventDefault()

    if (!customerId) {
      toast.error("Cliente inválido")
      return
    }

    setPendingAction({ type: "archive", customerId })

    try {
      await archiveCustomerMutation.mutateAsync(customerId)
      toast.success("Cliente arquivado com sucesso")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Ocorreu um erro ao arquivar o cliente")
      )
    } finally {
      setPendingAction({ type: null, customerId: null })
    }
  }

  async function handleUnarchiveCustomer(
    e: React.MouseEvent<HTMLDivElement>,
    customerId: string
  ) {
    e.preventDefault()

    if (!customerId) {
      toast.error("Cliente inválido")
      return
    }

    setPendingAction({ type: "unarchive", customerId })

    try {
      await unarchiveCustomerMutation.mutateAsync(customerId)
      toast.success("Cliente ativado com sucesso")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Ocorreu um erro ao desarquivar o cliente")
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

    if (!hasCustomers && archived) {
      return (
        <CustomersEmptyArchivedState onSetArchived={handleArchivedChange} />
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
              onArchive={handleArchiveCustomer}
              onUnarchive={handleUnarchiveCustomer}
              onDelete={handleDeleteCustomer}
              archivingCustomerId={
                pendingAction.type === "archive"
                  ? pendingAction.customerId
                  : null
              }
              unarchivingCustomerId={
                pendingAction.type === "unarchive"
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleArchivedChange(!archived)}
            >
              {!archived ? <ArchiveIcon /> : <CircleIcon />}
              <span className="hidden md:block">
                {!archived ? "Arquivados" : "Ativos"}
              </span>
            </Button>
            <Button variant="default" onClick={handleOpenCreateDialog}>
              <PlusIcon />
              <span className="hidden md:block">Novo cliente</span>
              <span className="md:hidden">Cliente</span>
            </Button>
          </div>
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
