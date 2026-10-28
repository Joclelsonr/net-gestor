"use server";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nextDueDate } from "@/lib/billing";
import { getSession } from "@/utils/get-session";

import type {
  Plans,
  Address,
  Customer,
  Subscriptions,
} from "@/generated/prisma/client";
import type { TSubscription } from "../schema";

export async function getCustomerById(
  id: string,
): Promise<Customer & { address: Address[]; subscriptions: Subscriptions[] }> {
  const { user } = await getSession();
  if (!user) return redirect("/login");

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { address: true, subscriptions: true },
  });

  if (!customer) notFound();

  return customer;
}

export async function getPlans(): Promise<Plans[]> {
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
  if (!user) return redirect("/login");

  console.log({
    planId,
    customerId,
    startDate,
    dueDate,
  });

  try {
    const plan = await prisma.plans.findUnique({ where: { id: planId } });
    if (!plan) {
      return { success: false, message: "Plano não encontrado" };
    }

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
