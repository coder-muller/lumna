"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-lumna p-6 text-primary-foreground">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold text-balance">
          Tudo pronto! Sua conta está conectada.
        </p>
        <p className="text-sm text-pretty text-primary-foreground/80">
          Agora você pode criar sua primeira cobrança e enviar para um cliente.
        </p>
        <div className="mt-3 flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-card text-lumna hover:bg-card/90"
            asChild
          >
            <Link href="/cobrancas/nova">Criar primeira cobrança</Link>
          </Button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-sm text-primary-foreground/60 hover:text-primary-foreground/100"
          >
            Dispensar
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-primary-foreground/60 hover:text-primary-foreground"
        aria-label="Fechar banner"
      >
        <X className="size-5" />
      </button>
    </div>
  )
}
