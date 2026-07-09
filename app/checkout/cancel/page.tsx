import { CircleAlertIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border bg-card">
          <CircleAlertIcon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Pagamento não concluído</h1>
          <p className="text-sm text-muted-foreground">
            A cobrança continua em aberto. Use o link recebido para tentar pagar
            novamente.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/" />}>
          Voltar para o Lumna
        </Button>
      </div>
    </main>
  )
}
