import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Shield,
  TriangleAlert,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react"
import { UserAvatar } from "@/components/protected/user-avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { requireUserId } from "@/lib/auth/functions"
import { formatDateTime } from "@/lib/billing/format"
import { getSettingsData } from "@/lib/billing/data"
import {
  disconnectMercadoPagoAction,
  refreshOpenChargePreferencesAction,
} from "@/lib/billing/actions"
import { cn } from "@/lib/utils"

type SettingsPageProps = {
  searchParams: Promise<{
    tab?: string
    error?: string
    success?: string
  }>
}

const settingsTabs = [
  { value: "perfil", label: "Perfil", icon: UserRound },
  { value: "mercado-pago", label: "Mercado Pago", icon: CreditCard },
  { value: "notificacoes", label: "Notificações", icon: Bell },
  { value: "conta", label: "Conta", icon: Shield },
] as const

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const userId = await requireUserId()
  const params = await searchParams
  const { connection, refreshableChargesCount, user } = await getSettingsData(
    userId
  )
  const activeTab = params.tab ?? "perfil"
  const isConnected = connection?.status === "CONNECTED"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          Configurações
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Ajustes da conta e integração com o Mercado Pago.
        </p>
      </div>

      {/* OAuth feedback alerts */}
      {params.success === "connected" && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Conta conectada com sucesso</AlertTitle>
          <AlertDescription>
            Sua conta do Mercado Pago já pode receber cobranças via Checkout
            Pro.
          </AlertDescription>
        </Alert>
      )}

      {params.success === "preferences-refreshed" && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Links atualizados</AlertTitle>
          <AlertDescription>
            As cobranças em aberto foram atualizadas com as novas URLs públicas
            de retorno e webhook.
          </AlertDescription>
        </Alert>
      )}

      {params.success === "preferences-noop" && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Nenhuma cobrança precisava de atualização</AlertTitle>
          <AlertDescription>
            Não encontramos cobranças abertas ou pendentes sem pagamento
            aprovado para recriar o Checkout Pro.
          </AlertDescription>
        </Alert>
      )}

      {params.error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Falha ao conectar com o Mercado Pago</AlertTitle>
          <AlertDescription>
            {params.error === "state"
              ? "A validação de segurança da conexão expirou. Tente iniciar o fluxo novamente."
              : params.error === "exchange"
                ? "Não foi possível concluir a autorização com o Mercado Pago. Tente novamente."
                : params.error === "different-account"
                  ? "Finalize as cobranças em aberto antes de trocar a conta conectada."
                  : "Não foi possível iniciar a integração. Tente novamente."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Custom nav sidebar */}
        <nav className="flex shrink-0 gap-1 overflow-x-auto sm:w-48 sm:flex-col sm:overflow-x-visible">
          {settingsTabs.map((tab) => {
            const isActive = activeTab === tab.value
            const Icon = tab.icon

            return (
              <Link
                key={tab.value}
                href={`/configuracoes?tab=${tab.value}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-lumna-ultralight font-medium text-lumna"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* Content */}
        <div className="max-w-2xl min-w-0 flex-1">
          {/* Perfil */}
          {activeTab === "perfil" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do perfil</CardTitle>
                <CardDescription>
                  Dados básicos da conta autenticada.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <UserAvatar image={user?.image || undefined} name={user?.name ?? "U"} size="lg" />
                    <div>
                      <p className="text-sm font-semibold">
                        {user?.name || "-"}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {user?.email || "-"}
                        </span>
                        {user?.emailVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-success-light text-success-text"
                          >
                            Verificado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Nome completo
                      </span>
                      <Input
                        defaultValue={user?.name ?? ""}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <Input
                        defaultValue={user?.email ?? ""}
                        readOnly
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Conta criada em
                      </span>
                      <p className="text-sm">
                        {formatDateTime(user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mercado Pago */}
          {activeTab === "mercado-pago" && (
            <>
              {isConnected ? (
                <Card className="border-success/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-success-light">
                        <Wifi className="size-5 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-success-text">
                          Conta Mercado Pago conectada
                        </CardTitle>
                        <CardDescription>
                          Pronto para receber pagamentos via Checkout Pro.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-3 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            Conta MP
                          </span>
                          <span className="font-mono-value tabular-nums">
                            #{connection?.mercadoPagoUserId || "-"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            Ambiente
                          </span>
                          <span>
                            {connection?.liveMode
                              ? "Live (produção)"
                              : "Sandbox (testes)"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            Conectado em
                          </span>
                          <span>{formatDateTime(connection?.connectedAt)}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            Última sincronização
                          </span>
                          <span>
                            {formatDateTime(connection?.lastSyncedAt)}
                          </span>
                        </div>
                      </div>

                      {connection?.lastErrorMessage && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                          Último erro: {connection.lastErrorMessage}
                        </div>
                      )}

                      <Separator />

                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm font-medium">
                          Taxa da plataforma
                        </p>
                        <p className="mt-1 text-xs text-pretty text-muted-foreground">
                          O Lumna retém uma taxa de cada pagamento recebido.
                          Esse valor é descontado automaticamente pelo Mercado
                          Pago.
                        </p>
                      </div>

                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm font-medium">
                          Links antigos do Checkout Pro
                        </p>
                        <p className="mt-1 text-xs text-pretty text-muted-foreground">
                          Recrie as cobranças abertas para aplicar as novas URLs
                          públicas de retorno e webhook assinado.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {refreshableChargesCount} cobrança
                          {refreshableChargesCount !== 1 ? "s" : ""} elegível
                          {refreshableChargesCount !== 1 ? "s" : ""} para
                          atualização.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button asChild>
                          <Link href="/api/mercado-pago/oauth/start">
                            Reconectar
                          </Link>
                        </Button>
                        <form action={refreshOpenChargePreferencesAction}>
                          <Button
                            type="submit"
                            variant="outline"
                            disabled={refreshableChargesCount === 0}
                          >
                            Atualizar cobranças abertas
                          </Button>
                        </form>
                        <form action={disconnectMercadoPagoAction}>
                          <Button
                            type="submit"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Desconectar conta
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                        <WifiOff className="size-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">Conta não conectada</p>
                        <p className="mt-1 text-sm text-pretty text-muted-foreground">
                          Conecte sua conta do Mercado Pago para começar a
                          enviar cobranças via Checkout Pro.
                        </p>
                      </div>
                      <Button asChild className="mt-2">
                        <Link href="/api/mercado-pago/oauth/start">
                          Conectar Mercado Pago
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Notificações */}
          {activeTab === "notificacoes" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de notificação</CardTitle>
                <CardDescription>
                  Configure quando e como você quer ser notificado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {[
                    {
                      title: "Email quando uma cobrança for paga",
                      desc: "Receba uma notificação assim que o pagamento for confirmado.",
                    },
                    {
                      title: "Lembrete de cobranças vencidas",
                      desc: "Receba um aviso quando uma cobrança passar do vencimento.",
                    },
                    {
                      title: "Resumo semanal por email",
                      desc: "Receba um relatório semanal com suas cobranças e pagamentos.",
                    },
                  ].map((item, idx) => (
                    <div key={idx}>
                      {idx > 0 && <Separator />}
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="mt-0.5 text-xs text-pretty text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                        <Badge variant="secondary">Em breve</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conta */}
          {activeTab === "conta" && (
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Zona de perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis sobre sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-pretty text-muted-foreground">
                  Ao excluir sua conta, todos os seus dados, clientes e
                  cobranças serão permanentemente removidos. Essa ação não pode
                  ser desfeita.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled
                >
                  <TriangleAlert data-icon="inline-start" />
                  Excluir conta (em breve)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
