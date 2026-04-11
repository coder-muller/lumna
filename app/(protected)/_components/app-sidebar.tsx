"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { getNavGroups } from "./app-shared"
import { LatestChange } from "./latest-change"
import { NavGroup } from "./nav-group"

export function AppSidebar() {
  const pathname = usePathname()
  const navGroups = getNavGroups(pathname)

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <LogoIcon className="size-4" />
                <span className="font-medium">Lumna</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              tooltip="Nova cobrança"
            >
              <PlusIcon />
              <span>Nova cobrança</span>
            </SidebarMenuButton>
            <Button
              aria-label="Buscar"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              size="icon"
              variant="outline"
            >
              <SearchIcon />
              <span className="sr-only">Buscar</span>
            </Button>
          </SidebarMenuItem>
        </SidebarGroup>
        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <LatestChange />
      </SidebarFooter>
    </Sidebar>
  )
}
