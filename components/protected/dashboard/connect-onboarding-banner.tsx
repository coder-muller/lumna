import { AlertCircleIcon, CheckCircle2Icon, Clock3Icon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StripeOnboardingButton } from "@/components/protected/stripe/stripe-onboarding-button"
import type { ConnectAccountStatus } from "@/server/stripe/get-connect-account-status"

type ConnectOnboardingBannerProps = {
  account: ConnectAccountStatus
}

const statusContent = {
  DEFERRED: {
    icon: Clock3Icon,
    title: "Conecte sua conta Stripe",
    description:
      "Finalize a conexão para liberar repasses e manter suas cobranças prontas para receber pagamentos.",
    buttonLabel: "Verificar conta",
  },
  IN_PROGRESS: {
    icon: Clock3Icon,
    title: "Verificação da Stripe em andamento",
    description:
      "Continue o cadastro se ainda houver informações pendentes para concluir a conexão.",
    buttonLabel: "Continuar verificação",
  },
  REJECTED: {
    icon: AlertCircleIcon,
    title: "Conta Stripe com restrições",
    description:
      "A Stripe precisa de correções antes de liberar sua conta para operar normalmente.",
    buttonLabel: "Corrigir na Stripe",
  },
  COMPLETE: {
    icon: CheckCircle2Icon,
    title: "Conta Stripe conectada",
    description: "Sua conta Stripe está pronta.",
    buttonLabel: "Conta conectada",
  },
} as const

export function ConnectOnboardingBanner({
  account,
}: ConnectOnboardingBannerProps) {
  if (account.status === "COMPLETE") {
    return null
  }

  const content = statusContent[account.status]
  const Icon = content.icon

  return (
    <Alert className="items-start gap-3 py-4 sm:flex sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 space-y-1">
          <AlertTitle>{content.title}</AlertTitle>
          <AlertDescription>{content.description}</AlertDescription>
        </div>
      </div>
      <StripeOnboardingButton
        className="mt-3 w-full sm:mt-0 sm:w-auto"
        label={content.buttonLabel}
        size="sm"
      />
    </Alert>
  )
}
