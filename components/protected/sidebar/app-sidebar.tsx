"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BadgeCheckIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface AppSidebarProps {
  user: {
    name: string
    email: string
    image?: string
    mp_connected: boolean
  }
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Cobranças",
    href: "/invoices",
    icon: ReceiptIcon,
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: UsersIcon,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: SettingsIcon,
  },
]

export function AppSidebar({ user }: AppSidebarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    setIsSigningOut(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
        onError: () => {
          toast.error("Occoreu em erro!", {
            description:
              "Aconteceu um erro ao tentar sair da sua conta. Tente novamente mais tarde.",
          })
          setIsSigningOut(false)
        },
      },
    })
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <ZapIcon className="size-4" />
              </div>
              <span className="truncate text-xl font-semibold select-none">
                Lumna
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={item.href.includes(pathname)}
                    tooltip={item.name}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                              {user.name[0].toLocaleUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.mp_connected && (
                            <div className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-background bg-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="flex-nowrap truncate font-medium">
                            {user.name.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-auto">
                    <DropdownMenuLabel>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                              {user.name[0].toLocaleUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {user.mp_connected ? (
                          <Badge variant="success" className="w-full">
                            Mercado Pago Conectado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="w-full">
                            Mercado Pago Desconectado
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <BadgeCheckIcon />
                        Conta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={isSigningOut}
                      variant="destructive"
                      onClick={async () => {
                        await handleLogout()
                      }}
                    >
                      {isSigningOut ? <Spinner /> : <LogOutIcon />}
                      {isSigningOut ? "Saindo..." : "Sair"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
