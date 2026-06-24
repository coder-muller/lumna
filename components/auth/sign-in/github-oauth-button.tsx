"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

export function GithubOAuthButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    // Here will be the Better Auth sign in logic
    // await authClient.signIn.social({ provider: "github" })

    // Simulating loading for visual feedback
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Button
      size="lg"
      className="group relative h-14 w-full overflow-hidden rounded-xl bg-foreground text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      <div className="absolute inset-0 flex h-full w-full transform-[skew(-12deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-12deg)_translateX(100%)] group-hover:duration-1000">
        <div className="relative h-full w-8 bg-background/20" />
      </div>
      <span className="relative z-10 flex items-center gap-3 text-base font-medium">
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="size-5 fill-current"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        )}
        Continuar com GitHub
        {!isLoading && (
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        )}
      </span>
    </Button>
  )
}
