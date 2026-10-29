-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'ONTIME', 'OVERDUE', 'WAITING');

-- AlterTable
ALTER TABLE "pppoe" ADD COLUMN     "mac" TEXT,
ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "Payments" (
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

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
