import { prisma } from "../prisma";
import { sendTelegramMessage } from "./telegram";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function formatDate(date: Date): string {
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

export async function processPendingNotifications() {
  const setting = await prisma.monitorSetting.findFirst();

  if (!setting?.telegramChatId) {
    console.warn("Chat ID do Telegram não configurado.");
    return;
  }

  const incidents = await prisma.deviceIncident.findMany({
    where: {
      OR: [
        { endedAt: null, notifiedDown: false },
        { endedAt: { not: null }, notifiedUp: false },
      ],
    },
    include: { device: { select: { name: true } } },
    orderBy: { startedAt: "asc" },
  });

  for (const incident of incidents) {
    const deviceName = escapeHtml(incident.device.name);

    const isRecovery = incident.endedAt !== null;

    const message = isRecovery
      ? [
          "🟢 EQUIPAMENTO RECUPERADO",
          "",
          `📡 Equipamento: ${deviceName}`,
          `🕒 Início da queda: ${formatDate(incident.startedAt)}`,
          `🕒 Recuperação: ${formatDate(incident.endedAt!)}`,
          "",
          "O equipamento voltou a responder normalmente.",
        ].join("\n")
      : [
          "🔴 EQUIPAMENTO OFFLINE",
          "",
          `📡 Equipamento: ${deviceName}`,
          `🕒 Horário: ${formatDate(incident.startedAt)}`,
          `⚠️ Motivo: ${escapeHtml(
            incident.cause ?? "Equipamento indisponível",
          )}`,
          "",
          "O equipamento não está respondendo ao monitoramento.",
        ].join("\n");

    try {
      await sendTelegramMessage(setting.telegramChatId, message);

      await prisma.deviceIncident.update({
        where: { id: incident.id },
        data: isRecovery ? { notifiedUp: true } : { notifiedDown: true },
      });

      console.log(
        `Notificação ${isRecovery ? "de recuperação" : "de queda"} enviada: ${incident.device.name}`,
      );
    } catch (error) {
      console.error(`Erro ao notificar ${incident.device.name}:`, error);
    }
  }
}
