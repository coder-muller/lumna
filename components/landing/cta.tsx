import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-primary-foreground sm:px-16 sm:py-24">
          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-20">
            <div className="absolute top-0 left-1/4 h-64 w-64 -translate-y-1/2 rounded-full bg-white blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 translate-y-1/2 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Pronto para parar de se preocupar com cobranças?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Crie sua conta gratuita e envie seu primeiro link de pagamento em
              poucos minutos.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group px-6"
              >
                <Link href="/register">
                  Começar grátis
                  <ArrowRight className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-primary-foreground/60">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
