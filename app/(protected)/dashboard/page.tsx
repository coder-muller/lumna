import Link from "next/link"
import { ArrowRight, CreditCard, Plus, Receipt, TrendingUp } from "lucide-react"
import { ChargeStatusBadge } from "@/components/protected/charge-status-badge"
import { DashboardChart } from "@/components/protected/dashboard-chart"
import { UserAvatar } from "@/components/protected/user-avatar"
import { WelcomeBanner } from "@/components/protected/welcome-banner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { requireSession } from "@/lib/auth/functions"
import { formatCurrency, formatDate } from "@/lib/billing/format"
import { getDashboardData } from "@/lib/billing/data"

function getMonthLabel(date: Date) {
  return date.toLocaleString("pt-BR", { month: "short" }).replace(".", "")
}

export default async function DashboardPage() {
  const session = await requireSession()
  const { connection, stats, recentCharges } = await getDashboardData(
    session.user.id
  )
  const isConnected = connection?.status === "CONNECTED"
  const firstName = session.user.name.split(" ")[0]

  // Calculate "em aberto" (open amount = billed - received)
  const openAmount = stats.totalBilled - stats.totalReceived
  const openCharges = stats.totalCharges - stats.paidCharges

  // Build simple chart data from recent 6 months (placeholder since we don't have monthly data yet)
  const now = new Date()
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      month: getMonthLabel(d),
      emitido: 0,
      recebido: 0,
    }
  })

  // Populate current month with real totals
  if (chartData.length > 0) {
    chartData[chartData.length - 1].emitido = stats.totalBilled
    chartData[chartData.length - 1].recebido = stats.totalReceived
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance">
            Dashboard
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Olá, {firstName}! Aqui está o resumo das suas cobranças.
          </p>
        </div>
        <Button asChild>
          <Link
            href={
              isConnected
                ? "/cobrancas/nova"
                : "/configuracoes?tab=mercado-pago"
            }
          >
            <Plus data-icon="inline-start" />
            Nova cobrança
          </Link>
        </Button>
      </div>

      {/* Welcome Banner — shown when MP is connected and no charges exist */}
      {isConnected && stats.totalCharges === 0 && <WelcomeBanner />}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Faturado */}
        <Card>
          <CardHeader>
            <CardDescription className="text-xs tracking-wide uppercase">
              Total faturado
            </CardDescription>
            <CardTitle className="font-mono-value text-2xl">
              {formatCurrency(stats.totalBilled)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Receipt className="size-3.5" />
              <span>{stats.totalCharges} cobranças emitidas</span>
            </div>
          </CardContent>
        </Card>

        {/* Recebido */}
        <Card>
          <CardHeader>
            <CardDescription className="text-xs tracking-wide uppercase">
              Total recebido
            </CardDescription>
            <CardTitle className="font-mono-value text-2xl text-success">
              {formatCurrency(stats.totalReceived)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="size-3.5" />
              <span>{stats.paidCharges} cobranças pagas</span>
              {stats.totalReceived > 0 && (
                <span className="flex items-center gap-0.5 rounded-full bg-success-light px-1.5 py-0.5 text-[10px] font-medium text-success-text">
                  <TrendingUp className="size-2.5" />
                  {stats.totalBilled > 0
                    ? Math.round(
                        (stats.totalReceived / stats.totalBilled) * 100
                      )
                    : 0}
                  %
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Em aberto */}
        <Card>
          <CardHeader>
            <CardDescription className="text-xs tracking-wide uppercase">
              Em aberto
            </CardDescription>
            <CardTitle className="font-mono-value text-2xl text-warning">
              {formatCurrency(openAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Receipt className="size-3.5" />
              <span>
                {openCharges} cobrança{openCharges !== 1 ? "s" : ""} pendente
                {openCharges !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <DashboardChart data={chartData} />

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Cobranças recentes</CardTitle>
          <CardDescription>
            Últimos links gerados e atualizados via webhook.
          </CardDescription>
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href="/cobrancas">
                Ver todas
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {recentCharges.length > 0 ? (
            <div className="flex flex-col">
              {recentCharges.map((charge, idx) => (
                <div key={charge.id}>
                  {idx > 0 && <Separator />}
                  <Link
                    href="/cobrancas"
                    className="flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-muted/50"
                  >
                    {/* Avatar + client info */}
                    <UserAvatar name={charge.client.name} size="sm" />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {charge.client.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {charge.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono-value text-sm font-semibold tabular-nums">
                          {formatCurrency(charge.amount.toString())}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:inline">
                          {formatDate(charge.paidAt ?? charge.updatedAt)}
                        </span>
                        <ChargeStatusBadge status={charge.status} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt />
                </EmptyMedia>
                <EmptyTitle>Nenhuma cobrança criada</EmptyTitle>
                <EmptyDescription>
                  Crie sua primeira cobrança para acompanhar pagamentos por
                  Checkout Pro.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
