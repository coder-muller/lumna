-- CreateEnum
CREATE TYPE "MercadoPagoConnectionStatus" AS ENUM ('DISCONNECTED', 'CONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('DRAFT', 'OPEN', 'PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'AUTHORIZED', 'IN_PROCESS', 'IN_MEDIATION', 'REJECTED', 'CANCELLED', 'REFUNDED', 'CHARGEDBACK');

-- CreateTable
CREATE TABLE "mercado_pago_connections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "MercadoPagoConnectionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "mercadoPagoUserId" TEXT,
    "publicKey" TEXT,
    "liveMode" BOOLEAN NOT NULL DEFAULT false,
    "encryptedAccessToken" TEXT,
    "encryptedRefreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "connectedAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "lastErrorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mercado_pago_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_clients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "mercadoPagoConnectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "externalReference" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "ChargeStatus" NOT NULL DEFAULT 'DRAFT',
    "marketplaceFeeAmount" DECIMAL(12,2),
    "paidAmount" DECIMAL(12,2),
    "gatewayFeeAmount" DECIMAL(12,2),
    "netAmount" DECIMAL(12,2),
    "paidAt" TIMESTAMP(3),
    "mercadoPagoPreferenceId" TEXT,
    "checkoutUrl" TEXT,
    "sandboxCheckoutUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "chargeId" TEXT NOT NULL,
    "mercadoPagoPaymentId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "statusDetail" TEXT,
    "transactionAmount" DECIMAL(12,2),
    "paidAmount" DECIMAL(12,2),
    "marketplaceFeeAmount" DECIMAL(12,2),
    "gatewayFeeAmount" DECIMAL(12,2),
    "netAmount" DECIMAL(12,2),
    "currency" TEXT,
    "paidAt" TIMESTAMP(3),
    "payerEmail" TEXT,
    "paymentMethodId" TEXT,
    "paymentTypeId" TEXT,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mercado_pago_webhook_events" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "action" TEXT,
    "mercadoPagoEventId" TEXT,
    "mercadoPagoResourceId" TEXT,
    "mercadoPagoUserId" TEXT,
    "signature" TEXT,
    "requestBody" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mercado_pago_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mercado_pago_connections_userId_key" ON "mercado_pago_connections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mercado_pago_connections_mercadoPagoUserId_key" ON "mercado_pago_connections"("mercadoPagoUserId");

-- CreateIndex
CREATE INDEX "billing_clients_userId_idx" ON "billing_clients"("userId");

-- CreateIndex
CREATE INDEX "billing_clients_userId_email_idx" ON "billing_clients"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "charges_externalReference_key" ON "charges"("externalReference");

-- CreateIndex
CREATE INDEX "charges_userId_status_idx" ON "charges"("userId", "status");

-- CreateIndex
CREATE INDEX "charges_clientId_idx" ON "charges"("clientId");

-- CreateIndex
CREATE INDEX "charges_mercadoPagoConnectionId_idx" ON "charges"("mercadoPagoConnectionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_mercadoPagoPaymentId_key" ON "payments"("mercadoPagoPaymentId");

-- CreateIndex
CREATE INDEX "payments_chargeId_idx" ON "payments"("chargeId");

-- CreateIndex
CREATE UNIQUE INDEX "mercado_pago_webhook_events_mercadoPagoEventId_key" ON "mercado_pago_webhook_events"("mercadoPagoEventId");

-- CreateIndex
CREATE INDEX "mercado_pago_webhook_events_topic_mercadoPagoResourceId_idx" ON "mercado_pago_webhook_events"("topic", "mercadoPagoResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "mercado_pago_webhook_events_topic_mercadoPagoResourceId_act_key" ON "mercado_pago_webhook_events"("topic", "mercadoPagoResourceId", "action");

-- AddForeignKey
ALTER TABLE "mercado_pago_connections" ADD CONSTRAINT "mercado_pago_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_clients" ADD CONSTRAINT "billing_clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "billing_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_mercadoPagoConnectionId_fkey" FOREIGN KEY ("mercadoPagoConnectionId") REFERENCES "mercado_pago_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "charges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
