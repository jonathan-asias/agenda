import type { Prisma } from '@prisma/client';
import {
  INSTITUTION_SNAPSHOT_VERSION,
  computeArchiveRetentionUntil,
} from '@/lib/institution/archive-retention';

const REDACTED_KEYS = new Set(['password', 'p256dh', 'auth']);

/** Convierte el árbol a JSON seguro (fechas ISO, sin contraseñas ni claves push). */
export function sanitizeInstitutionSnapshot(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (key, val) => {
      if (REDACTED_KEYS.has(key)) {
        return '[REDACTED]';
      }
      return val;
    })
  );
}

export interface InstitutionDeletionSnapshot {
  schemaVersion: number;
  archivedAt: string;
  institucion: unknown;
  sedes: unknown[];
  administradores: unknown[];
  grados: unknown[];
  cursos: unknown[];
  areas: unknown[];
  materias: unknown[];
  materiaGrados: unknown[];
  docentes: unknown[];
  docenteAsignaciones: unknown[];
  estudiantes: unknown[];
  acudientes: unknown[];
  recordatorios: unknown[];
  recordatorioEstudiantes: unknown[];
  pushSubscriptions: unknown[];
  pagos: unknown[];
  suscripciones: unknown[];
  counts: Record<string, number>;
}

export async function buildInstitutionDeletionSnapshot(
  tx: Prisma.TransactionClient,
  institucionId: number
): Promise<InstitutionDeletionSnapshot> {
  const institucion = await tx.instituciones.findUnique({
    where: { id: institucionId },
    include: {
      plan: true,
      suscripcion: { include: { plan: true } },
    },
  });

  if (!institucion) {
    throw new Error('Institución no encontrada');
  }

  const email = institucion.email.trim().toLowerCase();

  const [
    sedes,
    administradores,
    grados,
    cursos,
    areas,
    materias,
    docentes,
    estudiantes,
    acudientes,
    pushSubscriptions,
    materiaGrados,
    docenteAsignaciones,
    recordatorios,
    pagos,
    suscripciones,
  ] = await Promise.all([
    tx.sedes.findMany({ where: { institucion_id: institucionId } }),
    tx.administradores.findMany({ where: { institucion_id: institucionId } }),
    tx.grados.findMany({ where: { institucion_id: institucionId } }),
    tx.cursos.findMany({ where: { institucion_id: institucionId } }),
    tx.areas.findMany({ where: { institucion_id: institucionId } }),
    tx.materias.findMany({ where: { institucion_id: institucionId } }),
    tx.docentes.findMany({ where: { institucion_id: institucionId } }),
    tx.estudiantes.findMany({ where: { institucion_id: institucionId } }),
    tx.acudientes.findMany({ where: { institucion_id: institucionId } }),
    tx.pushSubscriptions.findMany({ where: { institucion_id: institucionId } }),
    tx.materiaGrados.findMany({
      where: { grado: { institucion_id: institucionId } },
    }),
    tx.docenteAsignaciones.findMany({
      where: { docente: { institucion_id: institucionId } },
    }),
    tx.recordatorios.findMany({
      where: { docente: { institucion_id: institucionId } },
    }),
    tx.pago.findMany({ where: { email } }),
    tx.suscripcion.findMany({ where: { email } }),
  ]);

  const recordatorioIds = recordatorios.map((r) => r.id);
  const recordatorioEstudiantes =
    recordatorioIds.length > 0
      ? await tx.recordatorioEstudiantes.findMany({
          where: { recordatorio_id: { in: recordatorioIds } },
        })
      : [];

  const raw: InstitutionDeletionSnapshot = {
    schemaVersion: INSTITUTION_SNAPSHOT_VERSION,
    archivedAt: new Date().toISOString(),
    institucion,
    sedes,
    administradores,
    grados,
    cursos,
    areas,
    materias,
    materiaGrados,
    docentes,
    docenteAsignaciones,
    estudiantes,
    acudientes,
    recordatorios,
    recordatorioEstudiantes,
    pushSubscriptions,
    pagos,
    suscripciones,
    counts: {
      sedes: sedes.length,
      administradores: administradores.length,
      grados: grados.length,
      cursos: cursos.length,
      areas: areas.length,
      materias: materias.length,
      docentes: docentes.length,
      estudiantes: estudiantes.length,
      acudientes: acudientes.length,
      recordatorios: recordatorios.length,
      pagos: pagos.length,
      suscripciones: suscripciones.length,
    },
  };

  return sanitizeInstitutionSnapshot(raw) as InstitutionDeletionSnapshot;
}

export async function saveInstitutionDeletionArchive(
  tx: Prisma.TransactionClient,
  params: {
    institucionId: number;
    nombre: string;
    email: string;
    nit: string;
    deletedBy: string;
    reason?: string;
    snapshot: InstitutionDeletionSnapshot;
    authUserIds: string[];
  }
): Promise<string> {
  const deletedAt = new Date();
  const archive = await tx.institutionDeletionArchive.create({
    data: {
      institucion_id: params.institucionId,
      nombre: params.nombre,
      email: params.email.trim().toLowerCase(),
      nit: params.nit,
      deleted_by: params.deletedBy.trim().toLowerCase(),
      reason: params.reason ?? 'user_request',
      snapshot_version: INSTITUTION_SNAPSHOT_VERSION,
      snapshot: params.snapshot as unknown as Prisma.InputJsonValue,
      auth_user_ids: params.authUserIds,
      deleted_at: deletedAt,
      retention_until: computeArchiveRetentionUntil(deletedAt),
    },
    select: { id: true },
  });

  return archive.id;
}

/** Elimina archivos cuya retención expiró. Ejecutar periódicamente (cron/script). */
export async function purgeExpiredInstitutionArchives(
  tx: Prisma.TransactionClient
): Promise<number> {
  const result = await tx.institutionDeletionArchive.deleteMany({
    where: { retention_until: { lt: new Date() } },
  });
  return result.count;
}
