import Link from "next/link"
import {
  ArrowRight,
  Zap,
  Shield,
  Receipt,
  Check,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LogoIcon } from "@/components/ui/logo-icon"
import { DecorIcon } from "@/components/ui/decor-icon"

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans selection:bg-primary selection:text-primary-foreground dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.05),transparent)]">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <LogoIcon className="size-5" />
            <span className="text-sm font-semibold tracking-tight">Lumna</span>
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button size="sm" className="ml-1" asChild>
              <Link href="/sign-up">Criar conta</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col border-x">
        {/* Horizontal grid lines for structure */}
        <div className="absolute inset-x-0 top-32 h-px bg-border max-md:hidden" />
        <div className="absolute inset-x-0 bottom-48 h-px bg-border max-md:hidden" />

        <DecorIcon position="top-left" className="top-32 max-md:hidden" />
        <DecorIcon position="top-right" className="top-32 max-md:hidden" />
        <DecorIcon position="bottom-left" className="bottom-48 max-md:hidden" />
        <DecorIcon
          position="bottom-right"
          className="bottom-48 max-md:hidden"
        />

        {/* Hero */}
        <section className="relative flex flex-col items-center px-6 pt-32 pb-24 text-center md:px-12 md:pt-48 md:pb-40">
          <h1 className="md:mt-22 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl md:leading-[1.1]">
            Cobranças profissionais para quem vive do próprio trabalho
          </h1>
          <p className="mt-6 max-w-xl text-base text-pretty text-muted-foreground md:text-lg">
            Sem mensalidade. Sem burocracia. Emita cobranças e receba em
            segundos com apenas 0,9% de taxa.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full font-medium sm:w-auto" asChild>
              <Link href="/sign-up">
                Começar agora
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <Separator />

        {/* Como funciona */}
        <section id="como-funciona" className="flex flex-col md:flex-row">
          <div className="flex w-full flex-col justify-center border-b px-6 py-16 md:w-1/3 md:border-r md:border-b-0 md:p-12">
            <h2 className="text-xl font-semibold tracking-tight text-balance">
              Como funciona
            </h2>
            <p className="mt-2 text-sm text-balance text-muted-foreground">
              Apenas 3 passos para o dinheiro estar disponível para você.
            </p>
          </div>

          <div className="grid w-full gap-px bg-border sm:grid-cols-1 md:w-2/3 md:grid-cols-1 lg:grid-cols-1">
            {[
              {
                step: "1",
                title: "Cadastre o Cliente",
                desc: "Insira os dados do cliente apenas uma vez. Eles ficarão salvos para as próximas faturas.",
              },
              {
                step: "2",
                title: "Gere a Cobrança",
                desc: "Informe o valor, breve descrição e data. Crie o link instantaneamente.",
              },
              {
                step: "3",
                title: "Receba o Pagamento",
                desc: "Envie o link via e-mail ou WhatsApp. O cliente paga pela Stripe com segurança.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-background p-8 md:p-10">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-semibold">
                  {item.step}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Vantagens */}
        <section className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col px-6 py-16 md:p-12">
            <div className="mb-6 inline-flex size-10 items-center justify-center rounded-lg border bg-secondary/50">
              <Zap className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Agilidade Extrema</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              O fluxo de cobrança foi minimizado para você criar links de
              pagamento em segundos, sem clicar em dezenas de menus.
            </p>
          </div>
          <div className="flex flex-col px-6 py-16 md:p-12">
            <div className="mb-6 inline-flex size-10 items-center justify-center rounded-lg border bg-secondary/50">
              <Shield className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Segurança Global</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Toda transação passa pela Stripe, eliminando seus riscos de
              segurança e mantendo um padrão de confiança altíssimo.
            </p>
          </div>
          <div className="flex flex-col px-6 py-16 md:p-12">
            <div className="mb-6 inline-flex size-10 items-center justify-center rounded-lg border bg-secondary/50">
              <Receipt className="size-5" />
            </div>
            <h3 className="text-base font-semibold">Transparência Total</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Apenas 0,9% sobre cada transação. Chega de pagar mensalidades
              caras por sistemas que você usa esporadicamente.
            </p>
          </div>
        </section>

        <Separator />

        {/* Preço & CTA */}
        <section id="preco" className="relative flex flex-col md:flex-row">
          <div className="flex w-full flex-col justify-center border-b px-6 py-20 text-center md:w-1/2 md:border-r md:border-b-0 md:px-12 md:py-32">
            <h2 className="text-2xl font-bold tracking-tight text-balance">
              Abandone as mensalidades hoje mesmo.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
              Crie faturas infinitas para clientes ilimitados e acompanhe
              através de um painel elegante.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="w-full font-medium sm:w-auto"
                asChild
              >
                <Link href="/sign-up">
                  Começar a usar agora
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col justify-center bg-secondary/20 px-6 py-20 md:w-1/2 md:px-12 md:py-32">
            <div className="mx-auto w-full max-w-sm rounded-lg border bg-background p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  Taxa por Cobrança
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    0,9%
                  </span>
                </div>
              </div>
              <Separator className="my-6" />
              <ul className="space-y-4 text-sm font-medium">
                {[
                  "Cobranças ilimitadas",
                  "Clientes ilimitados",
                  "Processamento seguro Stripe",
                  "Dashboard financeiro",
                  "Sem custo base mensal",
                  "Sem taxas escondidas",
                ].map((perk, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </div>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between border-x px-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Lumna</span>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="transition-duration-200 transition-colors hover:text-foreground"
            >
              Acessar Painel
            </Link>
            <Link
              href="/sign-up"
              className="transition-duration-200 transition-colors hover:text-foreground"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
