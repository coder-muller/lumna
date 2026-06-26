"use client"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArchiveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CircleIcon } from "lucide-react"

interface CustomersEmptyArchivedStateProps {
  onSetArchived: (archived: boolean) => void
}

export function CustomersEmptyArchivedState({
  onSetArchived,
}: CustomersEmptyArchivedStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum cliente arquivado encontrado</EmptyTitle>
        <EmptyDescription>Nenhum cliente arquivado encontrado</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default" onClick={() => onSetArchived(false)}>
          <CircleIcon />
          <span className="hidden md:block">Ver clientes ativos</span>
          <span className="md:hidden">Ver ativos</span>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
