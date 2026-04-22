import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, ExternalLinkIcon } from "lucide-react"

type StripeStatus =
    | "NOT_CONNECTED"
    | "DEFERRED"
    | "ONBOARDING"
    | "CONNECTED"
    | "RESTRICTED"

const FAKE_STRIPE_ACCOUNT = {
    status: "CONNECTED" as StripeStatus,
    stripeAccountId: "acct_1RBcDeFgHiJkLmNo",
    country: "BR",
    defaultCurrency: "BRL",
    chargesEnabled: true,
    payoutsEnabled: true,
    requirementsCurrentlyDueCount: 0,
    requirementsEventuallyDueCount: 2,
    disabledReason: null as string | null,
}

const STATUS_COPY: Record<
    StripeStatus,
    { label: string; description: string }
> = {
    NOT_CONNECTED: {
        label: "Não conectado",
        description: "Nenhuma conta Stripe foi vinculada a este usuário ainda.",
    },
    DEFERRED: {
        label: "Onboarding pendente",
        description:
            "A conta Express foi criada, mas o onboarding hospedado da Stripe ainda não foi concluído.",
    },
    ONBOARDING: {
        label: "Em onboarding",
        description:
            "A Stripe ainda precisa concluir ou revisar informações da conta conectada.",
    },
    CONNECTED: {
        label: "Conectado",
        description:
            "A conta Stripe está vinculada e pronta para seguir com a próxima fase da integração.",
    },
    RESTRICTED: {
        label: "Requer atenção",
        description:
            "A Stripe sinalizou restrições ou requisitos pendentes para a conta conectada.",
    },
}

export function StripeConnectionSection() {
    const account = FAKE_STRIPE_ACCOUNT
    const status = STATUS_COPY[account.status]

    if (account.status === "NOT_CONNECTED") {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Stripe</p>
                    <p className="text-xs text-pretty text-muted-foreground">
                        Conecte uma conta Stripe para começar a aceitar pagamentos.
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">Conta não conectada</p>
                            <p className="text-xs text-muted-foreground">
                                {status.description}
                            </p>
                        </div>
                        <div className="flex justify-start">
                            <Button variant="default" size="sm">
                                Conectar conta Stripe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            {account.status === "CONNECTED" ? (
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Conta Stripe conectada</AlertTitle>
                    <AlertDescription>
                        O onboarding foi concluído e o status da conta foi sincronizado.
                    </AlertDescription>
                </Alert>
            ) : null}

            {account.status === "RESTRICTED" ? (
                <Alert variant="destructive">
                    <AlertTitle>Conta com restrições</AlertTitle>
                    <AlertDescription>
                        {account.disabledReason ||
                            "A Stripe exige uma nova etapa de onboarding para liberar esta conta."}
                    </AlertDescription>
                </Alert>
            ) : null}

            <div className="rounded-lg border p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium">Status da conta</p>
                            <p className="text-xs text-muted-foreground">
                                {status.description}
                            </p>
                        </div>
                        <Badge variant="outline">{status.label}</Badge>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">Account ID</span>
                            <span className="text-sm tabular-nums">
                                {account.stripeAccountId}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">País</span>
                            <span className="text-sm tabular-nums">{account.country}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                                Moeda padrão
                            </span>
                            <span className="text-sm tabular-nums">
                                {account.defaultCurrency}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">Pagamentos</span>
                            <span className="text-sm">
                                {account.chargesEnabled
                                    ? "Habilitados"
                                    : "Aguardando liberação"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">Payouts</span>
                            <span className="text-sm">
                                {account.payoutsEnabled ? "Habilitados" : "Não habilitados"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                                Requisitos atuais
                            </span>
                            <span className="text-sm tabular-nums">
                                {account.requirementsCurrentlyDueCount}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                                Requisitos futuros
                            </span>
                            <span className="text-sm tabular-nums">
                                {account.requirementsEventuallyDueCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {account.status === "CONNECTED" ? (
                <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-balance">
                                Configuração da conexão
                            </h3>
                            <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
                                A conta Express está pronta para acesso ao dashboard da Stripe.
                            </p>
                        </div>

                        <Separator />

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                                <ExternalLinkIcon className="size-4" />
                                Acessar dashboard Stripe
                            </Button>
                            <Button variant="outline" size="sm">
                                Retomar onboarding
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
