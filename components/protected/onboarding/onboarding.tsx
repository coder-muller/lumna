"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRightIcon,
  KeyRoundIcon,
  Link2Icon,
  LogOutIcon,
  ShieldCheckIcon,
  WalletCardsIcon,
} from "lucide-react"

import { ApiKeyForm } from "@/components/protected/abacatepay/api-key-form"
import { buttonVariants } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import {
  ABACATEPAY_APP_URL,
  ABACATEPAY_DOCS_AUTH_URL,
  ABACATEPAY_DOCS_WEBHOOKS_URL,
  ABACATEPAY_REQUIRED_PERMISSIONS,
} from "@/lib/abacatepay/links"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: "account",
    icon: WalletCardsIcon,
    title: "Entre na AbacatePay",
    body: "Abra o app da AbacatePay e acesse a conta da sua loja.",
    href: ABACATEPAY_APP_URL,
    linkLabel: "Abrir app AbacatePay",
  },
  {
    id: "key",
    icon: KeyRoundIcon,
    title: "Crie uma chave de API",
    body: "No menu Integrar → API Keys, clique em Criar Chave. Use um nome claro, como “Lumna”.",
    href: ABACATEPAY_DOCS_AUTH_URL,
    linkLabel: "Ver guia de chaves",
  },
  {
    id: "permissions",
    icon: ShieldCheckIcon,
    title: "Marque as permissões",
    body: "A Lumna precisa criar clientes, produtos, checkouts e webhooks pela sua chave.",
    href: ABACATEPAY_DOCS_AUTH_URL,
    linkLabel: "Lista de permissões",
  },
  {
    id: "connect",
    icon: Link2Icon,
    title: "Cole a chave aqui",
    body: "A Lumna valida a chave e, em ambiente com HTTPS público, registra o webhook sozinha. Você não precisa colar URL de webhook.",
    href: ABACATEPAY_DOCS_WEBHOOKS_URL,
    linkLabel: "Como funcionam os webhooks",
  },
] as const

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
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.94_0.01_250)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.28_0.02_250)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />

      <main className="relative mx-auto grid w-full max-w-5xl flex-1 gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
        <section className="flex flex-col">
          <div className="animate-in duration-700 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none">
            <LogoIcon className="size-11 text-foreground md:size-12" />
          </div>

          <p className="mt-8 animate-in text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase delay-100 duration-700 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
            Primeiro passo
          </p>

          <h1 className="mt-3 max-w-md animate-in text-3xl font-bold tracking-[-0.03em] text-balance delay-150 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none md:text-4xl">
            Conecte a AbacatePay para liberar cobranças
          </h1>

          <p className="mt-4 max-w-md animate-in text-base leading-relaxed text-muted-foreground delay-250 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
            A Lumna usa a sua conta AbacatePay para criar clientes e links de
            pagamento. Siga o trilho abaixo — o webhook é configurado
            automaticamente quando o app estiver em HTTPS.
          </p>

          <ol className="relative mt-10 flex flex-col gap-0">
            <div
              aria-hidden
              className="absolute top-3 bottom-3 left-[15px] w-px bg-border"
            />

            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <li
                  key={step.id}
                  className={cn(
                    "relative flex animate-in gap-4 py-3 fill-mode-both fade-in slide-in-from-bottom-2 motion-reduce:animate-none",
                    index === 0 && "delay-300 duration-700",
                    index === 1 && "delay-400 duration-700",
                    index === 2 && "delay-500 duration-700",
                    index === 3 && "delay-600 duration-700"
                  )}
                >
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
                    <Icon className="size-3.5" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-mono text-[11px] tracking-wider text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-sm font-semibold tracking-tight">
                        {step.title}
                      </h2>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "mt-1 h-auto px-0 text-sm"
                      )}
                    >
                      {step.linkLabel}
                      <ArrowUpRightIcon />
                    </a>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="animate-in delay-500 duration-700 fill-mode-both fade-in slide-in-from-bottom-4 motion-reduce:animate-none">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-6 shadow-[0_1px_0_oklch(0_0_0/0.04)] backdrop-blur-sm md:p-8 dark:bg-card/60 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Colar chave de API
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aceita <span className="font-mono">abc_dev_</span> ou{" "}
                  <span className="font-mono">abc_prod_</span>.
                </p>
              </div>
              <a
                href={ABACATEPAY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shrink-0"
                )}
              >
                Abrir app
                <ArrowUpRightIcon />
              </a>
            </div>

            <div className="mt-6">
              <ApiKeyForm autoFocus submitLabel="Conectar AbacatePay" />
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Permissões necessárias
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {ABACATEPAY_REQUIRED_PERMISSIONS.map((permission) => (
                  <li
                    key={permission}
                    className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] text-foreground/80"
                  >
                    {permission}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Em localhost o webhook não registra (a AbacatePay exige HTTPS
                público). Você ainda pode criar cobranças; o status pago só
                atualiza sozinho com webhook ativo. Em produção, a Lumna
                registra o webhook automaticamente.
              </p>
            </div>
          </div>
        </section>
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
