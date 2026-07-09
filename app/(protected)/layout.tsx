import { cookies } from "next/headers"
import { eq } from "drizzle-orm"

import { Onboarding } from "@/components/protected/onboarding/onboarding"
import { AppSidebar } from "@/components/protected/layout/app-sidebar"
import { Header } from "@/components/protected/layout/header"
import { QueryProvider } from "@/components/providers/query-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { requireSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { abacatepayCredentials } from "@/lib/db/schema"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireSession()

  const [credentials] = await db
    .select({ id: abacatepayCredentials.id })
    .from(abacatepayCredentials)
    .where(eq(abacatepayCredentials.userId, user.id))
    .limit(1)

  if (!credentials) {
    return (
      <QueryProvider>
        <Onboarding />
      </QueryProvider>
    )
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <QueryProvider>
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
    </QueryProvider>
  )
}
