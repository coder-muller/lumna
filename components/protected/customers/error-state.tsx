"use client"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RefreshCcwIcon } from "lucide-react"

interface CustomersErrorStateProps {
  onRetry: () => void
}

export function CustomersErrorState({ onRetry }: CustomersErrorStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangleIcon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>Ocorreu um erro ao carregar os clientes</EmptyTitle>
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
