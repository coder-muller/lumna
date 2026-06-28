import { AlertCircleIcon, CheckCircle2Icon, Clock3Icon } from "lucide-react"

import { StripeDashboardButton } from "@/components/protected/stripe/stripe-dashboard-button"
import { StripeOnboardingButton } from "@/components/protected/stripe/stripe-onboarding-button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ConnectAccountStatus } from "@/server/stripe/get-connect-account-status"

type StripeTabProps = {
  account: ConnectAccountStatus
}

const statusContent = {
  DEFERRED: {
    icon: Clock3Icon,
    badge: "Pendente",
    title: "Verificação pendente",
    description:
      "Conecte sua conta Stripe para liberar repasses quando suas cobranças forem pagas.",
    buttonLabel: "Verificar conta",
    badgeVariant: "secondary",
  },
  IN_PROGRESS: {
    icon: Clock3Icon,
    badge: "Em andamento",
    title: "Verificação em andamento",
    description:
      "Continue o cadastro na Stripe se ainda houver informações pendentes.",
    buttonLabel: "Continuar verificação",
    badgeVariant: "outline",
  },
  REJECTED: {
    icon: AlertCircleIcon,
    badge: "Restrita",
    title: "Conta com restrições",
    description:
      "A Stripe precisa de correções antes de liberar sua conta para operar normalmente.",
    buttonLabel: "Corrigir na Stripe",
    badgeVariant: "destructive",
  },
  COMPLETE: {
    icon: CheckCircle2Icon,
    badge: "Conectada",
    title: "Conta conectada",
    description:
      "Sua conta Stripe está pronta para receber pagamentos e fazer repasses.",
    buttonLabel: null,
    badgeVariant: "default",
  },
} as const

export default function StripeTab({ account }: StripeTabProps) {
  const content = statusContent[account.status]
  const Icon = content.icon

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Stripe</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie a conexão usada para receber suas cobranças.
        </p>
      </div>

      <Separator orientation="horizontal" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h2 className="font-medium">Status da conexão</h2>
          <p className="text-sm text-muted-foreground">
            Estado atual da sua conta Connect.
          </p>
        </div>
        <div className="col-span-1 rounded-lg border bg-card p-4 lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{content.title}</h3>
                  <Badge variant={content.badgeVariant}>{content.badge}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {content.description}
                </p>
              </div>
            </div>

            {content.buttonLabel ? (
              <StripeOnboardingButton
                className="w-full sm:w-auto"
                label={content.buttonLabel}
                size="sm"
              />
            ) : null}
          </div>

          {account.status === "COMPLETE" ? (
            <div className="mt-4 border-t pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Acesse o dashboard da Stripe para acompanhar seu saldo,
                  configurar dados bancários e solicitar repasses quando
                  estiverem disponíveis.
                </p>
                <StripeDashboardButton className="w-full sm:w-auto" size="sm" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
