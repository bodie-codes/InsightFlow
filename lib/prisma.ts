import { PrismaClient } from "@prisma/client";

// One shared database client for the whole app.
// In development, Next.js reloads files often, so we keep the client
// on globalThis to avoid opening a new connection on every reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}