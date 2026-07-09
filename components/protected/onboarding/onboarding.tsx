"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRightIcon, LogOutIcon } from "lucide-react"

import { ApiKeyForm } from "@/components/protected/abacatepay/api-key-form"
import { buttonVariants } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"

const ABACATEPAY_DASHBOARD_URL = "https://www.abacatepay.com/dashboard"

export function Onboarding() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/sign-in")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.92_0.01_250)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.02_250)_0%,transparent_55%)]"
      />

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="animate-in duration-700 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none">
          <LogoIcon className="size-12 text-foreground md:size-14" />
        </div>

        <h1 className="mt-8 animate-in text-3xl font-bold tracking-[-0.02em] delay-150 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none md:text-4xl">
          Conecte sua AbacatePay
        </h1>

        <p className="mt-4 animate-in text-base leading-relaxed text-muted-foreground delay-300 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
          A Lumna usa a sua conta AbacatePay para criar cobranças. Crie uma
          chave de API no dashboard e cole abaixo.
        </p>

        <ol className="mt-8 animate-in space-y-3 text-sm leading-relaxed text-muted-foreground delay-450 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
          <li>
            Abra o{" "}
            <a
              href={ABACATEPAY_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              dashboard da AbacatePay
            </a>{" "}
            e entre na conta.
          </li>
          <li>
            Em Integração, crie uma chave com a permissão{" "}
            <span className="font-medium text-foreground">STORE:READ</span>.
          </li>
          <li>Copie a chave e cole no campo abaixo.</li>
        </ol>

        <div className="mt-10 animate-in delay-600 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
          <ApiKeyForm autoFocus submitLabel="Salvar chave" />
        </div>

        <a
          href={ABACATEPAY_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "link" }),
            "mt-6 h-auto animate-in justify-start px-0 delay-700 duration-700 fill-mode-both fade-in motion-reduce:animate-none"
          )}
        >
          Abrir dashboard AbacatePay
          <ArrowUpRightIcon />
        </a>
      </main>

      <footer className="relative flex h-14 items-center justify-center gap-4 px-6">
        <Link
          href="/"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Lumna
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <LogOutIcon className="size-3.5" />
          {isSigningOut ? "Saindo..." : "Sair"}
        </button>
      </footer>
    </div>
  )
}
