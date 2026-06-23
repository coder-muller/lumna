const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description:
      "Cadastre-se no Lumna em segundos. Criamos uma conta conectada na Stripe Express para você.",
  },
  {
    number: "02",
    title: "Cadastre clientes",
    description:
      "Adicione os dados uma única vez. Use o email cadastrado para enviar links diretamente.",
  },
  {
    number: "03",
    title: "Gere a cobrança",
    description:
      "Informe valor, descrição e prazo. O Lumna cria um link de pagamento seguro via Stripe.",
  },
  {
    number: "04",
    title: "Receba e acompanhe",
    description:
      "O cliente paga, o status atualiza sozinho e você acompanha tudo no painel.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
            Fluxo de trabalho
          </div>
          <h2 className="max-w-xl font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Simples do início ao fim.
          </h2>
        </div>

        <div className="relative">
          {/* Glowing animated line */}
          <div className="absolute top-0 bottom-0 left-[27px] w-px bg-border/50 md:left-1/2 md:-translate-x-1/2">
            <div className="animate-shimmer absolute top-0 left-0 h-1/3 w-full bg-linear-to-b from-transparent via-primary to-transparent opacity-50" />
          </div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-16"
              >
                {/* Left side (empty on odd, content on even) */}
                <div
                  className={`hidden flex-1 md:flex ${index % 2 === 0 ? "justify-end text-right" : "order-3 justify-start text-left"}`}
                >
                  <div className="max-w-xs">
                    <h3 className="mb-2 font-heading text-xl font-medium">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Node */}
                <div
                  className={`relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background bg-muted ${index % 2 !== 0 ? "md:order-2" : ""}`}
                >
                  <div className="flex size-full items-center justify-center rounded-full border border-border/50 bg-background font-mono text-sm text-muted-foreground shadow-sm">
                    {step.number}
                  </div>
                </div>

                {/* Right side (content on odd, empty on even) */}
                <div
                  className={`flex-1 md:hidden ${index % 2 !== 0 ? "md:order-1" : ""}`}
                >
                  <div className="max-w-xs">
                    <h3 className="mb-2 font-heading text-xl font-medium">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Desktop right side */}
                <div
                  className={`hidden flex-1 md:flex ${index % 2 === 0 ? "justify-start text-left" : "order-1 justify-end text-right"}`}
                >
                  <div className="max-w-xs">
                    {index % 2 === 0 ? (
                      <div className="h-32 w-full rounded-xl border border-border/50 bg-card/30" />
                    ) : (
                      <div className="h-32 w-full rounded-xl border border-border/50 bg-card/30" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
