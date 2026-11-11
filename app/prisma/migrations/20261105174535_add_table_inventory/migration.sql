/*
  Warnings:

  - You are about to alter the column `price` on the `subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('ROUTER', 'EQUIPAMENT', 'MATERIAL');

-- CreateEnum
CREATE TYPE "InventoryEventKind" AS ENUM ('ADD', 'REMOVE', 'UPDATE');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE', 'RESERVED', 'DAMAGED', 'LOST');

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InventoryCategory" NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "mac" TEXT,
    "serial" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "minimumStock" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "customerId" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_events" (
    "id" TEXT NOT NULL,
    "kind" "InventoryEventKind" NOT NULL,
    "quantityDelta" INTEGER NOT NULL,
    "changes" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "inventory_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
