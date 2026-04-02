import Link from "next/link"
import {
  CheckCircle2,
  ExternalLink,
  RefreshCcw,
  Search,
  TriangleAlert,
} from "lucide-react"
import { ChargeStatusBadge } from "@/components/protected/charge-status-badge"
import { CopyLinkButton } from "@/components/protected/copy-link-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireUserId } from "@/lib/auth/functions"
import { formatCurrency, formatDate } from "@/lib/billing/format"
import { chargeStatuses } from "@/lib/billing/status"
import { getChargesData } from "@/lib/billing/data"
import { syncChargeAction } from "@/lib/billing/actions"

type ChargesPageProps = {
  searchParams: Promise<{
    q?: string
    status?: string
    checkout?: string
  }>
}

export default async function ChargesPage({ searchParams }: ChargesPageProps) {
  const userId = await requireUserId()
  const filters = await searchParams
  const { connection, charges } = await getChargesData(userId, {
    query: filters.q,
    status: filters.status,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cobrancas</h1>
          <p className="text-sm text-muted-foreground">
            Gere links de pagamento e acompanhe o retorno financeiro em um so
            lugar.
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

      {filters.checkout === "success" ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Pagamento enviado para processamento</AlertTitle>
          <AlertDescription>
            O Checkout Pro foi concluido e a cobranca sera atualizada assim que
            o Mercado Pago confirmar o pagamento.
          </AlertDescription>
        </Alert>
      ) : null}

      {filters.checkout === "pending" || filters.checkout === "failure" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {filters.checkout === "pending"
              ? "Pagamento ainda pendente"
              : "O pagamento nao foi concluido"}
          </AlertTitle>
          <AlertDescription>
            {filters.checkout === "pending"
              ? "A cobranca continua aberta e o status sera atualizado quando o Mercado Pago concluir a analise."
              : "Seu cliente pode abrir o link novamente para tentar pagar ou voce pode sincronizar manualmente a cobranca."}
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.q}
                placeholder="Buscar por cliente ou descricao"
                className="pl-8"
              />
            </div>
            <NativeSelect
              name="status"
              defaultValue={filters.status ?? "ALL"}
              className="w-full"
            >
              <NativeSelectOption value="ALL">
                Todos os status
              </NativeSelectOption>
              {chargeStatuses.map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {status}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <Button type="submit" variant="outline">
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de cobrancas</CardTitle>
        </CardHeader>
        <CardContent>
          {charges.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descricao</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Liquido</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((charge) => {
                  const payment = charge.payments[0]
                  const checkoutUrl =
                    charge.checkoutUrl ?? charge.sandboxCheckoutUrl

                  return (
                    <TableRow key={charge.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{charge.client.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {charge.client.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{charge.title}</p>
                          <p className="max-w-xs truncate text-xs text-muted-foreground">
                            {charge.description || "Sem descricao"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(charge.amount.toString())}
                      </TableCell>
                      <TableCell>{formatDate(charge.expiresAt)}</TableCell>
                      <TableCell>
                        <ChargeStatusBadge status={charge.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-xs leading-5">
                          <p>{formatCurrency(charge.paidAmount?.toString())}</p>
                          <p className="text-muted-foreground">
                            {payment?.paymentMethodId || payment?.status || "-"}
                          </p>
                          <p className="text-muted-foreground">
                            {charge.paidAt ? formatDate(charge.paidAt) : "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs leading-5">
                          <p>{formatCurrency(charge.netAmount?.toString())}</p>
                          <p className="text-muted-foreground">
                            Taxa:{" "}
                            {formatCurrency(
                              charge.gatewayFeeAmount?.toString()
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {checkoutUrl ? (
                            <CopyLinkButton url={checkoutUrl} />
                          ) : null}
                          {checkoutUrl ? (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={checkoutUrl} target="_blank">
                                <ExternalLink />
                                Abrir
                              </Link>
                            </Button>
                          ) : null}
                          <form action={syncChargeAction}>
                            <input
                              type="hidden"
                              name="chargeId"
                              value={charge.id}
                            />
                            <Button type="submit" variant="ghost" size="sm">
                              <RefreshCcw />
                              Sincronizar
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search className="size-4" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma cobranca encontrada</EmptyTitle>
                <EmptyDescription>
                  Ajuste os filtros ou gere um novo link de pagamento para
                  comecar.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
