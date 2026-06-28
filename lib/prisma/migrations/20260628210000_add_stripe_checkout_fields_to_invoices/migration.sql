-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "stripeCheckoutSessionId" TEXT;
ALTER TABLE "invoices" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "invoices" ADD COLUMN "stripeCheckoutUrl" TEXT;
ALTER TABLE "invoices" ADD COLUMN "stripeCheckoutExpiresAt" TIMESTAMP(3);
ALTER TABLE "invoices" ADD COLUMN "platformFeeAmount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_stripeCheckoutSessionId_key" ON "invoices"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "invoices_stripeCheckoutSessionId_idx" ON "invoices"("stripeCheckoutSessionId");
