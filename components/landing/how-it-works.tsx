import { Badge } from "@/components/ui/badge"

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description:
      "Cadastre-se no Lumna em poucos segundos. Criamos automaticamente uma conta conectada na Stripe Express para você.",
  },
  {
    number: "02",
    title: "Cadastre seus clientes",
    description:
      "Adicione os dados dos seus clientes uma única vez. Use o email cadastrado para enviar os links diretamente.",
  },
  {
    number: "03",
    title: "Gere a cobrança",
    description:
      "Informe valor, descrição e prazo. O Lumna cria um link de pagamento seguro via Stripe Checkout.",
  },
  {
    number: "04",
    title: "Receba e acompanhe",
    description:
      "Seu cliente paga, o status atualiza sozinho e você acompanha tudo no painel — com total transparência de taxas.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="text-xs">
            Como funciona
          </Badge>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Do cadastro ao pagamento em quatro passos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sem integrações complexas, sem burocracia. O fluxo foi desenhado
            para você começar a cobrar no mesmo dia.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute top-8 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-border via-50% to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 mb-5 flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-background font-heading text-xl font-semibold text-primary shadow-sm">
                  {step.number}
                </div>
                <h3 className="font-heading text-lg font-medium">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
