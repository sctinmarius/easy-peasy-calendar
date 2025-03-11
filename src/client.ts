import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const isTestEnv = process.env.NODE_ENV === 'test';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: isTestEnv ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
