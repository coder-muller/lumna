"use client"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesDialog } from "@/components/protected/invoices/invoices-dialog"
import { InvoicesEmptyFilterState } from "@/components/protected/invoices/empty-filter-state"
import { InvoicesEmptyState } from "@/components/protected/invoices/empty-state"
import { InvoicesErrorState } from "@/components/protected/invoices/error-state"
import { InvoicesLoadingState } from "@/components/protected/invoices/loading-state"
import { InvoicesNoResultState } from "@/components/protected/invoices/no-result-state"
import { InvoicesPagination } from "@/components/protected/invoices/invoices-pagination"
import { InvoicesTable } from "@/components/protected/invoices/invoices-table"
import { Separator } from "@/components/ui/separator"
import { useInvoices } from "@/hooks/use-invoices"
import type { InvoiceStatus } from "@/lib/generated/prisma/client"
import {
  invoiceFormSchema,
  type InvoiceFormInput,
} from "@/server/invoices/invoice-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

const emptyFormValues: InvoiceFormInput = {
  customerId: "",
  title: "",
  description: "",
  value: 0,
}

const statusToTabValue = (status: InvoiceStatus | undefined) => status ?? "all"

const tabValueToStatus = (value: string) => {
  if (value === "all") {
    return undefined
  }

  return value as InvoiceStatus
}

const statusFilterLabels: Record<InvoiceStatus, string> = {
  OPEN: "aberta",
  PAID: "paga",
  CANCELED: "cancelada",
}

const INVOICE_STATUS = {
  OPEN: "OPEN",
  PAID: "PAID",
  CANCELED: "CANCELED",
} as const satisfies Record<InvoiceStatus, InvoiceStatus>

export default function InvoicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cancelingInvoiceId, setCancelingInvoiceId] = useState<string | null>(
    null
  )

  const {
    invoices,
    isLoadingInvoices,
    isFetchingInvoices,
    errorInvoices,
    refetchInvoices,
    createInvoiceMutation,
    cancelInvoiceMutation,
    handlePageChange,
    handleSearchChange,
    handleStatusChange,
    hasInvoices,
    hasNextPage,
    hasPreviousPage,
    page,
    limit,
    search,
    status,
  } = useInvoices()

  const form = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: emptyFormValues,
  })

  function handleOpenCreateDialog() {
    form.reset(emptyFormValues)
    setIsDialogOpen(true)
  }

  function resetDialog() {
    setIsDialogOpen(false)
    form.reset(emptyFormValues)
  }

  async function handleSubmitInvoice(data: InvoiceFormInput) {
    try {
      await createInvoiceMutation.mutateAsync(data)
      toast.success("Cobrança criada com sucesso")
      resetDialog()
    } catch (error) {
      toast.error(getErrorMessage(error, "Ocorreu um erro ao criar a cobrança"))
    }
  }

  async function handleCancelInvoice(invoiceId: string) {
    if (!invoiceId) {
      toast.error("Cobrança inválida")
      return
    }

    setCancelingInvoiceId(invoiceId)

    try {
      await cancelInvoiceMutation.mutateAsync(invoiceId)
      toast.success("Cobrança cancelada com sucesso")
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Ocorreu um erro ao cancelar a cobrança")
      )
    } finally {
      setCancelingInvoiceId(null)
    }
  }

  const isSubmitting = form.formState.isSubmitting
  const counts = invoices?.counts ?? {
    all: 0,
    open: 0,
    paid: 0,
    canceled: 0,
  }

  const content = (() => {
    if (isLoadingInvoices) {
      return <InvoicesLoadingState />
    }

    if (errorInvoices) {
      return <InvoicesErrorState onRetry={refetchInvoices} />
    }

    if (!hasInvoices && search) {
      return (
        <InvoicesNoResultState
          search={search}
          onClearSearch={() => handleSearchChange("")}
        />
      )
    }

    if (!hasInvoices && status) {
      return <InvoicesEmptyFilterState label={statusFilterLabels[status]} />
    }

    if (!hasInvoices) {
      return <InvoicesEmptyState onCreate={handleOpenCreateDialog} />
    }

    return (
      <>
        <InvoicesTable
          invoices={invoices?.data ?? []}
          isFetching={isFetchingInvoices}
          cancelingInvoiceId={cancelingInvoiceId}
          onCancel={handleCancelInvoice}
        />

        <Separator className="my-4" />

        <InvoicesPagination
          page={page}
          limit={limit}
          total={invoices?.total || 0}
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
          <h1 className="text-2xl font-bold">Cobranças</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas cobranças e suas informações
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Buscar cobrança"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </InputGroup>
          <Button variant="default" onClick={handleOpenCreateDialog}>
            <PlusIcon />
            <span className="hidden md:block">Nova cobrança</span>
            <span className="md:hidden">Cobrança</span>
          </Button>
        </div>
        <Tabs
          value={statusToTabValue(status)}
          onValueChange={(value) => handleStatusChange(tabValueToStatus(value))}
        >
          <TabsList variant="line">
            <TabsTrigger value="all">Todas ({counts.all})</TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.OPEN}>
              Abertas ({counts.open})
            </TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.PAID}>
              Pagas ({counts.paid})
            </TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.CANCELED}>
              Canceladas ({counts.canceled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {content}
      </div>
      <InvoicesDialog
        isOpen={isDialogOpen}
        onClose={resetDialog}
        onSubmit={handleSubmitInvoice}
        isSubmitting={isSubmitting}
        form={form}
      />
    </>
  )
}
