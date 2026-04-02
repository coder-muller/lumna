import Link from "next/link"
import { ArrowLeft, Mail, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { requireUserId } from "@/lib/auth/functions"
import { getNewChargeData } from "@/lib/billing/data"
import { createChargeAction } from "@/lib/billing/actions"

export default async function NewChargePage() {
  const userId = await requireUserId()
  const { connection, clients } = await getNewChargeData(userId)

  if (connection?.status !== "CONNECTED") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecte o Mercado Pago</CardTitle>
          <CardDescription>
            O Checkout Pro precisa de uma conta conectada antes da criacao de
            cobrancas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/configuracoes?tab=mercado-pago">
              Ir para configuracoes
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/cobrancas">
            <ArrowLeft />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Nova cobranca
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie um link via Checkout Pro e compartilhe com o cliente.
          </p>
        </div>
      </div>

      <form
        action={createChargeAction}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
      >
        <Card>
          <CardHeader>
            <CardTitle>Dados da cobranca</CardTitle>
            <CardDescription>
              Selecione um cliente existente ou crie um cadastro rapido no
              fluxo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Cliente existente
              </label>
              <NativeSelect name="clientId" defaultValue="" className="w-full">
                <NativeSelectOption value="">
                  Selecionar cliente
                </NativeSelectOption>
                {clients.map((client) => (
                  <NativeSelectOption key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome do cliente rapido
              </label>
              <Input name="quickClientName" placeholder="Ex.: Maria Oliveira" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email do cliente rapido
              </label>
              <Input
                name="quickClientEmail"
                type="email"
                placeholder="maria@empresa.com"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Titulo</label>
              <Input name="title" placeholder="Consultoria mensal" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Valor</label>
              <Input
                name="amount"
                inputMode="decimal"
                placeholder="1500,00"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Descricao
              </label>
              <Textarea
                name="description"
                placeholder="Detalhes da cobranca para o cliente"
                rows={5}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Vencimento
              </label>
              <Input name="expiresAt" type="date" />
            </div>
            <div className="flex items-end justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Gerar link de pagamento
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Como o link sera percebido pelo cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Mail className="size-4" />
                Email / mensagem
              </div>
              <p className="text-sm text-muted-foreground">
                Ola, segue o link da sua cobranca com checkout seguro via
                Mercado Pago.
              </p>
              <div className="mt-4 rounded-lg border bg-background px-3 py-2 text-sm">
                https://www.mercadopago.com/checkout/v1/redirect...
              </div>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Receipt className="size-4" />
                Resumo visual
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Cliente selecionado ou criado no envio.</p>
                <p>Link unico com `external_reference` local.</p>
                <p>
                  Webhook atualiza status, valor pago e taxas automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
