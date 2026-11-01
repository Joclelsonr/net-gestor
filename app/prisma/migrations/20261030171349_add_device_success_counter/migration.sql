/*
  Warnings:

  - You are about to drop the `Devices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Devices";

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 80,
    "protocol" "DeviceProtocol" NOT NULL DEFAULT 'HTTP',
    "location" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" "DeviceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
    "consecutiveSuccesses" INTEGER NOT NULL DEFAULT 0,
    "timeoutMs" INTEGER NOT NULL DEFAULT 500,
    "lastLatencyMs" INTEGER,
    "lastError" TEXT,
    "createdBy" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "lastChangeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);
