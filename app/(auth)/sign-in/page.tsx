import Link from "next/link"
import { LumnaLogo } from "@/components/landing/logo"
import { GithubOAuthButton } from "@/components/auth/sign-in/github-oauth-button"
import { Sparkles } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  // If user is already authenticated, redirect to dashboard
  const session = await getSession()
  if (session) redirect("/dashboard")

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      {/* Abstract Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />

        {/* Glowing orbs */}
        <div className="animate-pulse-glow absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.42_0.13_260/0.15),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="animate-fade-in-up mb-8 flex justify-center opacity-0">
          <Link
            href="/"
            className="group flex size-14 items-center justify-center rounded-2xl border border-border/50 bg-background/50 shadow-sm backdrop-blur-xl transition-all hover:scale-105 hover:bg-muted/50"
          >
            <LumnaLogo className="size-6 text-primary transition-transform group-hover:scale-110" />
          </Link>
        </div>

        {/* Card */}
        <div className="animate-fade-in-up animation-delay-150 relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/40 p-8 opacity-0 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Inner border for glass effect */}
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/10 dark:border-white/5" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Acesso rápido
            </div>

            <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Bem-vindo de volta
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Acesse sua conta para gerenciar clientes, criar novas cobranças e
              acompanhar seus recebimentos.
            </p>

            <div className="mt-10 w-full">
              <GithubOAuthButton />
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="animate-float absolute top-20 -left-12 -z-10 h-24 w-24 rounded-full border border-border/50 bg-muted/30 opacity-0 backdrop-blur-md sm:opacity-100" />
        <div className="animate-float animation-delay-750 absolute -right-8 bottom-10 -z-10 h-16 w-16 rounded-full border border-border/50 bg-primary/5 opacity-0 backdrop-blur-md sm:opacity-100" />
      </div>
    </div>
  )
}
