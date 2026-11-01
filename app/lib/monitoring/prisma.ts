import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está definida");
}

const globalForPrisma = globalThis as typeof globalThis & {
  monitoringPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.monitoringPrisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

globalForPrisma.monitoringPrisma = prisma;
