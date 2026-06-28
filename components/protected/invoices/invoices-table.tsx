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
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/generated/prisma/client"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"
import { MoreHorizontalIcon, XOctagonIcon } from "lucide-react"
import { format } from "date-fns"

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100)
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
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[25px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const canCancel = invoice.status === INVOICE_STATUS.OPEN
            const isCanceling = cancelingInvoiceId === invoice.id

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
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(invoice.value)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={statusVariants[invoice.status]}>
                    {statusLabels[invoice.status]}
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
