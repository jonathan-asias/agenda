import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prismaBypass } from '@/lib/prisma-bypass';
import { getAuthUserEmail, getAuthUserRole } from '@/lib/tenant';
import type { UserRole } from '@/types/auth';

/** Contexto de sede del administrador autenticado. */
export interface SedeScope {
  institutionId: number;
  role: UserRole;
  /** null = sede principal (sin sede física asignada). */
  sedeId: number | null;
  /** Owner de institución: ve todas las sedes. */
  allSedes: boolean;
}

export class SedeAccessDeniedError extends Error {
  constructor() {
    super('Acceso denegado: el recurso pertenece a otra sede');
    this.name = 'SedeAccessDeniedError';
  }
}

export function sedeErrorToResponse(error: unknown): NextResponse | null {
  if (error instanceof SedeAccessDeniedError) {
    return NextResponse.json(
      { error: 'Acceso denegado: el recurso pertenece a otra sede' },
      { status: 403 }
    );
  }
  return null;
}

export async function resolveSedeScope(
  request: NextRequest | undefined,
  institutionId: number
): Promise<SedeScope> {
  const role = await getAuthUserRole(request);

  if (role === 'institucion') {
    return {
      institutionId,
      role: 'institucion',
      sedeId: null,
      allSedes: true,
    };
  }

  if (role === 'admin') {
    const email = await getAuthUserEmail(request);
    if (!email) {
      return {
        institutionId,
        role: 'admin',
        sedeId: null,
        allSedes: false,
      };
    }

    const admin = await prismaBypass.administradores.findUnique({
      where: { correo: email.trim().toLowerCase() },
      select: { sede_id: true, institucion_id: true },
    });

    return {
      institutionId,
      role: 'admin',
      sedeId: admin?.sede_id ?? null,
      allSedes: false,
    };
  }

  return {
    institutionId,
    role: role ?? 'docente',
    sedeId: null,
    allSedes: false,
  };
}

/** Filtro directo por columna sede_id (omitir si owner ve todo). */
export function sedeFilter(scope: SedeScope): { sede_id?: number | null } {
  if (scope.allSedes) return {};
  return { sede_id: scope.sedeId };
}

/** sede_id al crear registros (owner → null / sede principal). */
export function sedeDataForCreate(scope: SedeScope): { sede_id: number | null } {
  if (scope.allSedes) return { sede_id: null };
  return { sede_id: scope.sedeId };
}

export function institutionSedeWhere(
  institutionId: number,
  scope: SedeScope
): { institucion_id: number; sede_id?: number | null } {
  return { institucion_id: institutionId, ...sedeFilter(scope) };
}

export function cursosSedeWhere(
  institutionId: number,
  scope: SedeScope
): { institucion_id: number; sede_id?: number | null } {
  return institutionSedeWhere(institutionId, scope);
}

export function assertRecordBelongsToSede(
  recordSedeId: number | null | undefined,
  scope: SedeScope
): void {
  if (scope.allSedes) return;
  const expected = scope.sedeId ?? null;
  const actual = recordSedeId ?? null;
  if (expected !== actual) {
    throw new SedeAccessDeniedError();
  }
}

/** Filtro para MateriaGrados scoped a la sede del admin. */
export function materiaGradosWhere(
  institutionId: number,
  scope: SedeScope
) {
  if (scope.allSedes) {
    return { materia: { institucion_id: institutionId } };
  }
  return {
    materia: {
      institucion_id: institutionId,
      sede_id: scope.sedeId,
    },
    grado: {
      institucion_id: institutionId,
      sede_id: scope.sedeId,
    },
  };
}
