"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, XIcon } from "lucide-react"

type StripeAccountStatus = "not_connected" | "deferred" | "complete"

function StripeConnectBanner({ status }: { status: StripeAccountStatus }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  const handleClose = () => setIsVisible(false)

  if (status === "not_connected") {
    return (
      <div className="flex w-full items-center justify-between rounded-md border border-border bg-muted p-6 shadow">
        <div className="space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold">
              Comece a gerar cobranças <br className="md:hidden" /> hoje mesmo!
            </h2>
            <p className="text-sm text-muted-foreground">
              Conecte sua conta Stripe para começar a criar cobranças e aceitar
              pagamentos. É rápido, fácil e seguro!
            </p>
          </div>
          <Button className="w-full md:w-auto" variant="default">
            Conectar Stripe Agora
            <ArrowRightIcon />
          </Button>
        </div>
        <XIcon
          className="hidden size-4 cursor-pointer text-muted-foreground md:block"
          onClick={handleClose}
        />
      </div>
    )
  }

  if (status === "deferred") {
    return (
      <div className="flex w-full items-center justify-between rounded-md border border-border bg-muted p-6 shadow">
        <div className="space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold">
              Finalize seu cadastro <br className="md:hidden" /> na Stripe!
            </h2>
            <p className="text-sm text-muted-foreground">
              Sua conta Stripe foi conectada! Agora complete o onboarding para
              desbloquear todos os recursos e começar a receber pagamentos.
            </p>
          </div>
          <Button className="w-full md:w-auto" variant="default">
            Completar Configuração
            <ArrowRightIcon />
          </Button>
        </div>
        <XIcon
          className="hidden size-4 cursor-pointer text-muted-foreground md:block"
          onClick={handleClose}
        />
      </div>
    )
  }

  if (status === "complete") {
    return (
      <div className="flex w-full items-center justify-between rounded-md border border-border bg-muted p-6 shadow">
        <div className="space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold">
              Tudo pronto! <br className="md:hidden" /> Bem-vindo!
            </h2>
            <p className="text-sm text-muted-foreground">
              Sua conta Stripe está totalmente conectada. Você já pode criar
              cobranças e enviar para seus clientes.
            </p>
          </div>
        </div>
        <XIcon
          className="hidden size-4 cursor-pointer text-muted-foreground md:block"
          onClick={handleClose}
        />
      </div>
    )
  }

  return null
}

export default StripeConnectBanner
