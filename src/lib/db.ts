import { PrismaClient } from "@prisma/client";

// Singleton: evita esgotar conexoes no hot-reload do Next em dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
