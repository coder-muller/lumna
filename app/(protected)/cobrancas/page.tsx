import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Receipt,
  RefreshCcw,
  Search,
  TriangleAlert,
} from "lucide-react"
import { ChargeStatusBadge } from "@/components/protected/charge-status-badge"
import { CopyLinkButton } from "@/components/protected/copy-link-button"
import { UserAvatar } from "@/components/protected/user-avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireUserId } from "@/lib/auth/functions"
import {
  buildChargeSearch,
  parseChargeSearchParams,
  type ChargeCheckoutValue,
  type RawChargeSearchParams,
} from "@/lib/billing/charge-search-params"
import { resolveChargeCheckoutUrl } from "@/lib/billing/checkout"
import { getChargesData } from "@/lib/billing/data"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/billing/format"
import { chargeStatuses, getChargeStatusLabel } from "@/lib/billing/status"
import { syncChargeAction } from "@/lib/billing/actions"
import { cn } from "@/lib/utils"

type ChargesPageProps = {
  searchParams: Promise<RawChargeSearchParams>
}

const statusTabs = [
  { label: "Todas", value: "ALL" },
  ...chargeStatuses.map((s) => ({
    label: getChargeStatusLabel(s),
    value: s,
  })),
] as const

function buildChargesHref(filters: {
  query?: string
  chargeStatus?: (typeof statusTabs)[number]["value"]
  checkout?: ChargeCheckoutValue
}) {
  const search = buildChargeSearch(filters)

  return search ? `/cobrancas?${search}` : "/cobrancas"
}

function getChargeReturnSummary(charge: {
  status: string
  lastCheckoutReturnStatus: string | null
  lastCheckoutReturnAt: Date | null
}) {
  if (
    !["OPEN", "PENDING", "FAILED"].includes(charge.status) ||
    !charge.lastCheckoutReturnStatus ||
    !charge.lastCheckoutReturnAt
  ) {
    return null
  }

  const label =
    charge.lastCheckoutReturnStatus === "SUCCESS"
      ? "Último retorno: sucesso"
      : charge.lastCheckoutReturnStatus === "PENDING"
        ? "Último retorno: pendente"
        : "Último retorno: falha"

  return `${label} em ${formatDateTime(charge.lastCheckoutReturnAt)}`
}

export default async function ChargesPage({ searchParams }: ChargesPageProps) {
  const userId = await requireUserId()
  const parsedSearchParams = parseChargeSearchParams(await searchParams)

  if (parsedSearchParams.shouldRedirectToCanonicalUrl) {
    redirect(buildChargesHref(parsedSearchParams))
  }

  const activeStatus = parsedSearchParams.chargeStatus ?? "ALL"
  const { connection, charges } = await getChargesData(userId, {
    query: parsedSearchParams.query,
    status: parsedSearchParams.chargeStatus,
  })
  const isConnected = connection?.status === "CONNECTED"

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance">
            Cobranças
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Gerencie todas as suas cobranças e acompanhe pagamentos.
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

      {/* Checkout feedback alerts */}
      {parsedSearchParams.checkout === "success" && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Pagamento enviado para processamento</AlertTitle>
          <AlertDescription>
            O Checkout Pro foi concluído e a cobrança será atualizada assim que
            o Mercado Pago confirmar o pagamento.
          </AlertDescription>
        </Alert>
      )}

      {(parsedSearchParams.checkout === "pending" ||
        parsedSearchParams.checkout === "failure") && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {parsedSearchParams.checkout === "pending"
              ? "Pagamento ainda pendente"
              : "O pagamento não foi concluído"}
          </AlertTitle>
          <AlertDescription>
            {parsedSearchParams.checkout === "pending"
              ? "A cobrança continua aberta e o status será atualizado quando o Mercado Pago concluir a análise."
              : "Seu cliente pode abrir o link novamente para tentar pagar ou você pode sincronizar manualmente a cobrança."}
          </AlertDescription>
        </Alert>
      )}

      {/* Search + Status Tabs */}
      <div className="flex flex-col gap-4">
        {/* Search bar */}
        <form className="flex gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={parsedSearchParams.query}
              placeholder="Buscar por cliente ou descrição..."
              className="pl-9"
            />
          </div>
          {parsedSearchParams.chargeStatus &&
            parsedSearchParams.chargeStatus !== "ALL" && (
              <input
                type="hidden"
                name="chargeStatus"
                value={parsedSearchParams.chargeStatus}
              />
            )}
          {parsedSearchParams.checkout && (
            <input
              type="hidden"
              name="checkout"
              value={parsedSearchParams.checkout}
            />
          )}
          <Button type="submit" variant="outline">
            Filtrar
          </Button>
        </form>

        {/* Status tabs as links */}
        <div className="flex gap-4 overflow-x-auto border-b border-border sm:gap-6">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.value
            const href = buildChargesHref({
              query: parsedSearchParams.query,
              chargeStatus: tab.value,
              checkout: parsedSearchParams.checkout,
            })

            return (
              <Link
                key={tab.value}
                href={href}
                className={cn(
                  "shrink-0 border-b-2 pb-2 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "border-lumna font-medium text-lumna"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {charges.length > 0 ? (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Líquido</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charges.map((charge) => {
                    const payment = charge.payments[0]
                    const checkoutUrl = resolveChargeCheckoutUrl(charge)
                    const returnSummary = getChargeReturnSummary(charge)

                    return (
                      <TableRow key={charge.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={charge.client.name} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {charge.client.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {charge.client.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[180px] min-w-0">
                            <p className="truncate text-sm font-medium">
                              {charge.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {charge.description || "Sem descrição"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono-value font-semibold tabular-nums">
                            {formatCurrency(charge.amount.toString())}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(charge.expiresAt)}
                        </TableCell>
                        <TableCell>
                          <ChargeStatusBadge status={charge.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="font-mono-value tabular-nums">
                              {formatCurrency(charge.paidAmount?.toString())}
                            </span>
                            <span className="text-muted-foreground">
                              {payment?.paymentMethodId ||
                                payment?.status ||
                                "-"}
                            </span>
                            <span className="text-muted-foreground">
                              {charge.paidAt ? formatDate(charge.paidAt) : "-"}
                            </span>
                            {returnSummary && (
                              <span className="text-muted-foreground">
                                {returnSummary}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="font-mono-value tabular-nums">
                              {formatCurrency(charge.netAmount?.toString())}
                            </span>
                            <span className="text-muted-foreground">
                              Taxa:{" "}
                              {formatCurrency(
                                charge.gatewayFeeAmount?.toString()
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            {checkoutUrl && (
                              <CopyLinkButton url={checkoutUrl} />
                            )}
                            {checkoutUrl && (
                              <Button asChild variant="ghost" size="sm">
                                <Link href={checkoutUrl} target="_blank">
                                  <ExternalLink data-icon="inline-start" />
                                  Abrir
                                </Link>
                              </Button>
                            )}
                            <form action={syncChargeAction}>
                              <input
                                type="hidden"
                                name="chargeId"
                                value={charge.id}
                              />
                              <Button type="submit" variant="ghost" size="sm">
                                <RefreshCcw data-icon="inline-start" />
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
            </CardContent>
          </Card>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {charges.map((charge) => {
              const checkoutUrl = resolveChargeCheckoutUrl(charge)
              const returnSummary = getChargeReturnSummary(charge)

              return (
                <Card key={charge.id} size="sm">
                  <CardContent>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <UserAvatar name={charge.client.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {charge.client.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {charge.title}
                          </p>
                        </div>
                      </div>
                      <ChargeStatusBadge status={charge.status} />
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono-value text-base font-semibold tabular-nums">
                        {formatCurrency(charge.amount.toString())}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(charge.expiresAt)}
                      </span>
                    </div>
                    {returnSummary && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {returnSummary}
                      </p>
                    )}
                    <div className="mt-3 flex gap-1">
                      {checkoutUrl && <CopyLinkButton url={checkoutUrl} />}
                      {checkoutUrl && (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={checkoutUrl} target="_blank">
                            <ExternalLink data-icon="inline-start" />
                            Abrir
                          </Link>
                        </Button>
                      )}
                      <form action={syncChargeAction}>
                        <input
                          type="hidden"
                          name="chargeId"
                          value={charge.id}
                        />
                        <Button type="submit" variant="ghost" size="sm">
                          <RefreshCcw data-icon="inline-start" />
                          Sync
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {charges.length} cobrança
              {charges.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft data-icon="inline-start" />
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Próxima
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt />
                </EmptyMedia>
                <EmptyTitle>
                  {parsedSearchParams.query ||
                  (parsedSearchParams.chargeStatus &&
                    parsedSearchParams.chargeStatus !== "ALL")
                    ? "Nenhuma cobrança encontrada"
                    : "Nenhuma cobrança criada"}
                </EmptyTitle>
                <EmptyDescription>
                  {parsedSearchParams.query ||
                  (parsedSearchParams.chargeStatus &&
                    parsedSearchParams.chargeStatus !== "ALL")
                    ? "Ajuste os filtros ou limpe a busca para ver todas as cobranças."
                    : "Crie sua primeira cobrança para começar a acompanhar pagamentos."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
