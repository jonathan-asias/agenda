import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { serverEnv } from '@/lib/env';

const globalForBypass = globalThis as unknown as {
  prismaBypass: PrismaClient | undefined;
};

function createBypassClient(): PrismaClient {
  const connectionString = serverEnv.DATABASE_BYPASS_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_BYPASS_URL no configurada: define DATABASE_URL (postgres pooler) en .env.local'
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log: ['error'] });
}

/** Cliente postgres/pooler para bypass RLS y lookups cross-tenant (auth, reset). */
export const prismaBypass =
  globalForBypass.prismaBypass ?? createBypassClient();

if (process.env.NODE_ENV !== 'production') {
  globalForBypass.prismaBypass = prismaBypass;
}
