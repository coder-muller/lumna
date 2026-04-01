"use client"

import Link from "next/link"
import {
  ArrowRight,
  Link2,
  CreditCard,
  Clock,
  Zap,
  Check,
  Star,
  Shield,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

/* ── Animation helpers ── */
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

/* ── Data ── */
const steps = [
  {
    icon: Link2,
    num: "01",
    title: "Conecte o Mercado Pago",
    desc: "Faça login com Google e autorize sua conta MP com um clique. Setup em 30 segundos.",
  },
  {
    icon: CreditCard,
    num: "02",
    title: "Crie uma cobrança",
    desc: "Adicione o cliente, descrição do serviço e valor. Gere um link de pagamento profissional.",
  },
  {
    icon: Clock,
    num: "03",
    title: "Receba na hora",
    desc: "Seu cliente recebe o email, paga pelo MP e o dinheiro vai direto pra sua conta.",
  },
]

const metrics = [
  { value: "3%", label: "por pagamento", sub: "sem mensalidade" },
  { value: "<2min", label: "para criar cobrança", sub: "rápido e direto" },
  { value: "24h", label: "suporte humano", sub: "sempre disponível" },
]

const Landing = () => {
  const prefersReducedMotion = useReducedMotion()
  const currentYear = useSyncExternalStore(
    () => () => {},
    () => String(new Date().getFullYear()),
    () => ""
  )

  const navMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease },
      }

  const heroCopyMotionProps = prefersReducedMotion
    ? {}
    : {
        variants: stagger,
        initial: "hidden" as const,
        animate: "visible" as const,
      }

  const heroMockupMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30, rotateX: 4 },
        animate: { opacity: 1, y: 0, rotateX: 0 },
        transition: { duration: 0.9, ease, delay: 0.3 },
      }

  const notificationMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9, x: 20 },
        animate: { opacity: 1, scale: 1, x: 0 },
        transition: { delay: 1.2, duration: 0.5, ease },
      }

  const inViewMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-60px" },
        variants: stagger,
      }

  const metricsMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-50px" },
        variants: stagger,
      }

  const headingMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-80px" },
        variants: stagger,
      }

  const finalCtaMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true },
        variants: stagger,
      }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* ── Navbar ── */}
      <motion.nav
        {...navMotionProps}
        className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="group">
              <Link href="/sign-in">
                Começar grátis
                <ArrowRight
                  size={14}
                  className="ml-1 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-14">
        {/* Background layers */}
        <div className="bg-dot-grid pointer-events-none absolute inset-0" />
        <div
          className="animate-pulse-glow pointer-events-none absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, color-mix(in oklch, var(--primary) 20%, transparent) 0%, transparent 70%)`,
          }}
        />
        {/* Secondary glow accent */}
        <div
          className="animate-float-delayed pointer-events-none absolute top-[30%] right-[10%] h-75 w-75 rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, color-mix(in oklch, var(--chart-1) 30%, transparent) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Copy */}
            <motion.div
              {...heroCopyMotionProps}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                  <Zap size={12} className="fill-primary" />
                  Grátis para começar
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Cobre seus clientes.{" "}
                <span className="text-gradient-primary">Receba na hora.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg"
              >
                O Lumna conecta sua conta do Mercado Pago e te deixa enviar
                cobranças profissionais por email em menos de 2 minutos. Sem
                burocracia, sem mensalidade.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
              >
                <Button size="lg" asChild className="group">
                  <Link href="/sign-in">
                    Criar conta grátis
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#como-funciona">Ver como funciona</a>
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground lg:justify-start"
              >
                <span className="flex items-center gap-1">
                  <Check size={14} className="text-primary" />
                  Sem cartão de crédito
                </span>
                <span className="flex items-center gap-1">
                  <Check size={14} className="text-primary" />
                  Setup em 30 segundos
                </span>
                <span className="flex items-center gap-1">
                  <Check size={14} className="text-primary" />
                  Cancele quando quiser
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Invoice Mockup */}
            <motion.div
              {...heroMockupMotionProps}
              className="relative hidden lg:block"
            >
              <div className="animate-float">
                <div className="invoice-shadow mx-auto w-full max-w-sm rounded-xl border border-border/50 bg-card p-6">
                  {/* Invoice header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Zap size={14} className="fill-primary text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Lumna
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Cobrança #0042
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-[10px] font-medium text-chart-2">
                      Pendente
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px bg-border/50" />

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Cliente</span>
                      <span className="font-medium text-foreground">
                        Maria Silva
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Serviço</span>
                      <span className="font-medium text-foreground">
                        Design de Logo
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Vencimento</span>
                      <span className="font-medium text-foreground">
                        15/04/2026
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px bg-border/50" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-foreground">
                      R$ 2.500,00
                    </span>
                  </div>

                  {/* Pay button mockup */}
                  <div className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground">
                    Pagar agora
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                {...notificationMotionProps}
                className="glass-card absolute -right-4 -bottom-4 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-chart-1/15">
                    <Check size={14} className="text-chart-2" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      Pagamento recebido!
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      R$ 2.500 · agora mesmo
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Metrics strip ── */}
      <section className="relative border-y border-border/50">
        <div className="divider-glow absolute top-0 right-0 left-0" />
        <div className="mx-auto max-w-5xl px-6 py-12">
          <motion.div
            {...metricsMotionProps}
            className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <p className="text-3xl font-bold text-foreground sm:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground/70">
                  {m.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="divider-glow absolute right-0 bottom-0 left-0" />
      </section>

      {/* ── How it works ── */}
      <section className="relative py-28" id="como-funciona">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative mx-auto max-w-5xl px-6">
          <motion.div {...headingMotionProps} className="text-center">
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase"
            >
              Simples assim
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-bold text-foreground sm:text-4xl"
            >
              Três passos para{" "}
              <span className="text-gradient-primary">receber</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-md text-muted-foreground"
            >
              Sem burocracia. Sem configuração complexa. Conecte, cobre e
              receba.
            </motion.p>
          </motion.div>

          <motion.div
            {...inViewMotionProps}
            className="relative mt-16 grid gap-6 md:grid-cols-3"
          >
            {/* Connector line */}
            <div className="absolute top-12 right-[20%] left-[20%] hidden md:block">
              <div className="h-px w-full bg-linear-to-r from-transparent via-primary/25 to-transparent" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="glass-card group relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Step number */}
                <div className="step-ring mb-5 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 transition-colors group-hover:bg-primary/15">
                  <step.icon
                    size={20}
                    className="text-primary transition-transform group-hover:scale-110"
                  />
                </div>

                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="border-y border-border/50 bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            {...inViewMotionProps}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              {
                icon: Shield,
                title: "Pagamentos seguros",
                desc: "Integração direta com o Mercado Pago. Seus dados e dos seus clientes estão protegidos.",
              },
              {
                icon: Star,
                title: "Cobranças profissionais",
                desc: "Seus clientes recebem emails elegantes com link de pagamento. Passa credibilidade.",
              },
              {
                icon: Zap,
                title: "Receba instantaneamente",
                desc: "Sem esperar dias. O dinheiro cai na sua conta do MP assim que o cliente paga.",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-32">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 50% 70% at 50% 60%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 70%)`,
          }}
        />
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <motion.div {...finalCtaMotionProps}>
            <motion.div variants={fadeUp}>
              <div className="glow-primary mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Zap size={22} className="fill-primary text-primary" />
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mb-4 text-[11px] font-bold tracking-[0.2em] text-primary uppercase"
            >
              Comece agora
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-3xl leading-[1.12] font-bold text-foreground sm:text-5xl"
            >
              Pare de perseguir
              <br />
              pagamentos.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-md text-base text-muted-foreground"
            >
              Junte-se a freelancers que já simplificaram suas cobranças. Crie
              sua conta em 30 segundos — sem cartão de crédito.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <Button size="lg" asChild className="group">
                <Link href="/sign-in">
                  Criar conta grátis
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-xs text-muted-foreground"
            >
              Sem mensalidade · Apenas{" "}
              <strong className="text-foreground">3%</strong> por pagamento
              recebido
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground/60">
              &copy; {currentYear} Lumna. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
