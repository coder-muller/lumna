-- Track the environment and buyer return data for each Mercado Pago charge.
CREATE TYPE "CheckoutEnvironment" AS ENUM ('LIVE', 'SANDBOX');

CREATE TYPE "CheckoutReturnStatus" AS ENUM ('SUCCESS', 'PENDING', 'FAILURE');

ALTER TABLE "charges"
ADD COLUMN "checkoutEnvironment" "CheckoutEnvironment" NOT NULL DEFAULT 'SANDBOX',
ADD COLUMN "lastCheckoutReturnStatus" "CheckoutReturnStatus",
ADD COLUMN "lastCheckoutReturnPayload" JSONB,
ADD COLUMN "lastCheckoutReturnAt" TIMESTAMP(3);

UPDATE "charges" AS charge
SET "checkoutEnvironment" = CASE
  WHEN connection."liveMode" THEN 'LIVE'::"CheckoutEnvironment"
  ELSE 'SANDBOX'::"CheckoutEnvironment"
END
FROM "mercado_pago_connections" AS connection
WHERE connection."id" = charge."mercadoPagoConnectionId";
