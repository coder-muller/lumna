import { AppHeader } from "@/components/protected/sidebar/app-header"
import { AppSidebar } from "@/components/protected/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { requireSession } from "@/lib/auth/functions"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireSession()

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image || undefined,
    mp_connected: true,
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="h-full w-full">
        <AppSidebar user={user} />
        <SidebarInset>
          <main className="flex h-full w-full flex-col items-center justify-center">
            <AppHeader />
            <section className="container mx-auto w-full flex-1 px-4 py-2 md:h-full md:overflow-y-auto md:px-8 md:py-4">
              {children}
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
