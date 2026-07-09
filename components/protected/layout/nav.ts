import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboardIcon,
  ReceiptTextIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Clientes", href: "/customers", icon: UsersIcon },
  { title: "Cobranças", href: "/invoices", icon: ReceiptTextIcon },
  { title: "Configurações", href: "/settings", icon: SettingsIcon },
]
