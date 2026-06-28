-- CreateEnum
CREATE TYPE "StripeOnboardingStatus" AS ENUM ('DEFERRED', 'IN_PROGRESS', 'COMPLETE', 'REJECTED');

-- CreateTable
CREATE TABLE "StripeConnectAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "status" "StripeOnboardingStatus" NOT NULL DEFAULT 'DEFERRED',
    "chargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pendingEarnings" INTEGER NOT NULL DEFAULT 0,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "platformFeesCollected" INTEGER NOT NULL DEFAULT 0,
    "onboardingPromptShown" BOOLEAN NOT NULL DEFAULT false,
    "onboardingPromptAt" TIMESTAMP(3),
    "onboardingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeConnectAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnectAccount_userId_key" ON "StripeConnectAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeConnectAccount_stripeAccountId_key" ON "StripeConnectAccount"("stripeAccountId");

-- CreateIndex
CREATE INDEX "StripeConnectAccount_stripeAccountId_idx" ON "StripeConnectAccount"("stripeAccountId");

-- CreateIndex
CREATE INDEX "StripeConnectAccount_status_idx" ON "StripeConnectAccount"("status");

-- AddForeignKey
ALTER TABLE "StripeConnectAccount" ADD CONSTRAINT "StripeConnectAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
