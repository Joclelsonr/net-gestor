"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/utils/get-session";
import { ExpenseCategory } from "@/generated/prisma/client";

import {
  type Customer,
  type Expenses,
  type Payments,
  type Subscriptions,
} from "@/generated/prisma/client";

export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany();

  return customers;
}

export async function getExpenses(): Promise<Expenses[]> {
  const expenses = await prisma.expenses.findMany();
  return expenses;
}

export async function getPayments(): Promise<Payments[]> {
  const payments = await prisma.payments.findMany();
  return payments;
}

export async function getSubscriptions(): Promise<Subscriptions[]> {
  const subscriptions = await prisma.subscriptions.findMany();
  return subscriptions;
}

export async function createExpenses({
  description,
  category,
  amount,
  dueDate,
}: {
  description: string;
  category: string;
  amount: string;
  dueDate: string;
}) {
  const { user } = await getSession();

  try {
    await prisma.expenses.create({
      data: {
        description,
        category: category as ExpenseCategory,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        createdBy: user?.id,
      },
    });

    revalidatePath("/finance");

    return { success: true, message: "Despesa criada com sucesso!" };
  } catch (error) {
    console.error("[CREATE EXPENSES]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível ajustar o estoque.",
    };
  }
}
