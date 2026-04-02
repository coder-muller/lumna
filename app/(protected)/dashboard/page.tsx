import Link from "next/link"
import { ArrowRight, CreditCard, Receipt, Users } from "lucide-react"
import { ChargeStatusBadge } from "@/components/protected/charge-status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireUserId } from "@/lib/auth/functions"
import { formatCurrency, formatDateTime } from "@/lib/billing/format"
import { getDashboardData } from "@/lib/billing/data"

export default async function DashboardPage() {
  const userId = await requireUserId()
  const { connection, stats, recentCharges } = await getDashboardData(userId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumo rapido das cobrancas e da conexao com o Mercado Pago.
          </p>
        </div>
        <Button asChild>
          <Link
            href={
              connection?.status === "CONNECTED"
                ? "/cobrancas/nova"
                : "/configuracoes?tab=mercado-pago"
            }
          >
            Nova cobranca
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total faturado</CardDescription>
            <CardTitle>{formatCurrency(stats.totalBilled)}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-muted-foreground">
            <Receipt className="size-4" />
            <span>{stats.totalCharges} cobrancas</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total recebido</CardDescription>
            <CardTitle>{formatCurrency(stats.totalReceived)}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="size-4" />
            <span>{stats.paidCharges} cobrancas pagas</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Clientes</CardDescription>
            <CardTitle>{stats.totalClients}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            <span>Base ativa para cobrancas</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Marketplace</CardDescription>
            <CardTitle>
              {connection?.status === "CONNECTED" ? "Conectado" : "Pendente"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {connection?.liveMode ? "Ambiente live" : "Ambiente sandbox"}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Cobrancas recentes</CardTitle>
            <CardDescription>
              Ultimos links gerados e atualizados via webhook.
            </CardDescription>
          </div>
          <Button asChild variant="ghost">
            <Link href="/cobrancas">
              Ver todas
              <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentCharges.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descricao</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Atualizacao</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCharges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell className="font-medium">
                      {charge.client.name}
                    </TableCell>
                    <TableCell>{charge.title}</TableCell>
                    <TableCell>
                      {formatCurrency(charge.amount.toString())}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(charge.paidAt ?? charge.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <ChargeStatusBadge status={charge.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt className="size-4" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma cobranca criada</EmptyTitle>
                <EmptyDescription>
                  Crie sua primeira cobranca para acompanhar pagamentos por
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
