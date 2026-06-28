import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { syncStripeConnectAccount } from "@/server/stripe/connect-account-utils"
import { InvoiceStatus } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"

function getPaymentIntentId(
  paymentIntent: Stripe.Checkout.Session["payment_intent"]
) {
  if (!paymentIntent) {
    return null
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id
}

function getStripeFeeAmount(balanceTransaction: Stripe.BalanceTransaction) {
  const stripeFeeFromDetails = balanceTransaction.fee_details
    .filter((fee) => fee.type === "stripe_fee")
    .reduce((total, fee) => total + fee.amount, 0)

  return stripeFeeFromDetails || balanceTransaction.fee
}

async function getPaymentStripeFeeAmount(paymentIntentId: string | null) {
  if (!paymentIntentId) {
    return 0
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge.balance_transaction"],
  })
  const latestCharge = paymentIntent.latest_charge

  if (!latestCharge || typeof latestCharge === "string") {
    return 0
  }

  const balanceTransaction = latestCharge.balance_transaction

  if (!balanceTransaction || typeof balanceTransaction === "string") {
    return 0
  }

  return getStripeFeeAmount(balanceTransaction)
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const invoice = await prisma.invoices.findUnique({
    where: {
      stripeCheckoutSessionId: session.id,
    },
    select: {
      id: true,
      userId: true,
      status: true,
      value: true,
      platformFeeAmount: true,
    },
  })

  if (!invoice) {
    return
  }

  const paymentIntentId = getPaymentIntentId(session.payment_intent)
  const stripeFeeAmount = await getPaymentStripeFeeAmount(paymentIntentId)
  const netReceivedAmount = Math.max(
    0,
    invoice.value - stripeFeeAmount - invoice.platformFeeAmount
  )

  await prisma.$transaction(async (tx) => {
    const updatedInvoice = await tx.invoices.updateMany({
      where: {
        id: invoice.id,
        status: {
          not: InvoiceStatus.PAID,
        },
      },
      data: {
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId,
        stripeFeeAmount,
        netReceivedAmount,
      },
    })

    if (updatedInvoice.count === 0) {
      return
    }

    await tx.stripeConnectAccount.update({
      where: {
        userId: invoice.userId,
      },
      data: {
        salesCount: {
          increment: 1,
        },
        platformFeesCollected: {
          increment: invoice.platformFeeAmount,
        },
      },
    })
  })
}

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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      await handleCheckoutSessionCompleted(session)
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
