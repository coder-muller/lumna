import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const highlights = [
  "Sem mensalidade ou taxa de adesão",
  "Sem limite de cobranças criadas",
  "Clientes ilimitados",
  "Pagamentos via Stripe Checkout",
  "Atualização automática de status",
  "Relatório de transações em tempo real",
]

export function Pricing() {
  return (
    <section id="preco" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Preço simples.{" "}
            <span className="text-muted-foreground">Sem surpresas.</span>
          </h2>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Você só paga quando recebe. Sem pacotes complexos, sem letras
            miúdas.
          </p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          {/* Glow effect behind card */}
          <div className="absolute -inset-1 rounded-[2rem] bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 opacity-50 blur-xl" />

          <div className="relative rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start">
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Taxa única
                </div>
                <div className="flex items-baseline justify-center gap-1 font-heading text-7xl font-medium tracking-tighter sm:justify-start">
                  0,99<span className="text-4xl text-muted-foreground">%</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sobre o valor de cada pagamento confirmado.
                </p>

                <div className="mt-8 rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Cobrança</span>
                    <span className="font-mono">R$ 1.000,00</span>
                  </div>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa Lumna</span>
                    <span className="font-mono text-muted-foreground">
                      - R$ 9,90
                    </span>
                  </div>
                  <div className="mb-3 h-px w-full bg-border/50" />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Você recebe</span>
                    <span className="font-mono text-emerald-500">
                      R$ 990,10
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-border/50 sm:h-auto sm:w-px" />

              <div className="flex h-full flex-1 flex-col justify-between">
                <ul className="space-y-4">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className="group relative mt-8 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-foreground px-8 font-medium text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2">
                    Criar conta grátis
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
