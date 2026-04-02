import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="flex w-full items-center justify-between border-b border-border p-2">
      <SidebarTrigger />
      <ThemeToggle variant="ghost" />
    </header>
  )
}
