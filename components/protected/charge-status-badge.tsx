import { cn } from "@/lib/utils"
import {
  getChargeStatusLabel,
  type ChargeStatusValue,
} from "@/lib/billing/status"

const statusStyles: Record<string, string> = {
  PAID: "bg-success-light text-success-text",
  OPEN: "bg-info-light text-info-text",
  PENDING: "bg-warning-light text-warning-text",
  DRAFT: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-warning-light text-warning-text",
  FAILED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-info-light text-info-text",
}

export function ChargeStatusBadge({
  status,
  className,
}: {
  status: string | null | undefined
  className?: string
}) {
  const style = status ? statusStyles[status] : "bg-muted text-muted-foreground"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {getChargeStatusLabel(status)}
    </span>
  )
}
