import { CheckCircle2Icon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-card">
          <CheckCircle2Icon className="size-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Pagamento recebido</h1>
          <p className="text-sm text-muted-foreground">
            Seu pagamento foi processado pela Stripe. Você já pode fechar esta
            página.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Voltar para o Lumna</Link>
        </Button>
      </div>
    </main>
  )
}
