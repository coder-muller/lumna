import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <header className="absolute top-0 right-0 left-0 flex w-full items-center justify-between p-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <LogoIcon className="size-5" />
        <ThemeToggle />
      </header>
      {children}
    </div>
  )
}
