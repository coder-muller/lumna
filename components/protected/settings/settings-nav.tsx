"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navItems = [
  { title: "Conta", href: "/settings/account" },
  { title: "Integrações", href: "/settings/integrations" },
] as const

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="shrink-0 md:w-48">
      <ul className="flex gap-6 border-b md:sticky md:top-4 md:flex-col md:gap-1 md:border-0">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block pb-2 text-sm transition-colors md:border-l-2 md:py-1.5 md:pl-3",
                  active
                    ? "border-b-2 border-foreground font-medium md:border-b-0 md:border-l-foreground"
                    : "text-muted-foreground hover:text-foreground md:border-transparent"
                )}
              >
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
