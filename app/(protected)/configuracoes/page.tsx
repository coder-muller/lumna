import Link from "next/link"
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Shield,
  TriangleAlert,
  UserRound,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireUserId } from "@/lib/auth/functions"
import { formatDateTime } from "@/lib/billing/format"
import { getSettingsData } from "@/lib/billing/data"
import { disconnectMercadoPagoAction } from "@/lib/billing/actions"

type SettingsPageProps = {
  searchParams: Promise<{
    tab?: string
    error?: string
    success?: string
  }>
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const userId = await requireUserId()
  const params = await searchParams
  const { connection, user } = await getSettingsData(userId)
  const activeTab = params.tab ?? "perfil"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes da conta, integracao e placeholders coerentes para o MVP.
        </p>
      </div>

      {params.success === "connected" ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Conta conectada com sucesso</AlertTitle>
          <AlertDescription>
            Sua conta do Mercado Pago ja pode receber cobrancas via Checkout
            Pro.
          </AlertDescription>
        </Alert>
      ) : null}

      {params.error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Falha ao conectar com o Mercado Pago</AlertTitle>
          <AlertDescription>
            {params.error === "state"
              ? "A validacao de seguranca da conexao expirou. Tente iniciar o fluxo novamente."
              : params.error === "exchange"
                ? "Nao foi possivel concluir a autorizacao com o Mercado Pago. Tente novamente."
                : params.error === "different-account"
                  ? "Finalize as cobrancas em aberto antes de trocar a conta conectada."
                  : "Nao foi possivel iniciar a integracao. Tente novamente."}
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs
        defaultValue={activeTab}
        orientation="vertical"
        className="gap-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)]"
      >
        <TabsList
          variant="line"
          className="w-full flex-col items-stretch justify-start gap-1 rounded-xl border bg-background p-2"
        >
          <TabsTrigger value="perfil">
            <UserRound />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="mercado-pago">
            <CreditCard />
            Mercado Pago
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell />
            Notificacoes
          </TabsTrigger>
          <TabsTrigger value="conta">
            <Shield />
            Conta
          </TabsTrigger>
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Dados basicos da conta autenticada.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Nome: {user?.name || "-"}</p>
                <p>Email: {user?.email || "-"}</p>
                <p>Usuario criado em: {formatDateTime(user?.createdAt)}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mercado-pago">
            <Card>
              <CardHeader>
                <CardTitle>Mercado Pago</CardTitle>
                <CardDescription>
                  Conexao OAuth para operar o Checkout Pro no marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Status: {connection?.status || "DISCONNECTED"}</p>
                <p>
                  Conta MP: {connection?.mercadoPagoUserId || "Nao conectada"}
                </p>
                <p>Public key: {connection?.publicKey || "-"}</p>
                <p>Ambiente: {connection?.liveMode ? "Live" : "Sandbox"}</p>
                <p>Conectado em: {formatDateTime(connection?.connectedAt)}</p>
                <p>
                  Ultima sincronizacao:{" "}
                  {formatDateTime(connection?.lastSyncedAt)}
                </p>
                <p>Ultimo erro: {connection?.lastErrorMessage || "-"}</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href="/api/mercado-pago/oauth/start">
                      {connection?.status === "CONNECTED"
                        ? "Reconectar"
                        : "Conectar"}
                    </Link>
                  </Button>
                  <form action={disconnectMercadoPagoAction}>
                    <Button type="submit" variant="outline">
                      Desconectar localmente
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Notificacoes</CardTitle>
                <CardDescription>
                  Placeholder funcional para o MVP, mantendo coerencia visual.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Alertas por email para pagamentos aprovados.</p>
                <p>Avisos internos para cobrancas expiradas.</p>
                <Button variant="outline" type="button">
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conta">
            <Card>
              <CardHeader>
                <CardTitle>Conta</CardTitle>
                <CardDescription>
                  Acoes institucionais da conta protegida.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Autenticacao principal mantida via Better Auth.</p>
                <p>
                  Revise sessoes e provedores sociais pela camada existente.
                </p>
                <Button variant="outline" type="button">
                  Gerenciar em breve
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
