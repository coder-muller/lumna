"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { RevenueMonth } from "@/server/dashboard/get-dashboard"

const chartConfig = {
  grossAmount: {
    label: "Receita bruta",
    color: "var(--chart-1)",
  },
  netAmount: {
    label: "Receita líquida",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface RevenueChartProps {
  data: RevenueMonth[]
  isFetching: boolean
}

export function RevenueChart({ data, isFetching }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    month: item.label,
    grossAmount: item.grossAmount,
    netAmount: item.netAmount,
  }))

  return (
    <section aria-label="Receita">
      <Card
        className={cn(
          "animate-fade-in-up border-border/60 opacity-0 fill-mode-[forwards] [animation-delay:300ms]",
          isFetching && "animate-pulse"
        )}
      >
        <CardHeader>
          <CardTitle className="text-base">Evolução da receita</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={72}
                tickFormatter={(value: number) =>
                  value > 99900
                    ? `R$ ${(value / 100000).toFixed(0)}K`
                    : `R$ ${(value / 100).toFixed(0)}`
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                }
              />
              <Area
                dataKey="grossAmount"
                type="monotone"
                fill="var(--color-grossAmount)"
                fillOpacity={0.16}
                stroke="var(--color-grossAmount)"
                strokeWidth={2}
              />
              <Area
                dataKey="netAmount"
                type="monotone"
                fill="var(--color-netAmount)"
                fillOpacity={0.12}
                stroke="var(--color-netAmount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}
