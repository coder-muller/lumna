import Link from "next/link"
import {
  ArrowRight,
  Copy,
  Link2,
  Sparkles,
  CreditCard,
  ArrowUpRight,
} from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-background pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Abstract Background Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />

        {/* Glowing orbs */}
        <div className="animate-pulse-glow absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.42_0.13_260/0.15),transparent_60%)] blur-3xl" />
        <div className="animate-pulse-glow animation-delay-750 absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.1_175/0.1),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Announcement Pill */}
          <Link
            href="#como-funciona"
            className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-sm font-medium opacity-0 backdrop-blur-md transition-colors hover:bg-muted/50"
          >
            <Sparkles className="size-4 text-primary" />
            <span className="text-muted-foreground">
              O novo padrão para pagamentos online
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center text-foreground">
              Descubra <ArrowRight className="ml-1 size-3" />
            </span>
          </Link>

          {/* Main Heading */}
          <h1 className="animate-fade-in-up animation-delay-150 max-w-5xl font-heading text-5xl leading-[1.1] font-medium tracking-tighter text-balance opacity-0 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Receba por link com a{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                simplicidade
              </span>
              <svg
                className="absolute -bottom-2 left-0 -z-10 h-3 w-full text-primary/40"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            que seu negócio merece.
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-300 mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground opacity-0 sm:text-xl">
            Cadastre clientes, gere cobranças avulsas e envie links de pagamento
            seguros. Processado pela Stripe, sem burocracia e sem taxa mensal.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animation-delay-450 mt-10 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
            <Link
              href="/register"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 flex h-full w-full transform-[skew(-12deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-12deg)_translateX(100%)] group-hover:duration-1000">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="flex items-center gap-2">
                Começar gratuitamente
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-foreground">0,99%</span>
                <span className="text-xs">taxa da plataforma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Interface Representation */}
        <div className="animate-fade-in-up animation-delay-600 relative mx-auto mt-24 max-w-5xl opacity-0">
          <div className="relative rounded-2xl border border-border/50 bg-background/40 p-2 shadow-2xl shadow-black/5 backdrop-blur-xl">
            {/* Inner border for glass effect */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 dark:border-white/5" />

            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80">
              {/* Window Controls */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-muted/20 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-border/80" />
                  <div className="size-2.5 rounded-full bg-border/80" />
                  <div className="size-2.5 rounded-full bg-border/80" />
                </div>
                <div className="mx-auto flex h-6 items-center gap-2 rounded-md border border-border/50 bg-background/50 px-24 text-[10px] font-medium text-muted-foreground shadow-sm">
                  <Link2 className="size-3" />
                  app.lumna.co
                </div>
              </div>

              {/* Minimalist Dashboard UI */}
              <div className="grid min-h-[400px] md:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <div className="hidden flex-col space-y-6 border-r border-border/50 bg-muted/10 p-4 md:flex">
                  <div className="space-y-1">
                    <div className="h-4 w-20 rounded bg-muted-foreground/20" />
                    <div className="h-3 w-12 rounded bg-muted-foreground/10" />
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex h-8 items-center rounded-md px-3 ${i === 2 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                      >
                        <div
                          className={`h-3 w-16 rounded ${i === 2 ? "bg-primary/40" : "bg-muted-foreground/20"}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="relative flex flex-col gap-8 overflow-hidden p-6 md:p-10">
                  {/* Decorative background glow inside the app */}
                  <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <div className="h-8 w-48 rounded-lg bg-foreground/10" />
                      <div className="h-4 w-64 rounded bg-muted-foreground/20" />
                    </div>
                    <div className="flex h-10 w-32 items-center justify-center rounded-full bg-primary/90 shadow-sm">
                      <div className="h-3 w-16 rounded bg-primary-foreground/80" />
                    </div>
                  </div>

                  {/* Payment Cards Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        amount: "R$ 1.250,00",
                        status: "Pago",
                        color:
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      },
                      {
                        amount: "R$ 450,00",
                        status: "Pendente",
                        color:
                          "bg-amber-500/10 text-amber-500 border-amber-500/20",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-5 transition-all hover:bg-muted/50"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <CreditCard className="size-5 text-muted-foreground" />
                          </div>
                          <div
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${item.color}`}
                          >
                            {item.status}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-heading text-2xl font-medium tracking-tight">
                            {item.amount}
                          </div>
                          <div className="h-3 w-24 rounded bg-muted-foreground/20" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Link Card - Linear Style */}
                  <div className="animate-float absolute right-6 bottom-6 shadow-2xl lg:-right-12 lg:bottom-12">
                    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/95 p-3 pr-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Link2 className="size-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">
                          Link gerado com sucesso
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          lumna.co/pay/ml-2506
                        </p>
                      </div>
                      <div className="ml-2 flex size-8 cursor-pointer items-center justify-center rounded-md border border-border/50 bg-muted/50 transition-colors hover:bg-muted">
                        <Copy className="size-3.5 text-muted-foreground" />
                      </div>
                    </div>
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
