import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"

export default async function CustomersPage() {
    return (
        <div className="space-y-4">
            <div className="flex w-full items-center justify-between gap-2">
                <div>
                    <h2 className="text-xl font-semibold">Clientes</h2>
                    <p className="text-sm text-muted-foreground">
                        Todos os seus clientes cadastrados
                    </p>
                </div>
                <Button variant="default" size="lg">
                    <PlusIcon />
                    Adicionar cliente
                </Button>
            </div>

            <div className="w-full">
                <InputGroup className="md:max-w-xs">
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Buscar clientes..." />
                </InputGroup>
            </div>

            {/* Loading state */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
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

            {/* Empty state */}
            <div className="rounded-xl border border-border bg-card p-16 text-center">
                <div className="bg-muted mx-auto flex h-14 w-14 items-center justify-center rounded-full">
                    <UserPlusIcon size={24} className="text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-foreground">Nenhum cliente ainda</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Adicione seu primeiro cliente para começar a enviar cobranças.
                </p>
                <Button className="mt-5">
                    <PlusIcon size={16} className="mr-2" /> Adicionar primeiro cliente
                </Button>
            </div>

            {/* No results state */}
            <div className="rounded-xl border border-border bg-card p-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <SearchIcon size={24} className="text-muted-foreground" />
                </div>
                <p className="mt-4 font-medium text-foreground">
                    Nenhum resultado encontrado
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Nenhum cliente corresponde a &apos;
                    <span className="font-medium text-foreground">
                        search variable here
                    </span>
                    &apos;. Tente outro termo.
                </p>
                <Button variant="outline" className="mt-5">
                    Limpar busca
                </Button>
            </div>

            {/* Customers grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <Avatar>
                                <AvatarImage
                                    src={"https://github.com/shadcn.png"}
                                    alt={"John Doe"}
                                />
                                <AvatarFallback>
                                    {"John Doe"[0].toLocaleUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <button className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
                                <MoreHorizontalIcon size={16} />
                            </button>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">John Doe</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            john.doe@example.com
                        </p>
                        <div className="mt-4 border-t border-border pt-4">
                            <p className="text-xs text-muted-foreground">
                                12 cobranças · R$ 3.450,00 recebido
                            </p>
                            <Link
                                href="/invoices/new?customer_id=123"
                                className="mt-2 inline-block text-xs font-medium hover:underline"
                            >
                                Nova cobrança →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}

            <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Mostrando <span className="text-foreground">1-10</span> de <span className="text-foreground">50</span> clientes
                </p>

                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <ChevronLeftIcon />
                        Anterior
                    </Button>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Button
                            key={index}
                            variant={index === 0 ? "default" : "ghost"}
                            size="icon"
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button variant="outline">
                        Próximo
                        <ChevronRightIcon />
                    </Button>
                </div>

            </div>
        </div>
    )
}
