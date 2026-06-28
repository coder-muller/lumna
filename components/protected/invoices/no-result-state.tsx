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
import { SearchIcon, SearchXIcon } from "lucide-react"

interface InvoicesNoResultStateProps {
  search: string
  onClearSearch: () => void
}

export function InvoicesNoResultState({
  search,
  onClearSearch,
}: InvoicesNoResultStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhuma cobrança encontrada</EmptyTitle>
        <EmptyDescription>
          Nenhuma cobrança encontrada para a busca{" "}
          <span className="font-medium text-foreground">
            &quot;{search}&quot;
          </span>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="default" onClick={onClearSearch}>
          <SearchXIcon />
          <span className="hidden md:block">Limpar busca</span>
          <span className="md:hidden">Limpar</span>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
