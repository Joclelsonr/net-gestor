"use server";

import { prisma } from "@/lib/prisma";

export async function getClients() {
  // await getSession();

  // await new Promise((resolve) => setTimeout(resolve, 10000));

  const customer = await prisma.customer.findMany({ orderBy: { name: "asc" } });

  return customer;
}
