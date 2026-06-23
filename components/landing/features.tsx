import {
  Link2,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  ArrowUpRight,
} from "lucide-react"

const features = [
  {
    icon: Link2,
    title: "Links instantâneos",
    description:
      "Crie uma cobrança em segundos e receba um link pronto para enviar por WhatsApp ou email.",
    className: "md:col-span-2 md:row-span-2",
    visual: (
      <div className="absolute right-0 bottom-0 flex h-3/4 w-3/4 items-end justify-end rounded-tl-3xl border-t border-l border-primary/10 bg-linear-to-tl from-primary/20 to-transparent p-6">
        <div className="w-full max-w-[200px] rounded-xl border border-border/50 bg-background/80 p-4 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-primary/20">
              <Link2 className="size-3 text-primary" />
            </div>
            <div className="h-2 w-20 rounded bg-muted-foreground/20" />
          </div>
          <div className="flex h-8 w-full items-center rounded-lg border border-primary/20 bg-primary/10 px-3">
            <span className="font-mono text-[10px] text-primary">
              lumna.co/pay/...
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Segurança Stripe",
    description:
      "Pagamentos processados pela Stripe. Sem dor de cabeça com compliance.",
    className: "md:col-span-1 md:row-span-1",
    visual: (
      <div className="absolute -right-4 -bottom-4 size-32 rounded-full bg-emerald-500/10 blur-2xl" />
    ),
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    description: "Histórico completo de cobranças e contatos.",
    className: "md:col-span-1 md:row-span-1",
    visual: (
      <div className="absolute right-4 bottom-4 flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="size-8 rounded-full border-2 border-background bg-muted"
          />
        ))}
      </div>
    ),
  },
  {
    icon: Zap,
    title: "Onboarding diferido",
    description: "Comece a cobrar antes de completar toda a verificação.",
    className: "md:col-span-1 md:row-span-1",
    visual: null,
  },
  {
    icon: Wallet,
    title: "Transparência total",
    description:
      "Veja exatamente quanto pagou de taxa e quanto receberá líquido.",
    className: "md:col-span-2 md:row-span-1",
    visual: (
      <div className="absolute top-0 right-0 flex h-full w-1/2 items-center justify-end bg-linear-to-l from-background to-transparent pr-8">
        <div className="flex flex-col items-end gap-1.5">
          <div className="font-mono text-2xl font-medium text-foreground">
            R$ 100,00
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            - R$ 0,99 (Lumna)
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            - R$ 4,49 (Stripe)
          </div>
          <div className="my-1 h-px w-full bg-border/50" />
          <div className="font-mono text-sm text-emerald-500">R$ 94,52</div>
        </div>
      </div>
    ),
  },
]

export function Features() {
  return (
    <section
      id="funcionalidades"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Tudo que você precisa para <br className="hidden sm:block" />
              <span className="text-muted-foreground">cobrar online.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Uma plataforma enxuta, focada no que importa: criar cobranças,
            enviar links e receber pelo Stripe.
          </p>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 transition-all hover:bg-card/50 ${feature.className}`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm">
                    <feature.icon className="size-5 text-foreground" />
                  </div>
                  <ArrowUpRight className="size-4 translate-x-1 -translate-y-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </div>
                <div className="mt-auto">
                  <h3 className="mb-2 font-heading text-lg font-medium">
                    {feature.title}
                  </h3>
                  <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
              {feature.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
