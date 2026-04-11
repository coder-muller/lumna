import { TooltipProvider } from "@/components/ui/tooltip"

import { AppShell } from "./_components/app-shell"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TooltipProvider>
      <AppShell>{children}</AppShell>
    </TooltipProvider>
  )
}
