"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import type { TPlan } from "../schema";
import type { Plans } from "@/generated/prisma/client";

export async function getPlans(): Promise<Plans[]> {
  //   await new Promise((resolve) => setTimeout(resolve, 10000));

  const plans = await prisma.plans.findMany();

  return plans;
}

export async function createPlan(data: TPlan) {
  try {
    await prisma.plans.create({
      data: {
        name: data.name,
        description: data.description,
        downloadMbps: Number(data.downloadMbps),
        uploadMbps: Number(data.uploadMbps),
        price: Number(data.price),
      },
    });

    revalidatePath("/plan");

    return { success: true, message: "Plano criado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}
