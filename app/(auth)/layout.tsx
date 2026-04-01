import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <header className="absolute top-0 right-0 left-0 flex w-full items-center justify-between p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <ThemeToggle />
      </header>
      {children}
    </div>
  )
}
