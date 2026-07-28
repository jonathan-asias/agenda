import { prisma } from '@/lib/prisma';
import { prismaBypass } from '@/lib/prisma-bypass';
import type { Prisma } from '@prisma/client';

async function setSessionConfig(
  tx: Prisma.TransactionClient,
  key: string,
  value: string
): Promise<void> {
  await tx.$executeRaw`SELECT set_config(${key}, ${value}, true)`;
}

/**
 * Ejecuta operaciones con bypass RLS (webhooks, registro público, push, pagos).
 * Requiere migración enable_rls aplicada y rol DB sin BYPASSRLS para tener efecto.
 */
const DEFAULT_TX_OPTIONS = {
  maxWait: 10_000,
  timeout: 20_000,
} as const;

export async function withDbBypass<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prismaBypass.$transaction(async (tx) => {
    await setSessionConfig(tx, 'app.bypass_rls', 'true');
    return fn(tx);
  }, DEFAULT_TX_OPTIONS);
}

/**
 * Ejecuta operaciones scoped al tenant actual (defensa en profundidad DB).
 */
export async function withDbTenant<T>(
  institutionId: number,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await setSessionConfig(tx, 'app.current_institution_id', String(institutionId));
    return fn(tx);
  }, DEFAULT_TX_OPTIONS);
}
