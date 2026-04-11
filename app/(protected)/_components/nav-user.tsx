"use client"

import { BellIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const user = {
  name: "Guilherme Müller",
  email: "guilhermemullerxx@gmail.com",
  avatar: "https://github.com/coder-muller.png",
  role: "Administrador",
}

export function NavUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild aria-label="Abrir menu da conta">
        <button className="rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50">
          <Avatar>
            <AvatarImage alt={user.name} src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="py-0">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="size-10">
              <AvatarImage alt={user.name} src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium text-foreground">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {user.role}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldIcon />
            Segurança
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BellIcon />
            Notificações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild variant="destructive">
            <Link href="/sign-in" passHref>
              <LogOutIcon />
              Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
