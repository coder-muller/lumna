"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { UserAvatar } from "@/components/protected/user-avatar"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/client"
import { useRouter } from "next/navigation"

const navItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Cobrancas", icon: FileText, path: "/cobrancas" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Configuracoes", icon: Settings, path: "/configuracoes" },
]

type AppSidebarProps = {
  userName: string | null | undefined
  userEmail: string
  userImage?: string
  isMpConnected: boolean
}

export function AppSidebar({
  userName,
  userEmail,
  userImage,
  isMpConnected,
}: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
  }

  return (
    <aside className="flex h-dvh w-60 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="border-b border-border p-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-lumna-ultralight font-medium text-lumna"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border p-3">
        {/* MP Status */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2",
            isMpConnected ? "bg-success-light/50" : "bg-warning-light/50"
          )}
        >
          {isMpConnected ? (
            <Wifi size={14} className="text-success" />
          ) : (
            <WifiOff size={14} className="text-warning" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isMpConnected ? "text-success-text" : "text-warning-text"
            )}
          >
            {isMpConnected
              ? "Mercado Pago conectado"
              : "Mercado Pago desconectado"}
          </span>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2">
          <UserAvatar image={userImage || undefined} name={userName || "Usuario"} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {userName || "Usuario"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
            aria-label="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
