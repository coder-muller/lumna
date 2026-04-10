import { CheckCircle2, Clock3, Receipt, TriangleAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  recordChargeCheckoutReturn,
  getCheckoutReturnContent,
  type CheckoutReturnSearchParams,
} from "@/lib/billing/checkout-return"
import { formatCurrency } from "@/lib/billing/format"
import { Logo } from "@/components/logo"

type CheckoutReturnPageProps = {
  params: Promise<{
    chargeId: string
  }>
  searchParams: Promise<CheckoutReturnSearchParams>
}

function ToneIcon({ tone }: { tone: "success" | "warning" | "danger" }) {
  if (tone === "success") {
    return <CheckCircle2 className="size-5 text-success" />
  }

  if (tone === "warning") {
    return <Clock3 className="size-5 text-warning-text" />
  }

  return <TriangleAlert className="size-5 text-destructive" />
}

export default async function CheckoutReturnPage({
  params,
  searchParams,
}: CheckoutReturnPageProps) {
  const [{ chargeId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  const { charge, checkout, syncError } = await recordChargeCheckoutReturn({
    chargeId,
    searchParams: resolvedSearchParams,
  })

  if (!charge) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center text-center">
            <Logo size="sm" />
            <CardTitle>Link de pagamento inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Não encontramos a cobrança associada a este retorno do Checkout Pro.
          </CardContent>
        </Card>
      </main>
    )
  }

  const content = getCheckoutReturnContent(checkout, syncError)

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-4 border-b bg-background/80 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <Logo size="sm" />
          </div>
          <div className="mx-auto flex items-center gap-2">
            <ToneIcon tone={content.tone} />
            <CardTitle>{content.title}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">{content.description}</p>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-muted p-2">
                <Receipt className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium">{charge.title}</p>
                <p className="text-sm text-muted-foreground">
                  Cliente: {charge.client.name}
                </p>
                <p className="font-mono-value text-lg font-semibold tabular-nums">
                  {formatCurrency(charge.amount.toString())}
                </p>
              </div>
            </div>
          </div>

          {syncError && (
            <div className="rounded-lg border border-warning-text/20 bg-warning-light p-4 text-sm text-warning-text">
              Recebemos o retorno, mas a confirmação automática ainda não foi
              concluída. O estabelecimento continuará sincronizando esta
              cobrança.
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Você já pode fechar esta aba. O status será confirmado pelo
            estabelecimento automaticamente.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
