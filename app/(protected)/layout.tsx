import { cookies } from "next/headers"

import { requireSession } from "@/lib/auth/session"
import { AppSidebar } from "@/components/protected/layout/app-sidebar"
import { Header } from "@/components/protected/layout/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/providers/query-provider"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSession()
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")?.value
  const defaultOpen = sidebarState !== "false"

  return (
    <QueryProvider>
      <TooltipProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar user={session.user} />
          <SidebarInset>
            <Header />
            <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </QueryProvider>
  )
}
