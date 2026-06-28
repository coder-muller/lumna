"use client"

import { useState } from "react"
import { ExternalLinkIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createDashboardLoginLink } from "@/server/stripe/create-dashboard-login-link"

type StripeDashboardButtonProps = {
  className?: string
  size?: React.ComponentProps<typeof Button>["size"]
}

export function StripeDashboardButton({
  className,
  size,
}: StripeDashboardButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)

    const response = await createDashboardLoginLink()

    if ("error" in response) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    window.location.href = response.url
  }

  return (
    <Button
      type="button"
      className={className}
      disabled={isLoading}
      onClick={handleClick}
      size={size}
    >
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <ExternalLinkIcon className="size-4" />
      )}
      {isLoading ? "Abrindo..." : "Abrir dashboard da Stripe"}
    </Button>
  )
}
