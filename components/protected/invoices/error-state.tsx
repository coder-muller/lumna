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
import { AlertTriangleIcon, RefreshCcwIcon } from "lucide-react"

interface InvoicesErrorStateProps {
  onRetry: () => void
}

export function InvoicesErrorState({ onRetry }: InvoicesErrorStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Ocorreu um erro ao carregar as cobranças</EmptyTitle>
        <EmptyDescription>
          Tente recarregar a página ou contate o suporte
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcwIcon />
          Recarregar
        </Button>
      </EmptyContent>
    </Empty>
  )
}
