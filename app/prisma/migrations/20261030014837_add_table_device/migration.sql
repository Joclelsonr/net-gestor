-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DeviceProtocol" AS ENUM ('HTTP', 'HTTPS');

-- CreateTable
CREATE TABLE "Devices" (
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
    "lastLatencyMs" INTEGER,
    "lastError" TEXT,
    "createdBy" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "lastChangeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);
