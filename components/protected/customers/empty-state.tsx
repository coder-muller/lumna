"use client"

import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { UsersIcon, PlusIcon } from "lucide-react"

interface CustomersEmptyStateProps {
  onCreate: () => void
}

export function CustomersEmptyState({ onCreate }: CustomersEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
        <EmptyDescription>
          Crie um novo cliente para começar a gerenciar seus clientes
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default" onClick={onCreate}>
          <PlusIcon />
          <span className="hidden md:block">Novo cliente</span>
          <span className="md:hidden">Cliente</span>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
