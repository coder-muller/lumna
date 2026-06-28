"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { DashboardStats } from "@/server/dashboard/get-dashboard"
import {
  CheckCircle2Icon,
  ClockIcon,
  FileTextIcon,
  WalletIcon,
} from "lucide-react"

const statItems = [
  {
    key: "receivedThisMonth",
    label: "Recebido no mês",
    icon: WalletIcon,
    format: "currency" as const,
  },
  {
    key: "openAmount",
    label: "Em aberto",
    icon: ClockIcon,
    format: "currency" as const,
  },
  {
    key: "paidTotal",
    label: "Pagas",
    icon: CheckCircle2Icon,
    format: "currency" as const,
  },
  {
    key: "totalCount",
    label: "Total de cobranças",
    icon: FileTextIcon,
    format: "count" as const,
  },
] as const

interface StatCardsProps {
  stats: DashboardStats
  isFetching: boolean
}

export function StatCards({ stats, isFetching }: StatCardsProps) {
  return (
    <section
      aria-label="Resumo"
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        isFetching && "animate-pulse"
      )}
    >
      {statItems.map((item, index) => {
        const Icon = item.icon
        const value = stats[item.key]

        return (
          <Card
            key={item.key}
            className="animate-fade-in-up border-border/60 opacity-0 fill-mode-[forwards]"
            style={{ animationDelay: `${150 + index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription>{item.label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {item.format === "currency"
                  ? formatCurrency(value)
                  : value.toLocaleString("pt-BR")}
              </CardTitle>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
