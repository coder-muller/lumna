import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { syncStripeConnectAccount } from "@/server/stripe/connect-account-utils"

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET não foi definida no .env" },
      { status: 500 }
    )
  }

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura da Stripe ausente" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("[stripe/webhook] assinatura inválida", error)

    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 })
  }

  try {
    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account

      await syncStripeConnectAccount(account)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[stripe/webhook] erro ao processar evento", error)

    return NextResponse.json(
      { error: "Erro interno no webhook" },
      { status: 500 }
    )
  }
}
