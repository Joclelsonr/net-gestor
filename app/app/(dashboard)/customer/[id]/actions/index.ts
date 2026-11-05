"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nextDueDate } from "@/lib/billing";
import { getSession } from "@/utils/get-session";
import { decryptPassword, encryptPassword } from "@/lib/crypto";
import { PaymentMethod, PaymentStatus } from "@/generated/prisma/client";

import {
  // type Plans,
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

export async function getPlans() {
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

    const subscription = await prisma.subscriptions.findFirst({
      where: { customerId, planId },
    });
    if (subscription) {
      return { success: false, message: "Cliente já possui este plano" };
    }

    // atualização de plano
    // if (subscription && subscription.planId !== planId) {
    //   console.log("atualização de plano", subscription, planId);
    //   await prisma.subscriptions.update({
    //     where: { id: subscription.id },
    //     data: {
    //       planId: plan.id,
    //       price: plan.price,
    //       startDate: new Date(startDate),
    //       dueDate: nextDueDate(dueDate),
    //     },
    //   });
    //   return { success: true, message: "Plano atualizado com sucesso" };
    // }

    await prisma.subscriptions.create({
      data: {
        customerId,
        planId: plan.id,
        price: plan.price,
        startDate: new Date(startDate),
        dueDate: nextDueDate(dueDate),
        createdBy: user.id,
      },
    });

    revalidatePath(`/customer/${customerId}`);

    return { success: true, message: "Plano adicionado ao cliente" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
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
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
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
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
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
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}
