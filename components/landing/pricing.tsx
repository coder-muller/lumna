import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
    <section id="preco" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Preço</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simples e justo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Você só paga quando recebe. Sem surpresas, sem pacotes complexos.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <Card className="relative overflow-hidden border-primary/20 bg-card/60 shadow-xl shadow-primary/5">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary" />
            <CardHeader className="text-center">
              <CardDescription className="text-sm tracking-wider text-muted-foreground uppercase">
                Taxa por transação
              </CardDescription>
              <CardTitle className="mt-2 flex items-baseline justify-center gap-1 font-heading text-6xl font-semibold tracking-tight">
                0,99%
              </CardTitle>
              <CardDescription className="mt-2">
                Sobre o valor de cada pagamento confirmado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Em uma cobrança de{" "}
                  <span className="font-mono font-medium text-foreground">
                    R$ 1.000,00
                  </span>
                </p>
                <div className="mt-2 flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted-foreground">Taxa Lumna</span>
                  <span className="font-mono font-medium text-foreground">
                    R$ 9,90
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted-foreground">Você recebe</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    R$ 990,10
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full" asChild>
                <Link href="/register">Criar conta grátis</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
