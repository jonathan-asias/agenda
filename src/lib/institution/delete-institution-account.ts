import type { Prisma } from '@prisma/client';
import { withDbBypass } from '@/lib/db/rls-context';
import { resolveSupabaseUserIdForReset } from '@/lib/auth/resolveSupabaseUserId';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import {
  buildInstitutionDeletionSnapshot,
  saveInstitutionDeletionArchive,
} from '@/lib/institution/archive-institution-snapshot';
import { computeArchiveRetentionUntil } from '@/lib/institution/archive-retention';

export interface DeleteInstitutionAccountOptions {
  deletedBy?: string;
  reason?: string;
}

export interface DeleteInstitutionAccountResult {
  institucionId: number;
  email: string;
  archiveId: string;
  retentionUntil: string;
  authUsersDeleted: number;
  authUsersFailed: number;
  storageCleanupAttempted: boolean;
}

async function collectAuthUserIds(params: {
  institucionEmail: string;
  administradores: Array<{ correo: string; supabase_user_id: string | null }>;
  docentes: Array<{ email: string; auth_user_id: string | null }>;
}): Promise<string[]> {
  const ids = new Set<string>();

  const institutionAuthId = await resolveSupabaseUserIdForReset(
    params.institucionEmail,
    'institucion'
  );
  if (institutionAuthId) ids.add(institutionAuthId);

  for (const admin of params.administradores) {
    if (admin.supabase_user_id) {
      ids.add(admin.supabase_user_id);
      continue;
    }
    const authId = await resolveSupabaseUserIdForReset(admin.correo, 'administrador');
    if (authId) ids.add(authId);
  }

  for (const docente of params.docentes) {
    if (docente.auth_user_id) {
      ids.add(docente.auth_user_id);
      continue;
    }
    const authId = await resolveSupabaseUserIdForReset(docente.email, 'docente');
    if (authId) ids.add(authId);
  }

  return Array.from(ids);
}

async function deleteAuthUsers(userIds: string[]): Promise<{
  deleted: number;
  failed: number;
}> {
  if (userIds.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  if (!isSupabaseAdminConfigured()) {
    console.warn('Supabase admin no configurado; usuarios Auth no eliminados:', userIds.length);
    return { deleted: 0, failed: userIds.length };
  }

  const supabase = getSupabaseAdminClient();
  let deleted = 0;
  let failed = 0;

  for (const userId of userIds) {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) {
        console.error('Error eliminando usuario Auth:', userId, error.message);
        failed += 1;
      } else {
        deleted += 1;
      }
    } catch (err) {
      console.error('Error eliminando usuario Auth:', userId, err);
      failed += 1;
    }
  }

  return { deleted, failed };
}

async function deleteInstitutionStorageAssets(institucionId: number): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;

  try {
    const supabase = getSupabaseAdminClient();
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'instituciones';
    const prefix = `instituciones/${institucionId}`;

    const { data: files, error: listError } = await supabase.storage.from(bucket).list(prefix);
    if (listError) {
      console.warn('No se pudo listar archivos de storage:', listError.message);
      return false;
    }

    if (!files?.length) return true;

    const paths = files.map((file) => `${prefix}/${file.name}`);
    const { error: removeError } = await supabase.storage.from(bucket).remove(paths);
    if (removeError) {
      console.warn('No se pudieron eliminar archivos de storage:', removeError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Error limpiando storage de institución:', err);
    return false;
  }
}

async function deleteInstitutionData(
  tx: Prisma.TransactionClient,
  institucionId: number,
  institucionEmail: string
): Promise<void> {
  const email = institucionEmail.trim().toLowerCase();

  const [administradores, docentes] = await Promise.all([
    tx.administradores.findMany({
      where: { institucion_id: institucionId },
      select: { correo: true },
    }),
    tx.docentes.findMany({
      where: { institucion_id: institucionId },
      select: { email: true },
    }),
  ]);

  const institucion = await tx.instituciones.findUnique({
    where: { id: institucionId },
    select: { suscripcion_id: true },
  });

  if (!institucion) {
    throw new Error('Institución no encontrada');
  }

  const suscripcionId = institucion.suscripcion_id;

  const relatedEmails = new Set<string>([email]);
  for (const admin of administradores) {
    relatedEmails.add(admin.correo.trim().toLowerCase());
  }
  for (const docente of docentes) {
    relatedEmails.add(docente.email.trim().toLowerCase());
  }

  await tx.instituciones.update({
    where: { id: institucionId },
    data: { suscripcion_id: null },
  });

  if (suscripcionId) {
    await tx.suscripcion.updateMany({
      where: { id: suscripcionId },
      data: { institucion_id: null },
    });
  }

  await tx.pago.deleteMany({ where: { email } });

  await tx.passwordResetTokens.deleteMany({
    where: { email: { in: Array.from(relatedEmails) } },
  });

  await tx.instituciones.delete({ where: { id: institucionId } });

  await tx.suscripcion.deleteMany({
    where: {
      OR: [{ email }, ...(suscripcionId ? [{ id: suscripcionId }] : [])],
    },
  });
}

/** Archiva en JSONB, elimina la institución, usuarios Auth y archivos de branding. */
export async function deleteInstitutionAccount(
  institucionId: number,
  options: DeleteInstitutionAccountOptions = {}
): Promise<DeleteInstitutionAccountResult> {
  const pre = await withDbBypass(async (tx) =>
    tx.instituciones.findUnique({
      where: { id: institucionId },
      select: {
        email: true,
        nombre: true,
        nit: true,
        administradores: {
          select: { correo: true, supabase_user_id: true },
        },
        docentes: {
          select: { email: true, auth_user_id: true },
        },
      },
    })
  );

  if (!pre) {
    throw new Error('Institución no encontrada');
  }

  const authUserIds = await collectAuthUserIds({
    institucionEmail: pre.email,
    administradores: pre.administradores,
    docentes: pre.docentes,
  });

  const deletedBy = options.deletedBy?.trim().toLowerCase() || pre.email.trim().toLowerCase();
  const retentionUntil = computeArchiveRetentionUntil().toISOString();

  const { email, archiveId } = await withDbBypass(async (tx) => {
    const snapshot = await buildInstitutionDeletionSnapshot(tx, institucionId);

    const archiveId = await saveInstitutionDeletionArchive(tx, {
      institucionId,
      nombre: pre.nombre,
      email: pre.email,
      nit: pre.nit,
      deletedBy,
      reason: options.reason,
      snapshot,
      authUserIds,
    });

    await deleteInstitutionData(tx, institucionId, pre.email);

    return {
      email: pre.email.trim().toLowerCase(),
      archiveId,
    };
  });

  const authResult = await deleteAuthUsers(authUserIds);
  const storageCleanupAttempted = await deleteInstitutionStorageAssets(institucionId);

  return {
    institucionId,
    email,
    archiveId,
    retentionUntil,
    authUsersDeleted: authResult.deleted,
    authUsersFailed: authResult.failed,
    storageCleanupAttempted,
  };
}
