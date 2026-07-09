"use client"

import { useState } from "react"

import type { Customer } from "@/lib/db/schema"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontalIcon,
  PencilIcon,
  RefreshCwIcon,
  TrashIcon,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomerActionsButtonProps {
  customer: Customer
  onEdit: (customer: Customer) => void
  onResync: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, customerId: string) => void
  resyncingCustomerId: string | null
  deletingCustomerId: string | null
}

export function CustomerActionsButton({
  customer,
  onEdit,
  onResync,
  onDelete,
  resyncingCustomerId,
  deletingCustomerId,
}: CustomerActionsButtonProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isDeleting = deletingCustomerId === customer.id
  const isResyncing = resyncingCustomerId === customer.id

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" variant="ghost" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <PencilIcon />
              Editar
            </DropdownMenuItem>
            {customer.syncStatus === "desynced" && (
              <DropdownMenuItem
                disabled={isResyncing}
                onClick={(e) => onResync(e, customer.id)}
              >
                {isResyncing ? <Spinner /> : <RefreshCwIcon />}
                {isResyncing ? "Ressincronizando..." : "Ressincronizar"}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setIsDeleteOpen(true)}
          >
            {isDeleting ? <Spinner /> : <TrashIcon />}
            {isDeleting ? "Deletando..." : "Deletar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o cliente{" "}
              <span className="font-medium text-foreground">
                {customer.name}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Alert variant="destructive">
            <AlertTitle className="text-lg font-medium">
              Essa ação é irreversível!
            </AlertTitle>
            <AlertDescription className="text-sm">
              Ao deletar o cliente, todos os dados relacionados a ele serão
              perdidos de forma irreversível e definitiva.
            </AlertDescription>
          </Alert>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                onDelete(e, customer.id)
                setIsDeleteOpen(false)
              }}
            >
              {isDeleting ? <Spinner /> : <TrashIcon />}
              {isDeleting ? "Deletando..." : "Sim, deletar!"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
