/*
  Warnings:

  - You are about to alter the column `price` on the `plans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `StartDate` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "StartDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
