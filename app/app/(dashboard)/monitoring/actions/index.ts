"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DeviceProtocol } from "@/generated/prisma/enums";

import type { TDevice } from "../schema";
import type { DeviceIncident, Devices } from "@/generated/prisma/client";
import { sendTelegramMessage } from "@/lib/monitoring/telegram";

export async function getDevices(): Promise<Devices[]> {
  //   await new Promise((resolve) => setTimeout(resolve, 10000));

  const device = await prisma.devices.findMany();

  return device;
}

export async function getIncidents(): Promise<
  (DeviceIncident & { device: Devices })[]
> {
  const incidents = await prisma.deviceIncident.findMany({
    include: { device: true },
  });

  return incidents;
}

export async function createDevice(data: TDevice) {
  try {
    await prisma.devices.create({
      data: {
        name: data.name,
        host: data.host,
        protocol: data.protocol as DeviceProtocol,
        location: data.location,
      },
    });

    revalidatePath("/monitoring");

    return { success: true, message: "Equipamento criado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}

export async function createChatTelegram(telegramChatId: string) {
  try {
    await prisma.monitorSetting.create({ data: { telegramChatId } });

    return { success: true, message: "Bot criado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}

export async function sendTestTelegram() {
  const message = `🟢 **TESTE DE NOTIFICAÇÃO**\n\n
Este é um teste de notificação do sistema de monitoramento. Se você recebeu esta mensagem, significa que as notificações estão funcionando corretamente.`;

  try {
    const chatId = await prisma.monitorSetting.findFirst({
      select: { telegramChatId: true },
    });
    if (!chatId?.telegramChatId) {
      return {
        success: false,
        message: "Chat ID do Telegram não configurado.",
      };
    }

    await sendTelegramMessage(chatId!.telegramChatId, message);

    return { success: true, message: "Mensagem enviada com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}
