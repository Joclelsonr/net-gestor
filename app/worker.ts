import "dotenv/config";

import { prisma } from "./lib/prisma";
import { monitorDevices } from "./lib/monitoring/monitor-devices";

const INTERVAL = 30_000;

let running = false;
let shuttingDown = false;

async function runMonitor() {
  if (running || shuttingDown) {
    return;
  }

  running = true;

  try {
    console.log("[MONITOR] Iniciando verificação...");

    await monitorDevices();

    console.log("[MONITOR] Verificação concluída.");
  } catch (error) {
    console.error("[MONITOR] Erro:", error);
  } finally {
    running = false;
  }
}

async function shutdown() {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log("[MONITOR] Encerrando worker...");

  while (running) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await prisma.$disconnect();

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function main() {
  console.log("[MONITOR] Worker iniciado.");

  await runMonitor();

  setInterval(runMonitor, INTERVAL);
}

main().catch(async (error) => {
  console.error("[MONITOR] Erro fatal:", error);
  await prisma.$disconnect();
  process.exit(1);
});
