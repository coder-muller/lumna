import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import { cn } from "@/lib/utils"

export function MarketingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="size-5 text-foreground" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">
            Lumna
          </span>
        </Link>
        <Link
          href="/sign-in"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Entrar
        </Link>
      </nav>
    </header>
  )
}
