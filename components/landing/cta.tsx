import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-background px-6 py-20 text-center shadow-2xl sm:px-16 sm:py-28">
          {/* Abstract background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] bg-size-[24px_24px]" />
            <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.42_0.13_260/0.1),transparent_70%)] blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-heading text-4xl font-medium tracking-tighter text-balance sm:text-5xl md:text-6xl">
              Pronto para parar de se preocupar com cobranças?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Crie sua conta em segundos e envie seu primeiro link de pagamento
              hoje mesmo.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-foreground px-8 font-medium text-background transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <span className="flex items-center gap-2 text-base">
                  Começar gratuitamente
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-border/50 bg-muted/30 px-8 font-medium text-foreground transition-colors hover:bg-muted/50 sm:w-auto"
              >
                Já tenho conta
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Sem cartão de crédito. Sem taxas escondidas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
