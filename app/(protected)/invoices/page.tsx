import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"

type InvoiceStatus = "paid" | "pending" | "overdue"

interface Invoice {
  id: string
  client: string
  email: string
  desc: string
  amount: string
  due: string
  status: InvoiceStatus
}

const recentInvoices: Invoice[] = [
  {
    id: "1",
    client: "Fintech Solutions",
    email: "contato@fintechsolutions.com",
    desc: "Consultoria Mensal",
    amount: "R$ 3.520,75",
    due: "20/04/2026",
    status: "paid",
  },
  {
    id: "2",
    client: "João Silva",
    email: "joao@silva.com",
    desc: "Desenvolvimento Web",
    amount: "R$ 2.845,40",
    due: "25/04/2026",
    status: "pending",
  },
  {
    id: "3",
    client: "Tech Corp",
    email: "finance@tech.com",
    desc: "Suporte Técnico",
    amount: "R$ 1.275,90",
    due: "18/04/2026",
    status: "overdue",
  },
  {
    id: "4",
    client: "Maria Souza",
    email: "maria@souza.com",
    desc: "Design UI/UX",
    amount: "R$ 4.912,20",
    due: "30/04/2026",
    status: "paid",
  },
  {
    id: "5",
    client: "StartupXYZ",
    email: "ceo@startupxyz.com",
    desc: "Mentoria de Produto",
    amount: "R$ 1.982,35",
    due: "10/04/2026",
    status: "pending",
  },
  {
    id: "6",
    client: "EcoTrade Brasil",
    email: "finance@ecotrade.com.br",
    desc: "Relatório de Sustentabilidade",
    amount: "R$ 3.450,00",
    due: "22/04/2026",
    status: "paid",
  },
  {
    id: "7",
    client: "AgroSoft",
    email: "contato@agrosoft.com",
    desc: "Implementação de ERP",
    amount: "R$ 5.790,20",
    due: "28/04/2026",
    status: "pending",
  },
  {
    id: "8",
    client: "Clínica Bem Estar",
    email: "admin@clinicabemestar.com",
    desc: "Campanha de Marketing",
    amount: "R$ 2.150,00",
    due: "12/04/2026",
    status: "overdue",
  },
  {
    id: "9",
    client: "EducaMais",
    email: "pedro@educamais.com",
    desc: "Treinamento de Equipe",
    amount: "R$ 1.340,50",
    due: "27/04/2026",
    status: "paid",
  },
  {
    id: "10",
    client: "MoviLog",
    email: "logistica@movilog.com",
    desc: "Otimização de Rotas",
    amount: "R$ 4.210,75",
    due: "29/04/2026",
    status: "pending",
  },
]

const tabs: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "paid", label: "Pagas" },
  { value: "overdue", label: "Vencidas" },
]

function StatusBadge({ status }: { status: InvoiceStatus }) {
  if (status === "paid") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
      >
        Pago
      </Badge>
    )
  }

  if (status === "pending") {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
      >
        Pendente
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-destructive/30 bg-destructive/10 text-destructive"
    >
      Vencido
    </Badge>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment[0])
    .join("")
    .toUpperCase()
}

function InvoicesTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="px-4 pt-2 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Vencimento</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-25 text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-32 rounded" />
                      <Skeleton className="h-3 w-40 rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-36 rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3.5 w-24 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-3.5 w-20 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function InvoicesTableError() {
  return (
    <div className="rounded-xl border border-destructive/20 bg-card p-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon size={24} className="text-destructive" />
      </div>
      <p className="mt-4 font-medium text-foreground">
        Erro ao carregar cobranças
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Não foi possível conectar ao servidor. Verifique sua conexão e tente
        novamente.
      </p>
      <Button variant="outline" className="mt-5">
        <RefreshCwIcon size={14} /> Tentar novamente
      </Button>
    </div>
  )
}

function InvoicesTableEmpty() {
  return (
    <div className="rounded-xl border border-border bg-card p-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <FileTextIcon size={24} className="text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium text-foreground">Nenhuma cobrança ainda</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Crie sua primeira cobrança para começar a gerenciar seus recebimentos.
      </p>
      <Button className="mt-5">
        <PlusIcon size={16} /> Criar primeira cobrança
      </Button>
    </div>
  )
}

function InvoicesTableNoResults({ query }: { query: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <SearchIcon size={24} className="text-muted-foreground" />
      </div>
      <p className="mt-4 font-medium text-foreground">
        Nenhum resultado encontrado
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Nenhuma cobrança corresponde a &quot;
        <span className="font-medium text-foreground">{query}</span>&quot;.
        Tente outro termo.
      </p>
      <Button variant="outline" className="mt-5">
        Limpar busca
      </Button>
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Cobranças</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas cobranças aqui.
        </p>
      </div>
      <section className="flex w-full items-center justify-between gap-2">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar cobranças..." />
        </InputGroup>
        <Button variant="default">
          <PlusIcon />
          <span className="hidden md:block">Nova Cobrança</span>
          <span className="md:hidden">Nova</span>
        </Button>
      </section>

      <Tabs defaultValue="all">
        <ScrollArea className="max-w-full overflow-x-auto overflow-y-hidden">
          <TabsList className="rounded-none border-b bg-background p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="mx-2 h-full rounded-none border-0 border-b-2 border-transparent bg-background data-[state=active]:border-primary data-[state=active]:shadow-none! dark:data-[state=active]:border-primary"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>

      {/* Loading state */}
      <InvoicesTableSkeleton />

      {/* Error state */}
      <InvoicesTableError />

      {/* Empty state — no invoices yet */}
      <InvoicesTableEmpty />

      {/* Empty state — search with no results */}
      <InvoicesTableNoResults query="search value" />

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="px-4 pt-2 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-center">Vencimento</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-25 text-center" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="text-xs">
                          {getInitials(inv.client)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {inv.client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {inv.desc}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                    {inv.amount}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {inv.due}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={inv.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <InfoIcon />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PencilIcon />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <TrashIcon />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">1-14</span> de{" "}
          <span className="font-medium text-foreground">134</span> cobranças
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm">
            <ChevronLeftIcon /> Anterior
          </Button>
          {Array.from({ length: 3 }).map((_, i) => (
            <Button
              key={i}
              variant={i === 0 ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-8 px-3">
            Próxima <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
