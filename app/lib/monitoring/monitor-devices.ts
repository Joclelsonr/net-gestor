import { prisma } from "../prisma";
import { checkDevice } from "./check-device";
import { processPendingNotifications } from "./process-pending-notifications";

const FAILURE_THRESHOLD = 3;
const SUCCESS_THRESHOLD = 2;

export async function monitorDevices() {
  const devices = await prisma.devices.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  for (const device of devices) {
    const result = await checkDevice({
      host: device.host,
      port: device.port,
      protocol: device.protocol,
      timeoutMs: device.timeoutMs,
    });

    const now = new Date();

    const failures = result.online ? 0 : device.consecutiveFailures + 1;

    const successes = result.online ? device.consecutiveSuccesses + 1 : 0;

    let newStatus = device.status;

    if (!result.online && failures >= FAILURE_THRESHOLD) {
      newStatus = "OFFLINE";
    }

    if (result.online && successes >= SUCCESS_THRESHOLD) {
      newStatus = "ONLINE";
    }

    const statusChanged = newStatus !== device.status;

    await prisma.$transaction(async (tx) => {
      await tx.devices.update({
        where: { id: device.id },
        data: {
          lastCheckedAt: now,
          lastLatencyMs: result.latencyMs,
          lastError: result.error,
          consecutiveFailures: failures,
          consecutiveSuccesses: successes,
          status: newStatus,
          ...(statusChanged && {
            lastChangeAt: now,
          }),
        },
      });

      // Equipamento acabou de ficar offline.
      if (statusChanged && newStatus === "OFFLINE") {
        await tx.deviceIncident.create({
          data: {
            deviceId: device.id,
            cause: result.error ?? "Equipamento indisponível",
          },
        });
      }

      // Equipamento acabou de se recuperar.
      if (statusChanged && newStatus === "ONLINE") {
        await tx.deviceIncident.updateMany({
          where: {
            deviceId: device.id,
            endedAt: null,
          },
          data: {
            endedAt: now,
          },
        });
      }
    });

    console.log({
      device: device.name,
      status: newStatus,
      latency: result.latencyMs,
      failures,
      successes,
    });
  }

  // Processa notificações pendentes
  await processPendingNotifications();
}
