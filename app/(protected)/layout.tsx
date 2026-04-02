import Link from "next/link"
import { CreditCard, PlugZap } from "lucide-react"
import { AppSidebar } from "@/components/protected/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { requireSession } from "@/lib/auth/functions"
import { getProtectedLayoutData } from "@/lib/billing/data"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireSession()
  const { connection } = await getProtectedLayoutData(session.user.id)
  const isConnected = connection?.status === "CONNECTED"

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <SidebarInset className="bg-muted/20">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Badge variant={isConnected ? "secondary" : "outline"}>
                <CreditCard />
                {isConnected
                  ? "Mercado Pago conectado"
                  : "Mercado Pago desconectado"}
              </Badge>
            </div>
            <Button asChild variant={isConnected ? "outline" : "default"}>
              <Link
                href={
                  isConnected
                    ? "/configuracoes?tab=mercado-pago"
                    : "/api/mercado-pago/oauth/start"
                }
              >
                <PlugZap />
                {isConnected ? "Gerenciar conta" : "Conectar Mercado Pago"}
              </Link>
            </Button>
          </header>
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
