import Link from "next/link"
import { Receipt, Search, Users } from "lucide-react"
import { NewClientDialog } from "@/components/protected/new-client-dialog"
import { UserAvatar } from "@/components/protected/user-avatar"
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { requireUserId } from "@/lib/auth/functions"
import { formatCurrency } from "@/lib/billing/format"
import { getClientsData } from "@/lib/billing/data"

type ClientsPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const userId = await requireUserId()
  const filters = await searchParams
  const { clients } = await getClientsData(userId, { query: filters.q })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-balance">
            Clientes
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Todos os seus clientes cadastrados.
          </p>
        </div>
        <NewClientDialog />
      </div>

      {/* Search */}
      <form>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Buscar por nome ou email..."
            className="pl-9"
          />
        </div>
      </form>

      {/* Content */}
      {clients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const totalReceived = client.charges.reduce(
              (sum, charge) => sum + Number(charge.paidAmount ?? 0),
              0
            )

            return (
              <Card key={client.id} className="group">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <UserAvatar name={client.name} size="md" />
                  </div>
                  <div className="mt-3">
                    <p className="truncate text-sm font-semibold">
                      {client.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono-value tabular-nums">
                        {client.charges.length}
                      </span>{" "}
                      cobrança{client.charges.length !== 1 ? "s" : ""}{" "}
                      <span className="mx-1 text-border">|</span>{" "}
                      <span className="font-mono-value tabular-nums">
                        {formatCurrency(totalReceived)}
                      </span>{" "}
                      recebido
                    </p>
                    <Link
                      href="/cobrancas/nova"
                      className="mt-1 inline-block text-xs font-medium text-lumna hover:underline"
                    >
                      Nova cobrança
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : filters.q ? (
        /* No results state */
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>
                <EmptyDescription>
                  Nenhum cliente corresponde a &quot;{filters.q}&quot;. Tente
                  outro termo.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        /* Empty state */
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>Nenhum cliente ainda</EmptyTitle>
                <EmptyDescription>
                  Adicione seu primeiro cliente para começar a enviar cobranças.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
