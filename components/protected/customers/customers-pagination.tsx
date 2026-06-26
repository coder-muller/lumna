"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface CustomersPaginationProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export function CustomersPagination({
  page,
  limit,
  total,
  onPageChange,
  hasPreviousPage,
  hasNextPage,
}: CustomersPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        mostrando{" "}
        <span className="font-medium text-foreground">
          {(page - 1) * limit + 1}-{Math.min(page * limit, total || 0)}
        </span>{" "}
        de <span className="font-medium text-foreground">{total}</span> clientes
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
