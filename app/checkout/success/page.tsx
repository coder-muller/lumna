import { CheckCircle2Icon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border bg-card">
          <CheckCircle2Icon className="size-6 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Pagamento recebido</h1>
          <p className="text-sm text-muted-foreground">
            Obrigado! Seu pagamento pode levar alguns instantes para ser
            confirmado. Você já pode fechar esta página.
          </p>
        </div>
        <Button render={<Link href="/" />}>Voltar para o Lumna</Button>
      </div>
    </main>
  )
}
