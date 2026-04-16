import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    client: "Empresa ABC",
    email: "contato@abc.com",
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
]

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment[0])
    .join("")
    .toUpperCase()
}

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

export default function RecentInvoices() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <p className="text-sm font-semibold text-foreground">
          Cobranças recentes
        </p>
        <Link
          href="/invoices"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          Ver todas →
        </Link>
      </div>
      <div className="px-4 pt-2 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Vencimento</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentInvoices.map((inv) => (
              <TableRow key={inv.id} className="cursor-pointer">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
