/*
  Warnings:

  - The values [ADD,REMOVE] on the enum `InventoryEventKind` will be removed. If these variants are still used in the database, this will fail.
  - The values [UNAVAILABLE] on the enum `InventoryStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `inventory_events` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryEventKind_new" AS ENUM ('REGISTER', 'ENTRY', 'ASSIGN', 'RETURN', 'TRANSFER', 'MAINTENANCE', 'MAINTENANCE_RETURN', 'DAMAGE', 'LOSS', 'CONSUMPTION', 'ADJUSTMENT', 'UPDATE');
ALTER TABLE "inventory_events" ALTER COLUMN "kind" TYPE "InventoryEventKind_new" USING ("kind"::text::"InventoryEventKind_new");
ALTER TYPE "InventoryEventKind" RENAME TO "InventoryEventKind_old";
ALTER TYPE "InventoryEventKind_new" RENAME TO "InventoryEventKind";
DROP TYPE "public"."InventoryEventKind_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InventoryStatus_new" AS ENUM ('AVAILABLE', 'ASSIGNED', 'RESERVED', 'MAINTENANCE', 'DAMAGED', 'LOST');
ALTER TABLE "public"."inventory" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inventory" ALTER COLUMN "status" TYPE "InventoryStatus_new" USING ("status"::text::"InventoryStatus_new");
ALTER TYPE "InventoryStatus" RENAME TO "InventoryStatus_old";
ALTER TYPE "InventoryStatus_new" RENAME TO "InventoryStatus";
DROP TYPE "public"."InventoryStatus_old";
ALTER TABLE "inventory" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_events" DROP COLUMN "updatedAt",
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "quantityDelta" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "inventory_events_inventoryId_createdAt_idx" ON "inventory_events"("inventoryId", "createdAt");
