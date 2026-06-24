"use client"

import Link from "next/link"
import { LumnaLogo } from "./logo"

const navLinks = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preço", href: "#preco" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
      <div className="pointer-events-auto flex h-12 w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/60 px-4 shadow-sm backdrop-blur-md transition-all duration-300 supports-backdrop-filter:bg-background/40">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
            <LumnaLogo className="size-4 text-primary" />
          </div>
          <span className="font-heading text-sm font-medium tracking-tight">
            Lumna
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            Entrar
          </Link>
          <Link
            href="/sign-in"
            className="flex h-8 items-center justify-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-transform hover:scale-105 active:scale-95"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  )
}
