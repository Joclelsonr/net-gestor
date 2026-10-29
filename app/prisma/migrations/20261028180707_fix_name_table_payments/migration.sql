/*
  Warnings:

  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_subscriptionId_fkey";

-- DropTable
DROP TABLE "Payments";

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'WAITING',
    "paymentMethod" TEXT NOT NULL,
    "notes" TEXT,
    "createdBy" TEXT,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
