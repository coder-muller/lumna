"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Receipt, Settings, Users } from "lucide-react"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/cobrancas", label: "Cobrancas", icon: Receipt },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings },
]

type AppSidebarProps = {
  userName: string | null | undefined
  userEmail: string
}

export function AppSidebar({ userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link href="/dashboard" className="flex items-center">
          <Logo size="md" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-3 py-4 text-xs text-sidebar-foreground/70">
        <p className="font-medium text-sidebar-foreground">
          {userName || "Usuario"}
        </p>
        <p className="truncate">{userEmail}</p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
