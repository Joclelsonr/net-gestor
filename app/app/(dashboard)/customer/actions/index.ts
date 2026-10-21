"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/utils/get-session";

export async function getClients() {
  const { user } = await getSession();
  if (!user) return redirect("/login");

  // await new Promise((resolve) => setTimeout(resolve, 10000));

  const customer = await prisma.customer.findMany({ orderBy: { name: "asc" } });

  return customer;
}
