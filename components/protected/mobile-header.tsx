"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { UserAvatar } from "@/components/protected/user-avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/client"

const navItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Cobrancas", icon: FileText, path: "/cobrancas" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Configuracoes", icon: Settings, path: "/configuracoes" },
]

type MobileHeaderProps = {
  userName: string | null | undefined
  userEmail: string
  userImage?: string
  isMpConnected: boolean
}

export function MobileHeader({
  userName,
  userEmail,
  userImage,
  isMpConnected,
}: MobileHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
      <Link href="/dashboard">
        <Logo />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>

          {/* Logo */}
          <div className="border-b border-border p-5">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-lumna-ultralight font-medium text-lumna"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-border p-3">
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
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
