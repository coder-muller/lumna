import { stripe } from "@/lib/stripe"
import { getAppUrl } from "@/server/stripe/connect-account-utils"

type CreateInvoiceCheckoutSessionParams = {
  invoiceId: string
  userId: string
  customerId: string
  customerEmail: string
  title: string
  description: string | null
  value: number
  applicationFeeAmount: number
  stripeAccountId: string
}

export async function createInvoiceCheckoutSession({
  invoiceId,
  userId,
  customerId,
  customerEmail,
  title,
  description,
  value,
  applicationFeeAmount,
  stripeAccountId,
}: CreateInvoiceCheckoutSessionParams) {
  const appUrl = getAppUrl()

  return stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    client_reference_id: invoiceId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: value,
          product_data: {
            name: title,
            description: description ?? undefined,
          },
        },
      },
    ],
    metadata: {
      invoiceId,
      userId,
      customerId,
    },
    payment_intent_data: {
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: stripeAccountId,
      },
      metadata: {
        invoiceId,
        userId,
        customerId,
      },
    },
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel?invoice_id=${invoiceId}`,
  })
}
