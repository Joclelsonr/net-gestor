"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nextDueDate } from "@/lib/billing";
import { getSession } from "@/utils/get-session";
import { padronizarMac } from "@/lib/inventory-rules";
import { decryptPassword, encryptPassword } from "@/lib/crypto";
import {
  PaymentStatus,
  PaymentMethod,
  InventoryStatus,
  InventoryEventKind,
} from "@/generated/prisma/client";

import {
  type Plans,
  type Pppoe,
  type Address,
  type Customer,
  type Subscriptions,
} from "@/generated/prisma/client";
import type { TSubscription } from "../schema";

export async function getCustomerById(
  id: string,
): Promise<
  (Customer & { address: Address[]; subscriptions: Subscriptions[] }) | null
> {
  await getSession();

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { address: true, subscriptions: true },
  });

  return customer;
}

export async function getPlans(): Promise<Plans[]> {
  await getSession();
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  const plans = await prisma.plans.findMany();

  return plans;
}

export async function addPlan({
  planId,
  customerId,
  startDate,
  dueDate,
}: TSubscription) {
  const { user } = await getSession();

  try {
    const plan = await prisma.plans.findUnique({ where: { id: planId } });
    if (!plan) {
      return { success: false, message: "Plano não encontrado" };
    }

    // Busca a assinatura atual do cliente
    const subscription = await prisma.subscriptions.findFirst({
      where: { customerId },
    });

    // Cliente já possui este plano
    if (subscription && subscription.planId === planId) {
      return {
        success: false,
        message: "Cliente já possui este plano",
      };
    }

    // Cliente possui outro plano -> atualiza
    if (subscription) {
      await prisma.subscriptions.update({
        where: { id: subscription.id },
        data: {
          plan: { connect: { id: plan.id } },
          price: plan.price,
          startDate: new Date(startDate),
          dueDate: nextDueDate(dueDate),
          createdBy: user ? user.id : "",
        },
      });

      revalidatePath(`/customer/${customerId}`);

      return { success: true, message: "Plano atualizado com sucesso" };
    }

    // Cliente não possui plano -> cria
    await prisma.subscriptions.create({
      data: {
        customerId,
        planId: plan.id,
        price: plan.price,
        startDate: new Date(startDate),
        dueDate: nextDueDate(dueDate),
        createdBy: user ? user.id : "",
      },
    });

    revalidatePath(`/customer/${customerId}`);

    return { success: true, message: "Plano adicionado ao cliente" };
  } catch (error) {
    console.error("Erro ao adicionar/atualizar plano:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao adicionar/atualizar plano.",
    };
  }
}

export async function getPppooe(customerId: string): Promise<Pppoe | null> {
  await getSession();

  const pppoe = await prisma.pppoe.findUnique({
    where: { customerId },
  });

  return pppoe;
}

export async function createPppoe(
  customerId: string,
  username: string,
  password: string,
) {
  await getSession();

  const hashPassword = encryptPassword(password);

  try {
    await prisma.pppoe.create({
      data: {
        customerId,
        username,
        hashPassword,
      },
    });

    revalidatePath(`/customer/${customerId}`);

    return { success: true, message: "Usuário e senha criado com sucesso!" };
  } catch (error) {
    console.error("[CREATE PPPOE]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao criar/atualizar usuário e senha.",
    };
  }
}

export async function revealPassword(customerId: string) {
  await getSession();

  const pppoeHashPassword = await prisma.pppoe.findUnique({
    where: { customerId },
    select: { hashPassword: true },
  });

  if (!pppoeHashPassword) return;

  const decrypt = decryptPassword(pppoeHashPassword?.hashPassword);

  return decrypt;
}

export async function createPayment(
  customerId: string,
  description: string,
  amount: string,
  dueDate: Date,
) {
  await getSession();

  try {
    const subscription = await prisma.subscriptions.findFirst({
      where: { customerId },
      select: { id: true },
    });
    if (!subscription) {
      return { success: false, message: "O cliente precisa ter um plano!" };
    }

    await prisma.payments.create({
      data: {
        customerId,
        subscriptionId: subscription?.id,
        description,
        amount: Number(amount),
        dueDate: new Date(dueDate),
      },
    });

    revalidatePath(`/customer/${customerId}`);

    return { success: true, message: "Pagamento criado com sucesso!" };
  } catch (error) {
    console.error("[CREATE PAYMENT]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível criar o pagamento.",
    };
  }
}

export async function getPayments(customerId: string) {
  await getSession();

  const payments = await prisma.payments.findMany({
    where: { customerId },
  });

  return payments;
}

export async function updatePayment(
  paymentId: string,
  status: PaymentStatus,
  paidDate?: Date,
  paymentMethod?: string,
) {
  await getSession();

  try {
    await prisma.payments.update({
      where: { id: paymentId },
      data: {
        paidDate: paidDate ? paidDate : null,
        status: status,
        paymentMethod: paymentMethod as PaymentMethod,
      },
    });

    revalidatePath(`/customer`);

    return { success: true, message: "Pagamento atualizado com sucesso!" };
  } catch (error) {
    console.error("[UPDADE PAYMENT]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o pagamento.",
    };
  }
}

export async function getInventoryCustomerById(customerId: string) {
  const inventoryCustomer = await prisma.inventory.findMany({
    where: { customerId },
  });

  return inventoryCustomer;
}

export async function linkCustomerEquipment(customerId: string, mac: string) {
  try {
    const normalizedMac = padronizarMac(mac);

    if (!customerId || !normalizedMac) {
      return {
        success: false,
        message: "Informe o cliente e o MAC do roteador.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const matches = await tx.inventory.findMany({
        where: {
          mac: normalizedMac,
          category: "ROUTER",
        },
        take: 2,
      });

      if (matches.length === 0) {
        throw new Error("Nenhum roteador encontrado com esse MAC.");
      }

      if (matches.length > 1) {
        throw new Error(
          "Existe mais de um roteador com esse MAC. Verifique o estoque.",
        );
      }

      const inventory = matches[0];

      if (inventory.customerId) {
        throw new Error("Esse roteador já está vinculado a um cliente.");
      }

      if (inventory.status !== InventoryStatus.AVAILABLE) {
        throw new Error("Esse roteador não está disponível para vínculo.");
      }

      // Condição repetida na atualização para proteger contra
      // duas tentativas simultâneas de vincular o mesmo roteador.
      const result = await tx.inventory.updateMany({
        where: {
          id: inventory.id,
          customerId: null,
          status: InventoryStatus.AVAILABLE,
        },
        data: {
          customerId,
          status: InventoryStatus.ASSIGNED,
        },
      });

      if (result.count === 0) {
        throw new Error("O roteador não está mais disponível para vínculo.");
      }

      await tx.inventoryEvents.create({
        data: {
          inventoryId: inventory.id,
          kind: InventoryEventKind.ASSIGN,
          quantityDelta: 0,
          changes: {
            fields: ["customerId", "status"],
            before: {
              customerId: inventory.customerId,
              status: inventory.status,
            },
            after: {
              customerId,
              status: InventoryStatus.ASSIGNED,
            },
          },
        },
      });
    });

    // revalidatePath("/stock");
    revalidatePath(`/customer/${customerId}`);

    return {
      success: true,
      message: "Roteador vinculado ao cliente com sucesso!",
    };
  } catch (error) {
    console.error("[LINK CUSTOMER EQUIPMENT]", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível vincular o roteador.",
    };
  }
}

export async function unlinkCustomerEquipment(
  customerId: string,
  inventoryId: string,
) {
  try {
    if (!customerId || !inventoryId) {
      return {
        success: false,
        message: "Dados do cliente ou equipamento inválidos.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findFirst({
        where: {
          id: inventoryId,
          customerId,
          category: "ROUTER",
        },
      });

      if (!inventory) {
        throw new Error("Esse roteador não está vinculado a este cliente.");
      }

      const result = await tx.inventory.updateMany({
        where: {
          id: inventoryId,
          customerId,
          status: InventoryStatus.ASSIGNED,
        },
        data: {
          customerId: null,
          status: InventoryStatus.AVAILABLE,
        },
      });

      if (result.count === 0) {
        throw new Error(
          "Não foi possível devolver o roteador. Atualize a página e tente novamente.",
        );
      }

      await tx.inventoryEvents.create({
        data: {
          inventoryId,
          kind: InventoryEventKind.RETURN,
          quantityDelta: 0,
          changes: {
            fields: ["customerId", "status"],
            before: {
              customerId: inventory.customerId,
              status: inventory.status,
            },
            after: {
              customerId: null,
              status: InventoryStatus.AVAILABLE,
            },
          },
        },
      });
    });

    // revalidatePath("/stock");
    revalidatePath(`/customer/${customerId}`);

    return {
      success: true,
      message: "Roteador devolvido ao estoque com sucesso!",
    };
  } catch (error) {
    console.error("[UNLINK CUSTOMER EQUIPMENT]", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível devolver o roteador.",
    };
  }
}
