import { AppSidebar } from "@/components/protected/app-sidebar"
import { MobileHeader } from "@/components/protected/mobile-header"
import { requireSession } from "@/lib/auth/functions"
import { getProtectedLayoutData } from "@/lib/billing/data"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireSession()
  const { connection } = await getProtectedLayoutData(session.user.id)
  const isMpConnected = connection?.status === "CONNECTED"

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-dvh md:block">
        <AppSidebar
          userName={session.user.name}
          userEmail={session.user.email}
          userImage={session.user.image || undefined}
          isMpConnected={isMpConnected}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <MobileHeader
          userName={session.user.name}
          userEmail={session.user.email}
          userImage={session.user.image || undefined}
          isMpConnected={isMpConnected}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="w-full p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
