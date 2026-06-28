"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createOnboardingLink } from "@/server/stripe/create-onboarding-link"

type StripeOnboardingButtonProps = {
  label?: string
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
}

export function StripeOnboardingButton({
  label = "Verificar conta",
  className,
  variant,
  size,
}: StripeOnboardingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
    setIsLoading(true)

    const response = await createOnboardingLink()

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
      variant={variant}
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : null}
      {isLoading ? "Redirecionando..." : label}
    </Button>
  )
}
