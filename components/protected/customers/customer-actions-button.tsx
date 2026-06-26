"use client"

import { Customers } from "@/lib/generated/prisma/client"
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
  ArchiveXIcon,
  ArchiveIcon,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomerActionsButtonProps {
  customer: Customers
  onEdit: (customer: Customers) => void
  onArchive: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onUnarchive: (e: React.MouseEvent<HTMLDivElement>, customerId: string) => void
  onDelete: (e: React.MouseEvent<HTMLButtonElement>, customerId: string) => void
  archivingCustomerId: string | null
  unarchivingCustomerId: string | null
  deletingCustomerId: string | null
}

export function CustomerActionsButton({
  customer,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  archivingCustomerId,
  unarchivingCustomerId,
  deletingCustomerId,
}: CustomerActionsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(customer)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          {customer.status === "ARCHIVED" ? (
            <DropdownMenuItem
              disabled={unarchivingCustomerId === customer.id}
              onClick={(e) => onUnarchive(e, customer.id)}
            >
              {unarchivingCustomerId === customer.id ? (
                <Spinner />
              ) : (
                <ArchiveXIcon />
              )}
              {unarchivingCustomerId === customer.id
                ? "Desarquivando..."
                : "Desarquivar"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={archivingCustomerId === customer.id}
              onClick={(e) => onArchive(e, customer.id)}
            >
              {archivingCustomerId === customer.id ? (
                <Spinner />
              ) : (
                <ArchiveIcon />
              )}
              {archivingCustomerId === customer.id
                ? "Arquivando..."
                : "Arquivar"}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              disabled={deletingCustomerId === customer.id}
              onSelect={(e) => e.preventDefault()}
            >
              {deletingCustomerId === customer.id ? <Spinner /> : <TrashIcon />}
              {deletingCustomerId === customer.id ? "Deletando..." : "Deletar"}
            </DropdownMenuItem>
          </AlertDialogTrigger>
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
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deletingCustomerId === customer.id}
                onClick={(e) => onDelete(e, customer.id)}
              >
                {deletingCustomerId === customer.id ? (
                  <Spinner />
                ) : (
                  <TrashIcon />
                )}
                {deletingCustomerId === customer.id
                  ? "Deletando..."
                  : "Sim, deletar!"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
