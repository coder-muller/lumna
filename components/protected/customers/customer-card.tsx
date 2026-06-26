"use client"

import { Customers } from "@/lib/generated/prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { CustomerActionsButton } from "./customer-actions-button"

interface CustomerCardProps {
  customer: Customers
  onEdit: (customer: Customers) => void
  onArchive: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onUnarchive: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, customerId: string) => void
  archivingCustomerId: string | null
  unarchivingCustomerId: string | null
  deletingCustomerId: string | null
}

export function CustomerCard({
  customer,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  archivingCustomerId,
  unarchivingCustomerId,
  deletingCustomerId,
}: CustomerCardProps) {
  const customerSince = format(customer.createdAt, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-lg font-medium">{customer.name}</h2>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <p className="text-xs text-muted-foreground">desde {customerSince}</p>
        </div>
        <CustomerActionsButton
          customer={customer}
          onEdit={onEdit}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onDelete={onDelete}
          archivingCustomerId={archivingCustomerId}
          unarchivingCustomerId={unarchivingCustomerId}
          deletingCustomerId={deletingCustomerId}
        />
      </CardFooter>
    </Card>
  )
}
