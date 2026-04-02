import { Badge } from "@/components/ui/badge"
import {
  getChargeStatusBadgeVariant,
  getChargeStatusLabel,
} from "@/lib/billing/status"

export function ChargeStatusBadge({
  status,
}: {
  status: string | null | undefined
}) {
  return (
    <Badge variant={getChargeStatusBadgeVariant(status)}>
      {getChargeStatusLabel(status)}
    </Badge>
  )
}
