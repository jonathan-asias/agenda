import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { serverEnv } from '@/lib/env';
import {
  extractSupabaseProjectRef,
  normalizePoolerConnectionUrl,
} from '@/lib/db/connection-url';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getTenantConnectionString(): string {
  const raw = serverEnv.DATABASE_URL;
  const ref = extractSupabaseProjectRef(serverEnv.DATABASE_BYPASS_URL);
  return normalizePoolerConnectionUrl(raw, ref);
}

const connectionString = getTenantConnectionString();
const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
