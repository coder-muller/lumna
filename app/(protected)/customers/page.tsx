import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon, PlusIcon, RefreshCwIcon, SearchIcon, UserPlusIcon, PencilIcon, TrashIcon, InfoIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
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

      <section className="w-full flex items-center justify-between gap-2">
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-4 h-4 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-40 rounded" />
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <Skeleton className="h-3 w-48 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Error state */}
      <div className="bg-card rounded-xl border border-destructive/20 p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
          <AlertTriangleIcon size={24} className="text-destructive" />
        </div>
        <p className="font-medium text-foreground mt-4">Erro ao carregar clientes</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.
        </p>
        <Button variant="outline" className="mt-5">
          <RefreshCwIcon size={14} /> Tentar novamente
        </Button>
      </div>

      {/* Empty state — no clients added yet */}
      <div className="bg-card rounded-xl border border-border p-16 text-center">
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center">
          <UserPlusIcon size={24} />
        </div>
        <p className="font-medium text-foreground mt-4">Nenhum cliente ainda</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Adicione seu primeiro cliente para começar a enviar cobranças.
        </p>
        <Button className="mt-5">
          <PlusIcon size={16} /> Adicionar primeiro cliente
        </Button>
      </div>

      {/* Empty state — search with no results */}
      <div className="bg-card rounded-xl border border-border p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center">
          <SearchIcon size={24} className="text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground mt-4">Nenhum resultado encontrado</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Nenhum cliente corresponde a &quot;<span className="font-medium text-foreground">search value</span>&quot;. Tente outro termo.
        </p>
        <Button variant="outline" className="mt-5">
          Limpar busca
        </Button>
      </div>

      {/* Client Cards Grid with pagination */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.splice(0, 6).map((client) => (
          <div
            key={client.id}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <Avatar>
                <AvatarFallback>
                  {getCustomerInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground md:opacity-0 group-hover:opacity-100 transition-opacity">
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
            <p className="font-semibold text-sm text-foreground mt-3">{client.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{client.email}</p>
            <div className="border-t border-border mt-4 pt-4">
              <p className="text-xs text-muted-foreground">
                {client.totalInvoices} cobranças · {formatCurrency(client.totalRevenue)} recebido
              </p>
              <Link
                href="/invoices/new"
                className="text-xs text-lumna hover:underline mt-2 inline-block font-medium"
              >
                Nova cobrança -&gt;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Mostrando{" "}
          <span className="font-medium text-foreground">
            1-6
          </span>{" "}
          de <span className="font-medium text-foreground">74</span> clientes
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
          >
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
          >
            Próxima <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
