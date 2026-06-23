import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bolt, Link2, ShieldCheck, Users, Wallet, Zap } from "lucide-react"

const features = [
  {
    icon: Link2,
    title: "Links de pagamento instantâneos",
    description:
      "Crie uma cobrança em segundos e receba um link pronto para enviar por email, WhatsApp ou onde preferir.",
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    description:
      "Mantenha seus clientes organizados em um só lugar com histórico de cobranças e contatos.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança da Stripe",
    description:
      "Pagamentos processados pela Stripe. Sem armazenar dados de cartão e sem dor de cabeça com compliance.",
  },
  {
    icon: Zap,
    title: "Onboarding diferido",
    description:
      "Comece a cobrar antes de completar toda a verificação. Reduza o atrito e valide seu fluxo rapidamente.",
  },
  {
    icon: Wallet,
    title: "Transparência financeira",
    description:
      "Veja exatamente quanto pagou de taxa e quanto receberá líquido em cada transação.",
  },
  {
    icon: Bolt,
    title: "Atualização automática",
    description:
      "Os status das cobranças são atualizados automaticamente via webhooks assim que o pagamento é confirmado.",
  },
]

export function Features() {
  return (
    <section id="funcionalidades" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Funcionalidades</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tudo que você precisa para cobrar online
          </h2>
          <p className="mt-4 text-muted-foreground">
            Uma plataforma enxuta, focada no que importa: criar cobranças,
            enviar links e receber pelo Stripe.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/60 bg-card/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-4.5" />
                </div>
                <CardTitle className="font-heading text-base">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
