"use client"

import type { Customer } from "@/lib/db/schema"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomerActionsButton } from "./customer-actions-button"

interface CustomerCardProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onResync: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, customerId: string) => void
  resyncingCustomerId: string | null
  deletingCustomerId: string | null
}

export function CustomerCard({
  customer,
  onEdit,
  onResync,
  onDelete,
  resyncingCustomerId,
  deletingCustomerId,
}: CustomerCardProps) {
  const customerSince = format(customer.createdAt, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-medium">{customer.name}</h2>
            {customer.syncStatus === "desynced" && (
              <Badge variant="outline">Dessincronizado</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-xs text-muted-foreground">desde {customerSince}</p>
          <CustomerActionsButton
            customer={customer}
            onEdit={onEdit}
            onResync={onResync}
            onDelete={onDelete}
            resyncingCustomerId={resyncingCustomerId}
            deletingCustomerId={deletingCustomerId}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
