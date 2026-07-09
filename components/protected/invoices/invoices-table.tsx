"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  CopyIcon,
  MoreHorizontalIcon,
  TriangleAlertIcon,
  XOctagonIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/db/schema"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"

const INVOICE_STATUS = {
  OPEN: "OPEN",
  PAID: "PAID",
  CANCELED: "CANCELED",
  REFUNDED: "REFUNDED",
} as const satisfies Record<InvoiceStatus, InvoiceStatus>

const statusLabels: Record<InvoiceStatus, string> = {
  OPEN: "Aberta",
  PAID: "Paga",
  CANCELED: "Cancelada",
  REFUNDED: "Reembolsada",
}

const statusVariants: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  OPEN: "outline",
  PAID: "default",
  CANCELED: "destructive",
  REFUNDED: "secondary",
}

interface InvoicesTableProps {
  invoices: InvoiceWithCustomer[]
  isFetching: boolean
  cancelingInvoiceId: string | null
  onCancel: (invoiceId: string) => Promise<void>
}

export function InvoicesTable({
  invoices,
  isFetching,
  cancelingInvoiceId,
  onCancel,
}: InvoicesTableProps) {
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)

  const cancelTarget = invoices.find((invoice) => invoice.id === cancelTargetId)
  const isCanceling = Boolean(
    cancelTargetId && cancelingInvoiceId === cancelTargetId
  )

  async function handleCopyPaymentLink(url: string) {
    await navigator.clipboard.writeText(url)
    toast.success("Link de pagamento copiado")
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4",
        isFetching && "animate-pulse"
      )}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cobrança</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-center">Data</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[25px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const canCancel = invoice.status === INVOICE_STATUS.OPEN
            const isRowCanceling = cancelingInvoiceId === invoice.id
            const canCopyPaymentLink = canCancel && Boolean(invoice.checkoutUrl)

            return (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{invoice.title}</p>
                    {invoice.description ? (
                      <p className="text-xs text-muted-foreground">
                        {invoice.description}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">
                      {invoice.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.customerEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {format(invoice.createdAt, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(invoice.value)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant={statusVariants[invoice.status]}>
                      {statusLabels[invoice.status]}
                    </Badge>
                    {invoice.refundFailedAt ? (
                      <Badge variant="destructive">
                        <TriangleAlertIcon />
                        Falha no reembolso
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button size="icon" variant="ghost" />}
                    >
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canCopyPaymentLink && invoice.checkoutUrl ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleCopyPaymentLink(invoice.checkoutUrl)
                          }
                        >
                          <CopyIcon />
                          Copiar link
                        </DropdownMenuItem>
                      ) : null}
                      {canCancel ? (
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={isRowCanceling}
                          onClick={() => setCancelTargetId(invoice.id)}
                        >
                          {isRowCanceling ? <Spinner /> : <XOctagonIcon />}
                          {isRowCanceling
                            ? "Cancelando..."
                            : "Cancelar cobrança"}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem variant="destructive" disabled>
                          <XOctagonIcon />
                          Cancelar cobrança
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <AlertDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTargetId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar cobrança?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação cancelará a cobrança{" "}
              <span className="font-medium text-foreground">
                {cancelTarget?.title}
              </span>
              . O link de pagamento pode continuar funcionando. Se o cliente
              pagar após o cancelamento, o valor será reembolsado
              automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isCanceling}
              onClick={async (event) => {
                event.preventDefault()
                if (!cancelTarget) {
                  return
                }
                await onCancel(cancelTarget.id)
                setCancelTargetId(null)
              }}
            >
              {isCanceling ? <Spinner /> : <XOctagonIcon />}
              {isCanceling ? "Cancelando..." : "Cancelar cobrança"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
