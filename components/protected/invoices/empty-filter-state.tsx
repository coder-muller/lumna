"use client"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FileXIcon } from "lucide-react"

interface InvoicesEmptyFilterStateProps {
  label: string
}

export function InvoicesEmptyFilterState({
  label,
}: InvoicesEmptyFilterStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileXIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhuma cobrança {label.toLowerCase()}</EmptyTitle>
        <EmptyDescription>
          Não existem cobranças nesse status para exibir.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
