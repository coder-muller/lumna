"use client"

import { useState } from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const latestChange = {
  badge: "ATUALIZAÇÃO",
  title: "Filtros de cobrança mais rápidos",
  description: "Busca e status em uma linha.",
  readMore: { href: "#changelog", label: "Changelog" },
} as const

export function LatestChange() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        "relative flex size-full min-h-28 flex-col justify-center gap-1 overflow-hidden rounded-lg border bg-background px-4 pt-3 pb-1 transition-opacity",
        "group/latest-change group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0",
        "*:text-nowrap"
      )}
    >
      <span className="font-mono text-[10px] font-light text-muted-foreground">
        {latestChange.badge}
      </span>
      <p className="text-xs font-medium">{latestChange.title}</p>
      <span className="text-[10px] text-muted-foreground">
        {latestChange.description}
      </span>
      <Button
        asChild
        className="w-max px-0 text-xs font-light"
        size="sm"
        variant="link"
      >
        <a href={latestChange.readMore.href}>{latestChange.readMore.label}</a>
      </Button>
      <Button
        aria-label="Fechar atualização"
        className="absolute top-2 right-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover/latest-change:opacity-100"
        onClick={() => setIsOpen(false)}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
}
