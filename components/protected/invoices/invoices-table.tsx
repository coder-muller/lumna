"use client"

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/generated/prisma/client"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"
import {
  CopyIcon,
  MoreHorizontalIcon,
  RefreshCcwIcon,
  XOctagonIcon,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

const INVOICE_STATUS = {
  OPEN: "OPEN",
  PAID: "PAID",
  CANCELED: "CANCELED",
} as const satisfies Record<InvoiceStatus, InvoiceStatus>

const statusLabels: Record<InvoiceStatus, string> = {
  OPEN: "Aberta",
  PAID: "Paga",
  CANCELED: "Cancelada",
}

const statusVariants: Record<
  InvoiceStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  OPEN: "outline",
  PAID: "default",
  CANCELED: "destructive",
}

interface InvoicesTableProps {
  invoices: InvoiceWithCustomer[]
  isFetching: boolean
  cancelingInvoiceId: string | null
  regeneratingInvoiceId: string | null
  onCancel: (invoiceId: string) => Promise<void>
  onRegenerateLink: (invoiceId: string) => Promise<void>
}

export function InvoicesTable({
  invoices,
  isFetching,
  cancelingInvoiceId,
  regeneratingInvoiceId,
  onCancel,
  onRegenerateLink,
}: InvoicesTableProps) {
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
            <TableHead className="text-center">Data de Emissão</TableHead>
            <TableHead className="text-center">Expira em</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[25px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const canCancel = invoice.status === INVOICE_STATUS.OPEN
            const isCanceling = cancelingInvoiceId === invoice.id
            const isRegenerating = regeneratingInvoiceId === invoice.id
            const isExpired = invoice.isStripeCheckoutExpired
            const canCopyPaymentLink =
              canCancel && !isExpired && Boolean(invoice.stripeCheckoutUrl)
            const canRegeneratePaymentLink = canCancel && isExpired

            return (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{invoice.title}</p>
                    {invoice.description && (
                      <p className="text-xs text-muted-foreground">
                        {invoice.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {invoice.customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.customer.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {format(invoice.createdAt, "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <p className="text-sm tabular-nums">
                      {invoice.stripeCheckoutExpiresAt
                        ? format(
                            invoice.stripeCheckoutExpiresAt,
                            "dd/MM/yyyy HH:mm"
                          )
                        : "Sem expiração"}
                    </p>
                    {isExpired ? (
                      <p className="text-xs text-destructive">Expirada</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <div>
                    <p>{formatCurrency(invoice.value)}</p>
                    {invoice.status === INVOICE_STATUS.PAID &&
                    invoice.netReceivedAmount !== null ? (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(invoice.netReceivedAmount)}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      isExpired ? "secondary" : statusVariants[invoice.status]
                    }
                  >
                    {isExpired ? "Expirada" : statusLabels[invoice.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canCopyPaymentLink && invoice.stripeCheckoutUrl ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleCopyPaymentLink(invoice.stripeCheckoutUrl!)
                          }
                        >
                          <CopyIcon />
                          Copiar link
                        </DropdownMenuItem>
                      ) : null}
                      {canRegeneratePaymentLink ? (
                        <DropdownMenuItem
                          disabled={isRegenerating}
                          onClick={() => onRegenerateLink(invoice.id)}
                        >
                          <RefreshCcwIcon />
                          {isRegenerating ? "Gerando..." : "Gerar novo link"}
                        </DropdownMenuItem>
                      ) : null}
                      {canCancel ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={isCanceling}
                              onSelect={(event) => event.preventDefault()}
                            >
                              <XOctagonIcon />
                              {isCanceling
                                ? "Cancelando..."
                                : "Cancelar cobrança"}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancelar cobrança?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação cancelará a cobrança{" "}
                                <span className="font-medium text-foreground">
                                  {invoice.title}
                                </span>
                                . Depois disso, ela não poderá ser paga.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                disabled={isCanceling}
                                onClick={() => onCancel(invoice.id)}
                              >
                                {isCanceling
                                  ? "Cancelando..."
                                  : "Cancelar cobrança"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
    </div>
  )
}
