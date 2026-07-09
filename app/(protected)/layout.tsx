import { cookies } from "next/headers"

import { AppSidebar } from "@/components/protected/layout/app-sidebar"
import { Header } from "@/components/protected/layout/header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { requireSession } from "@/lib/auth/session"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSession()

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          user={{ name: user.name, email: user.email, image: user.image }}
        />
        <SidebarInset>
          <Header />
          <main className="container mx-auto flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
