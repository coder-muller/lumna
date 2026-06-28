import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Users, ReceiptText, Settings } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Clientes", href: "/customers", icon: Users },
  { title: "Cobranças", href: "/invoices", icon: ReceiptText },
  { title: "Configurações", href: "/settings", icon: Settings },
]
