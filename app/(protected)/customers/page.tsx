import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  InfoIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
interface Client {
  id: string
  name: string
  email: string
  totalInvoices: number
  totalRevenue: number
}

export default function CustomersPage() {
  const clients: Client[] = [
    {
      id: "0",
      name: "Guilherme Müller",
      email: "guilhermemullerxx@gmail.com",
      totalInvoices: 23,
      totalRevenue: 11959.77,
    },
    {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@example.com",
      totalInvoices: 12,
      totalRevenue: 5200,
    },
    {
      id: "2",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@example.com",
      totalInvoices: 8,
      totalRevenue: 3400,
    },
    {
      id: "3",
      name: "Mariana Costa",
      email: "mariana.costa@example.com",
      totalInvoices: 15,
      totalRevenue: 7600,
    },
    {
      id: "4",
      name: "Bruno Santos",
      email: "bruno.santos@exemple.com",
      totalInvoices: 20,
      totalRevenue: 10250,
    },
    {
      id: "5",
      name: "Fernanda Lima",
      email: "fernanda.lima@example.com",
      totalInvoices: 5,
      totalRevenue: 2100,
    },
    {
      id: "6",
      name: "Rafael Alves",
      email: "rafael.alves@example.com",
      totalInvoices: 18,
      totalRevenue: 8800,
    },
    {
      id: "7",
      name: "Patrícia Rocha",
      email: "patricia.rocha@example.com",
      totalInvoices: 10,
      totalRevenue: 4500,
    },
    {
      id: "8",
      name: "Lucas Pereira",
      email: "lucas.pereira@example.com",
      totalInvoices: 14,
      totalRevenue: 6900,
    },
    {
      id: "9",
      name: "Juliana Fernandes",
      email: "juliana.fernandes@example.com",
      totalInvoices: 7,
      totalRevenue: 3200,
    },
    {
      id: "10",
      name: "Rodrigo Carvalho",
      email: "rodrigo.carvalho@example.com",
      totalInvoices: 22,
      totalRevenue: 11200,
    },
    {
      id: "11",
      name: "Camila Gomes",
      email: "camila.gomes@example.com",
      totalInvoices: 9,
      totalRevenue: 4100,
    },
    {
      id: "12",
      name: "Tiago Ribeiro",
      email: "tiago.ribeiro@example.com",
      totalInvoices: 11,
      totalRevenue: 5300,
    },
  ]

  const getCustomerInitials = (name: string) => {
    const segments = name.split(" ")
    if (segments.length === 1) {
      return segments[0][0].toUpperCase()
    }
    return (segments[0][0] + segments[1][0]).toUpperCase()
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Todos os seus clientes cadastrados
        </p>
      </div>

      <section className="flex w-full items-center justify-between gap-2">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar clientes..." />
        </InputGroup>
        <Button variant="default">
          <PlusIcon />
          <span className="hidden md:block">Novo Cliente</span>
          <span className="md:hidden">Novo</span>
        </Button>
      </section>

      {/* Loading state with skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
            </div>
            <div className="space-y-2 border-t border-border pt-4">
              <Skeleton className="h-3 w-48 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Error state */}
      <div className="rounded-xl border border-destructive/20 bg-card p-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangleIcon size={24} className="text-destructive" />
        </div>
        <p className="mt-4 font-medium text-foreground">
          Erro ao carregar clientes
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Não foi possível conectar ao servidor. Verifique sua conexão e tente
          novamente.
        </p>
        <Button variant="outline" className="mt-5">
          <RefreshCwIcon size={14} /> Tentar novamente
        </Button>
      </div>

      {/* Empty state — no clients added yet */}
      <div className="rounded-xl border border-border bg-card p-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full">
          <UserPlusIcon size={24} />
        </div>
        <p className="mt-4 font-medium text-foreground">Nenhum cliente ainda</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Adicione seu primeiro cliente para começar a enviar cobranças.
        </p>
        <Button className="mt-5">
          <PlusIcon size={16} /> Adicionar primeiro cliente
        </Button>
      </div>

      {/* Empty state — search with no results */}
      <div className="rounded-xl border border-border bg-card p-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <SearchIcon size={24} className="text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium text-foreground">
          Nenhum resultado encontrado
        </p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          Nenhum cliente corresponde a &quot;
          <span className="font-medium text-foreground">search value</span>
          &quot;. Tente outro termo.
        </p>
        <Button variant="outline" className="mt-5">
          Limpar busca
        </Button>
      </div>

      {/* Client Cards Grid with pagination */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.splice(0, 6).map((client) => (
          <div
            key={client.id}
            className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <Avatar>
                <AvatarFallback>
                  {getCustomerInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground transition-opacity group-hover:opacity-100 hover:text-foreground md:opacity-0"
                  >
                    <MoreHorizontalIcon size={16} />
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
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {client.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {client.email}
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                {client.totalInvoices} cobranças ·{" "}
                {formatCurrency(client.totalRevenue)} recebido
              </p>
              <Link
                href="/invoices/new"
                className="text-lumna mt-2 inline-block text-xs font-medium hover:underline"
              >
                Nova cobrança -&gt;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">1-6</span> de{" "}
          <span className="font-medium text-foreground">74</span> clientes
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
