"use client"

import { useState } from "react"
import { Check, ArrowRight, Info, Sparkles } from "lucide-react"
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
  const [amount, setAmount] = useState<number | "">(100)

  const numAmount = typeof amount === "number" ? amount : 0
  const lumnaFee = numAmount * 0.0099
  const stripeFee = numAmount > 0 ? numAmount * 0.0399 + 0.5 : 0
  const net = Math.max(0, numAmount - lumnaFee - stripeFee)

  const format = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v)

  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((numAmount - 50) / (10000 - 50)) * 100)
  )

  return (
    <section
      id="preco"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] bg-size-[100px_100px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center sm:mb-24">
          <h2 className="font-heading text-4xl font-medium tracking-tighter text-balance sm:text-5xl md:text-6xl">
            Transparência que <br className="hidden sm:block" />
            <span className="text-muted-foreground">gera confiança.</span>
          </h2>
        </div>

        <div className="grid overflow-hidden rounded-[2.5rem] border border-border/50 shadow-2xl sm:rounded-[3rem] lg:grid-cols-12">
          {/* Left Column: The Pitch & Features (7 cols) */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-card p-8 sm:p-12 md:p-16 lg:col-span-7">
            {/* Background glow */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_top_left,var(--color-primary)_0%,transparent_40%)] opacity-10" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                Taxa da plataforma
              </div>

              <div className="flex items-baseline gap-2 font-heading text-7xl leading-none font-medium tracking-tighter sm:text-8xl md:text-[9rem]">
                0,99
                <span className="text-4xl text-muted-foreground sm:text-5xl md:text-6xl">
                  %
                </span>
              </div>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Por transação concluída. Sem mensalidades, sem taxas de adesão,
                sem surpresas no fim do mês.
              </p>

              <ul className="mt-12 grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-foreground/80"
                  >
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/5">
                      <Check className="size-3 text-foreground" />
                    </div>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: The Interactive Receipt (5 cols) */}
          <div className="relative flex flex-col bg-foreground p-8 text-background sm:p-12 md:p-16 lg:col-span-5">
            {/* Noise texture for premium feel */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              }}
            />

            <div className="relative z-10 grow">
              <label className="mb-4 block font-mono text-xs tracking-widest text-background/75 uppercase">
                Simule seus ganhos
              </label>

              <div className="mb-8 flex items-center gap-2 font-heading text-5xl font-medium tracking-tighter sm:text-6xl">
                <span className="text-background/75">R$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value ? Number(e.target.value) : "")
                  }
                  className="m-0 h-auto w-full border-none bg-transparent p-0 leading-none text-background outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ appearance: "textfield" }}
                  placeholder="0"
                />
              </div>

              {/* Custom Slider */}
              <div className="group relative mb-16 flex h-6 items-center">
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={numAmount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="h-1 w-full overflow-hidden rounded-full bg-background/20">
                  <div
                    className="h-full bg-background transition-all duration-75"
                    style={{ width: `${sliderPercentage}%` }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-background bg-foreground shadow-md transition-all duration-75 group-hover:scale-125"
                  style={{ left: `calc(${sliderPercentage}% - 8px)` }}
                />
              </div>

              {/* Receipt Breakdown */}
              <div className="space-y-5 font-mono text-sm">
                <div className="flex items-end justify-between">
                  <span className="mr-4 grow border-b border-dashed border-background/20 pb-1 text-background/75">
                    Taxa Lumna
                  </span>
                  <span className="text-background/75">{format(lumnaFee)}</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="mr-4 grow border-b border-dashed border-background/20 pb-1 text-background/75">
                    Taxa Stripe
                  </span>
                  <span className="text-background/75">
                    {format(stripeFee)}
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-background/20 pt-6">
                  <span className="font-sans font-medium tracking-wider text-background uppercase">
                    Você recebe
                  </span>
                  <span className="text-3xl font-medium tracking-tight text-emerald-400 sm:text-4xl">
                    {format(net)}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 border-t border-background/10 pt-6">
              <div className="flex items-start gap-3 text-left text-xs text-background/50">
                <Info className="mt-0.5 size-4 shrink-0" />
                <p className="leading-relaxed">
                  Cartões internacionais possuem um adicional de 2% cobrado pela
                  Stripe. Taxa de contestação: R$ 55,00.
                </p>
              </div>

              <Link
                href="/register"
                className="group relative mt-8 inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-background px-8 font-medium text-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
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
    </section>
  )
}
