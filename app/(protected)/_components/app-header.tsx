"use client"

import { usePathname } from "next/navigation"
import { BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { AppBreadcrumbs } from "./app-breadcrumbs"
import { CustomSidebarTrigger } from "./custom-sidebar-trigger"
import { getNavLinks } from "./app-shared"
import { NavUser } from "./nav-user"

export function AppHeader() {
  const pathname = usePathname()
  const activeItem = getNavLinks(pathname).find((item) => item.isActive)

  return (
    <header className={cn("mb-6 flex items-center justify-between gap-2 px-2")}>
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button aria-label="Notificações" size="icon" variant="ghost">
          <BellIcon />
        </Button>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <NavUser />
      </div>
    </header>
  )
}
