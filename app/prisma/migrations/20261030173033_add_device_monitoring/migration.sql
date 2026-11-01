-- CreateTable
CREATE TABLE "device_incidents" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "cause" TEXT,
    "notifiedUp" BOOLEAN NOT NULL DEFAULT false,
    "notifiedDown" BOOLEAN NOT NULL DEFAULT false,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "device_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitor_settings" (
    "id" TEXT NOT NULL,
    "telegramChatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitor_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "device_incidents_deviceId_startedAt_idx" ON "device_incidents"("deviceId", "startedAt");

-- AddForeignKey
ALTER TABLE "device_incidents" ADD CONSTRAINT "device_incidents_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
