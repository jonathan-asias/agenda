#!/usr/bin/env node
/**
 * Purga archivos de instituciones eliminadas cuya retención expiró.
 * Uso: node scripts/purge-expired-institution-archives.mjs
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const result = await prisma.institutionDeletionArchive.deleteMany({
    where: { retention_until: { lt: new Date() } },
  });
  console.log(`Archivos purgados: ${result.count}`);
} catch (err) {
  console.error('Error purgando archivos:', err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
