import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const cachedPrisma = globalForPrisma.prisma;
const cachedClientHasCmsModels =
  typeof cachedPrisma?.depoimento?.findMany === "function" &&
  typeof cachedPrisma?.cliente?.findMany === "function" &&
  typeof cachedPrisma?.solucao?.findMany === "function" &&
  typeof cachedPrisma?.projeto?.findMany === "function" &&
  typeof cachedPrisma?.configuracao?.findMany === "function";

export const prisma = cachedClientHasCmsModels ? cachedPrisma : new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
