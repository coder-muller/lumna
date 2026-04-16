"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

type RevenuePoint = {
  month: string
  emitido: number
  recebido: number
}

const chartData: RevenuePoint[] = [
  { month: "2025-11", emitido: 8125.63, recebido: 6120.5 },
  { month: "2025-12", emitido: 10340.1, recebido: 9250.12 },
  { month: "2026-01", emitido: 8940.37, recebido: 7610.31 },
  { month: "2026-02", emitido: 11180.09, recebido: 8125.96 },
  { month: "2026-03", emitido: 12920.45, recebido: 9980.66 },
  { month: "2026-04", emitido: 12350.67, recebido: 8270 },
]

const chartConfig = {
  emitido: {
    label: "Emitido",
    color: "var(--chart-1)",
  },
  recebido: {
    label: "Recebido",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const MONTH_FULL_LABELS: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
}

const DATA_KEY_LABELS: Record<string, string> = {
  emitido: "Emitido",
  recebido: "Recebido",
}

function formatTooltipMonth(month: string): string {
  const [year, mm] = month.split("-")
  const monthLabel = MONTH_FULL_LABELS[mm] ?? mm
  return `${monthLabel}/${year}`
}

function formatChartMonth(month: string): string {
  const [, mm] = month.split("-")
  return MONTH_FULL_LABELS[mm] ?? month
}

function formatCurrency(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`
}

interface DashboardTooltipProps {
  active?: boolean
  payload?: Array<{
    value?: number
    color?: string
    dataKey?: string
    payload?: { month: string }
  }>
}

function DashboardChartTooltip({ active, payload }: DashboardTooltipProps) {
  if (!active || !payload?.length) return null

  const data = payload[0]?.payload
  if (!data) return null

  const monthLabel = formatTooltipMonth(data.month)

  return (
    <div className="min-w-50 rounded-xl border border-border/50 bg-popover px-4 py-3 text-popover-foreground shadow-xl">
      <p className="mb-2.5 border-b border-border/50 pb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {monthLabel}
      </p>
      <div className="space-y-1.5">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-foreground">
                {DATA_KEY_LABELS[item.dataKey ?? ""] ?? item.dataKey}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {formatCurrency(item.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RevenueChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <p className="font-semibold text-foreground">
          Cobranças dos últimos 6 meses
        </p>
        <p className="text-sm text-muted-foreground">
          Comparativo entre valores emitidos e recebidos
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-65 w-full md:h-80">
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatChartMonth(String(value))}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <ChartTooltip content={<DashboardChartTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="emitido"
            fill="var(--color-emitido)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="recebido"
            fill="var(--color-recebido)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
