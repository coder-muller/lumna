"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MonthlyData = {
  month: string
  emitido: number
  recebido: number
}

const chartConfig = {
  emitido: {
    label: "Emitido",
    color: "var(--color-chart-1)",
  },
  recebido: {
    label: "Recebido",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

export function DashboardChart({ data }: { data: MonthlyData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobranças dos últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart data={data} barGap={4}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const num =
                      typeof value === "number" ? value : Number(value)
                    return `R$ ${num.toLocaleString("pt-BR")}`
                  }}
                />
              }
            />
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
      </CardContent>
    </Card>
  )
}
