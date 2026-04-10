import Link from "next/link"
import { ArrowLeft, ChevronRight, Mail, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { requireUserId } from "@/lib/auth/functions"
import { getNewChargeData } from "@/lib/billing/data"
import { createChargeAction } from "@/lib/billing/actions"
import { Logo } from "@/components/logo"

export default async function NewChargePage() {
  const userId = await requireUserId()
  const { connection, clients } = await getNewChargeData(userId)

  if (connection?.status !== "CONNECTED") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/cobrancas" className="hover:text-foreground">
            Cobranças
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Nova</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Conecte o Mercado Pago</CardTitle>
            <CardDescription>
              O Checkout Pro precisa de uma conta conectada antes da criação de
              cobranças.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/configuracoes?tab=mercado-pago">
                Ir para configurações
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/cobrancas" className="hover:text-foreground">
          Cobranças
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Nova Cobrança</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          Nova Cobrança
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Crie um link via Checkout Pro e compartilhe com o cliente.
        </p>
      </div>

      <form
        action={createChargeAction}
        className="flex flex-col gap-8 lg:flex-row"
      >
        {/* Form */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Client selection */}
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
              <CardDescription>
                Selecione um cliente existente ou crie um cadastro rápido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="clientId">Cliente existente</FieldLabel>
                  <NativeSelect
                    name="clientId"
                    id="clientId"
                    defaultValue=""
                    className="w-full"
                  >
                    <NativeSelectOption value="">
                      Selecionar cliente
                    </NativeSelectOption>
                    {clients.map((client) => (
                      <NativeSelectOption key={client.id} value={client.id}>
                        {client.name} — {client.email}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <FieldDescription>
                    Ou preencha os campos abaixo para criar um novo.
                  </FieldDescription>
                </Field>

                <FieldSeparator>ou</FieldSeparator>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="quickClientName">
                      Nome do cliente
                    </FieldLabel>
                    <Input
                      id="quickClientName"
                      name="quickClientName"
                      placeholder="Ex.: Maria Oliveira"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="quickClientEmail">
                      Email do cliente
                    </FieldLabel>
                    <Input
                      id="quickClientEmail"
                      name="quickClientEmail"
                      type="email"
                      placeholder="maria@empresa.com"
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Charge details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da cobrança</CardTitle>
              <CardDescription>
                Informações sobre o serviço e valor cobrado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="title">Título</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Consultoria mensal"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="amount">Valor (R$)</FieldLabel>
                    <Input
                      id="amount"
                      name="amount"
                      inputMode="decimal"
                      placeholder="1.500,00"
                      required
                      className="font-mono-value"
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detalhes da cobrança para o cliente"
                    rows={4}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="expiresAt">Vencimento</FieldLabel>
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="date"
                    className="w-full md:w-60"
                  />
                  <FieldDescription>
                    Opcional. Após essa data o link expira automaticamente.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/cobrancas">
                <ArrowLeft data-icon="inline-start" />
                Cancelar
              </Link>
            </Button>
            <Button type="submit">Gerar link de pagamento</Button>
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="hidden lg:block lg:w-[380px]">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Preview do email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  {/* Email header */}
                  <div className="flex items-center gap-3 border-b bg-muted px-5 py-4">
                    <Logo size="sm" />
                    <span className="text-xs text-muted-foreground">
                      Cobrança via Lumna
                    </span>
                  </div>
                  {/* Email body */}
                  <div className="flex flex-col gap-4 p-5">
                    <p className="text-sm text-pretty text-foreground">
                      Olá, você recebeu uma cobrança.
                    </p>

                    <div className="flex flex-col gap-3 rounded-lg bg-muted p-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Serviço</p>
                        <p className="text-sm font-medium">
                          Descrição do serviço
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valor</p>
                        <p className="font-mono-value text-lg font-bold tabular-nums">
                          R$ 0,00
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Vencimento
                        </p>
                        <p className="text-sm">—</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-lumna py-2.5 text-center text-sm font-medium text-primary-foreground">
                      Pagar agora
                    </div>

                    <p className="text-center text-xs text-pretty text-muted-foreground">
                      Pague com Pix, cartão ou boleto via Mercado Pago.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
