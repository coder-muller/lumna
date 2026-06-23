import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Copy, Link2, Mail } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.42_0.13_260/0.08),transparent_50%)]" />
        <div className="animate-aurora absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.42_0.13_260/0.12),transparent_70%)] blur-3xl" />
        <div className="animate-aurora animation-delay-300 absolute top-20 right-1/4 h-[300px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.1_175/0.08),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="animate-fade-in-up mb-6 h-7 px-3 text-xs font-medium opacity-0"
          >
            Cobranças online sem complicação
          </Badge>

          <h1 className="animate-fade-in-up animation-delay-150 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance opacity-0 sm:text-5xl md:text-6xl lg:text-7xl">
            Receba pagamentos por link com a simplicidade que seu negócio merece
          </h1>

          <p className="animate-fade-in-up animation-delay-300 mt-6 max-w-2xl text-lg text-muted-foreground opacity-0 sm:text-xl">
            Cadastre clientes, gere cobranças avulsas e envie links de pagamento
            seguros. Tudo processado pela Stripe, sem burocracia e sem taxa
            mensal.
          </p>

          <div className="animate-fade-in-up animation-delay-450 mt-10 flex flex-col gap-3 opacity-0 sm:flex-row">
            <Button size="lg" asChild className="group px-6">
              <Link href="/register">
                Começar grátis
                <ArrowRight className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-6">
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          <p className="animate-fade-in-up animation-delay-600 mt-4 text-xs text-muted-foreground opacity-0">
            Sem cartão de crédito. Taxa de apenas{" "}
            <span className="font-mono font-medium text-foreground">0,99%</span>{" "}
            por transação paga.
          </p>
        </div>

        {/* Product mockup */}
        <div className="animate-fade-in-up animation-delay-750 relative mx-auto mt-20 max-w-4xl opacity-0">
          <div className="perspective-1000 relative mx-auto max-w-[720px]">
            {/* Main dashboard card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-sm">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-400/80" />
                  <div className="size-2.5 rounded-full bg-amber-400/80" />
                  <div className="size-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-lg bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                  <Link2 className="size-3" />
                  app.lumna.co/pagamentos
                </div>
              </div>

              {/* Dashboard content */}
              <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Nova cobrança
                      </p>
                      <p className="font-heading text-lg font-medium">
                        Criar cobrança
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Avulsa
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Cliente
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          ML
                        </div>
                        Maria Lopes
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Valor
                        </label>
                        <div className="rounded-lg border border-border/60 bg-background px-3 py-2 font-mono text-sm">
                          R$ 1.250,00
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Vencimento
                        </label>
                        <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                          15/07/2026
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Descrição
                      </label>
                      <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
                        Consultoria de branding — Junho/2026
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Gerar link de pagamento
                    <ArrowRight className="ml-1.5 size-4" />
                  </Button>
                </div>

                {/* Side panel */}
                <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="font-heading text-sm font-medium">
                    Resumo da cobrança
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-mono font-medium">R$ 1.250,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Taxa Lumna (0,99%)
                      </span>
                      <span className="font-mono text-muted-foreground">
                        R$ 12,38
                      </span>
                    </div>
                    <div className="border-t border-border/60 pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Você recebe</span>
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          R$ 1.237,62
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-emerald/20 bg-emerald/5 dark:bg-emerald/10 rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="size-4" />
                      Pagar antes do vencimento garante o valor integral.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating payment link card */}
            <div className="animate-float absolute top-8 -right-4 hidden w-64 sm:block lg:top-12 lg:-right-16">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card/95 p-4 shadow-xl shadow-primary/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Link2 className="size-3.5 text-primary" />
                  Link de pagamento
                </div>
                <p className="mt-2 truncate font-mono text-xs text-foreground">
                  lumna.co/pay/maria-lopes-2506
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="xs" className="flex-1">
                    <Copy className="mr-1 size-3" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="xs" className="flex-1">
                    <Mail className="mr-1 size-3" />
                    Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating status card */}
            <div className="animate-float animation-delay-300 absolute bottom-12 -left-4 hidden w-52 sm:block lg:bottom-16 lg:-left-16">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card/95 p-3 shadow-xl shadow-primary/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald/10 flex size-8 items-center justify-center rounded-full">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Pagamento confirmado</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      R$ 1.250,00 • há 2 min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
