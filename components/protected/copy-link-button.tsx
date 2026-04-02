"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

type CopyLinkButtonProps = {
  url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      <Copy />
      {copied ? "Copiado" : "Copiar"}
    </Button>
  )
}
