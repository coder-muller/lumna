"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface InvoicesPaginationProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export function InvoicesPagination({
  page,
  limit,
  total,
  onPageChange,
  hasPreviousPage,
  hasNextPage,
}: InvoicesPaginationProps) {
  const start = total > 0 ? (page - 1) * limit + 1 : 0
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        mostrando{" "}
        <span className="font-medium text-foreground">
          {start}-{end}
        </span>{" "}
        de <span className="font-medium text-foreground">{total}</span>{" "}
        cobranças
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
