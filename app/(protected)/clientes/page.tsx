import { Users } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { requireUserId } from "@/lib/auth/functions"
import { formatCurrency } from "@/lib/billing/format"
import { getClientsData } from "@/lib/billing/data"
import { createClientAction } from "@/lib/billing/actions"

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Organize seus recebedores e acompanhe o historico financeiro por
            cliente.
          </p>
        </div>

        <form>
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Buscar por nome ou email"
          />
        </form>

        {clients.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {clients.map((client) => {
              const totalReceived = client.charges.reduce(
                (sum, charge) => sum + Number(charge.paidAmount ?? 0),
                0
              )

              return (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle>{client.name}</CardTitle>
                    <CardDescription>{client.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{client.phone || "Sem telefone informado"}</p>
                    <p>{client.charges.length} cobrancas registradas</p>
                    <p>Total recebido: {formatCurrency(totalReceived)}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Nenhum cliente cadastrado</EmptyTitle>
              <EmptyDescription>
                Cadastre um cliente para agilizar a criacao das proximas
                cobrancas.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Novo cliente</CardTitle>
          <CardDescription>
            Cadastro rapido para uso nas cobrancas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createClientAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome</label>
              <Input name="name" placeholder="Nome do cliente" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="cliente@empresa.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Telefone</label>
              <Input name="phone" placeholder="(11) 99999-0000" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Observacoes
              </label>
              <Textarea
                name="notes"
                rows={4}
                placeholder="Notas internas sobre o cliente"
              />
            </div>
            <Button type="submit" className="w-full">
              Criar cliente
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
