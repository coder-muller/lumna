"use client"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SearchIcon, SearchXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomersNoResultStateProps {
  search: string
  onClearSearch: () => void
}

export function CustomersNoResultState({
  search,
  onClearSearch,
}: CustomersNoResultStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
        <EmptyDescription>
          Nenhum cliente encontrado para a busca{" "}
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
