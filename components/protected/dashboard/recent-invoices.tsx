"use client"

import Link from "next/link"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/generated/prisma/client"
import type { InvoiceWithCustomer } from "@/server/invoices/get-invoices"
import { ArrowRightIcon } from "lucide-react"

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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
}

interface RecentInvoicesProps {
  invoices: InvoiceWithCustomer[]
  isFetching: boolean
}

export function RecentInvoices({ invoices, isFetching }: RecentInvoicesProps) {
  return (
    <section aria-label="Cobranças recentes">
      <Card
        className={cn(
          "animate-fade-in-up gap-0 border-border/60 py-0 opacity-0 fill-mode-[forwards] [animation-delay:450ms]",
          isFetching && "animate-pulse"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-5">
          <CardTitle className="text-base">Últimas cobranças</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              Ver todas
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {invoices.map((invoice) => {
              const displayedAmount =
                invoice.status === "PAID"
                  ? (invoice.netReceivedAmount ?? invoice.value)
                  : invoice.value

              return (
                <div
                  key={invoice.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {getInitials(invoice.customer.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {invoice.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {invoice.customer.name}
                    </p>
                  </div>
                  <Badge
                    variant={statusVariants[invoice.status]}
                    className="hidden sm:inline-flex"
                  >
                    {statusLabels[invoice.status]}
                  </Badge>
                  <p className="shrink-0 text-sm font-medium tabular-nums">
                    {formatCurrency(displayedAmount)}
                  </p>
                  <p className="hidden shrink-0 text-xs text-muted-foreground md:block">
                    {format(invoice.createdAt, "dd/MM/yyyy")}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
