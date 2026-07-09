"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function SignInErrorToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("error") !== "true") {
      return
    }

    toast.error("Não foi possível entrar. Tente novamente.")
    router.replace("/sign-in")
  }, [router, searchParams])

  return null
}
