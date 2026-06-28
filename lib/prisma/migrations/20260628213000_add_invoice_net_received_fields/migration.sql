-- AlterTable
ALTER TABLE "invoices" ADD COLUMN "stripeFeeAmount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "invoices" ADD COLUMN "netReceivedAmount" INTEGER;
