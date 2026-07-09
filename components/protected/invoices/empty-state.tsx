"use client"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { FileTextIcon, PlusIcon } from "lucide-react"

interface InvoicesEmptyStateProps {
  onCreate: () => void
}

export function InvoicesEmptyState({ onCreate }: InvoicesEmptyStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhuma cobrança encontrada</EmptyTitle>
        <EmptyDescription>
          Crie uma nova cobrança para começar a receber pagamentos
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default" onClick={onCreate}>
          <PlusIcon />
          <span className="hidden md:block">Nova cobrança</span>
          <span className="md:hidden">Cobrança</span>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
