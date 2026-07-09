"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CopyIcon, PlusIcon, SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { InvoicesDialog } from "@/components/protected/invoices/invoices-dialog"
import { InvoicesEmptyFilterState } from "@/components/protected/invoices/empty-filter-state"
import { InvoicesEmptyState } from "@/components/protected/invoices/empty-state"
import { InvoicesErrorState } from "@/components/protected/invoices/error-state"
import { InvoicesLoadingState } from "@/components/protected/invoices/loading-state"
import { InvoicesNoResultState } from "@/components/protected/invoices/no-result-state"
import { InvoicesPagination } from "@/components/protected/invoices/invoices-pagination"
import { InvoicesTable } from "@/components/protected/invoices/invoices-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAbacatepayCredentials } from "@/hooks/use-abacatepay-credentials"
import { useInvoices } from "@/hooks/use-invoices"
import type { Invoice, InvoiceStatus } from "@/lib/db/schema"
import {
  invoiceFormSchema,
  type InvoiceFormInput,
} from "@/server/invoices/invoice-schema"

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

const tabValueToStatus = (value: string): InvoiceStatus | undefined => {
  if (value === "all") {
    return undefined
  }

  return value as InvoiceStatus
}

const statusFilterLabels: Record<InvoiceStatus, string> = {
  OPEN: "aberta",
  PAID: "paga",
  CANCELED: "cancelada",
  REFUNDED: "reembolsada",
}

const INVOICE_STATUS = {
  OPEN: "OPEN",
  PAID: "PAID",
  CANCELED: "CANCELED",
  REFUNDED: "REFUNDED",
} as const satisfies Record<InvoiceStatus, InvoiceStatus>

export default function InvoicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null)
  const [cancelingInvoiceId, setCancelingInvoiceId] = useState<string | null>(
    null
  )

  const { data: credentials } = useAbacatepayCredentials()

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

  const canCreatePaymentLink = Boolean(credentials)
  const connectRequirementMessage =
    "Conecte sua chave da AbacatePay antes de criar cobranças."

  function handleOpenCreateDialog() {
    if (!canCreatePaymentLink) {
      toast.error(connectRequirementMessage)
      return
    }

    form.reset(emptyFormValues)
    setIsDialogOpen(true)
  }

  function resetDialog() {
    setIsDialogOpen(false)
    form.reset(emptyFormValues)
  }

  async function handleSubmitInvoice(data: InvoiceFormInput) {
    try {
      const response = await createInvoiceMutation.mutateAsync(data)
      setCreatedInvoice(response.data)
      toast.success("Cobrança criada com link de pagamento")
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

  async function handleCopyCreatedInvoiceLink() {
    if (!createdInvoice?.checkoutUrl) {
      return
    }

    await navigator.clipboard.writeText(createdInvoice.checkoutUrl)
    toast.success("Link de pagamento copiado")
  }

  const isSubmitting =
    form.formState.isSubmitting || createInvoiceMutation.isPending

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Cobranças</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas cobranças e links de pagamento
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
          <Button
            variant="default"
            onClick={handleOpenCreateDialog}
            disabled={!canCreatePaymentLink}
          >
            <PlusIcon />
            <span className="hidden md:block">Nova cobrança</span>
            <span className="md:hidden">Cobrança</span>
          </Button>
        </div>

        {!canCreatePaymentLink ? (
          <p className="text-sm text-muted-foreground">
            {connectRequirementMessage}
          </p>
        ) : null}

        <Tabs
          value={statusToTabValue(status)}
          onValueChange={(value) => handleStatusChange(tabValueToStatus(value))}
        >
          <TabsList variant="line">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.OPEN}>Abertas</TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.PAID}>Pagas</TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.CANCELED}>
              Canceladas
            </TabsTrigger>
            <TabsTrigger value={INVOICE_STATUS.REFUNDED}>
              Reembolsadas
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
        canCreatePaymentLink={canCreatePaymentLink}
        connectRequirementMessage={connectRequirementMessage}
      />

      <Dialog
        open={Boolean(createdInvoice)}
        onOpenChange={(open) => {
          if (!open) {
            setCreatedInvoice(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link de pagamento criado</DialogTitle>
            <DialogDescription>
              Copie o link e envie para o cliente realizar o pagamento.
            </DialogDescription>
          </DialogHeader>
          <InputGroup>
            <InputGroupInput
              readOnly
              value={createdInvoice?.checkoutUrl ?? ""}
            />
            <InputGroupAddon>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopyCreatedInvoiceLink}
                disabled={!createdInvoice?.checkoutUrl}
              >
                <CopyIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <DialogFooter>
            <Button type="button" onClick={handleCopyCreatedInvoiceLink}>
              <CopyIcon />
              Copiar link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
