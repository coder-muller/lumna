import { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { OAuthButtons } from "@/components/auth/sign-in/oauth-buttons"
import { SignInErrorToast } from "@/components/auth/sign-in/sign-in-error-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoIcon } from "@/components/ui/logo-icon"
import { getSession } from "@/lib/auth/session"

export default async function SignInPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-foreground text-background lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="size-5" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">
            Lumna
          </span>
        </Link>

        <LogoIcon
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 size-[36rem] text-background/[0.06]"
        />

        <div className="relative max-w-sm space-y-3">
          <p className="text-2xl leading-snug font-medium tracking-tight">
            Cobranças por link, simples e rápidas.
          </p>
          <p className="text-sm text-background/60">
            Crie clientes, envie o link e receba via Stripe Checkout.
          </p>
        </div>
      </aside>

      <main className="relative flex flex-col p-6 lg:p-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <LogoIcon className="size-5 text-foreground" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">
              Lumna
            </span>
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-muted-foreground">
                Entre com sua conta para continuar
              </p>
            </div>

            <div className="space-y-2">
              <OAuthButtons />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com os termos de uso e a política de
              privacidade da Lumna.
            </p>
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        <SignInErrorToast />
      </Suspense>
    </div>
  )
}
