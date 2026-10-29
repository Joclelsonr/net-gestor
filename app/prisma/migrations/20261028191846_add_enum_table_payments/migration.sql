/*
  Warnings:

  - The `paymentMethod` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX', 'BANK_TRANSFER', 'BANK_SLIP');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PIX';
