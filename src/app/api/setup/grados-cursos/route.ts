import { NextRequest, NextResponse } from 'next/server';
import type { Cursos, Grados } from '@prisma/client';
import {
  GRADOS_PREDETERMINADOS,
} from '@/lib/grados-predeterminados';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  cursosSedeWhere,
  institutionSedeWhere,
  sedeDataForCreate,
  sedeErrorToResponse,
} from '@/lib/sede-scope';

type CursoInput = {
  nombre: string;
};

type GradoCursoInput = {
  grado_id: number;
  cursos: CursoInput[];
};

export async function POST(request: NextRequest) {
  try {
    const { institucionId, gradosCursos } = await request.json() as {
      institucionId: number;
      gradosCursos: GradoCursoInput[];
    };

    if (!institucionId || !gradosCursos || !Array.isArray(gradosCursos)) {
      return NextResponse.json(
        { error: 'institucionId y gradosCursos son requeridos' },
        { status: 400 }
      );
    }

    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
      const institucion = await tx.instituciones.findUnique({
        where: { id: institucionId }
      });

      if (!institucion) {
        return NextResponse.json(
          { error: 'Institución no encontrada' },
          { status: 404 }
        );
      }

      enforceTenant(institutionId, institucionId);

      const sedeData = sedeDataForCreate(scope);
      const cursoWhere = cursosSedeWhere(institucionId, scope);
      const gradoWhere = institutionSedeWhere(institucionId, scope);

      const nombresCursos = gradosCursos
        .flatMap(gradoCurso => gradoCurso.cursos.map(curso => curso.nombre?.trim()))
        .filter((nombre): nombre is string => Boolean(nombre));

      const nombresNormalizados = nombresCursos.map(nombre => nombre.toLowerCase());
      const duplicadosEnPayload = nombresCursos.filter((nombre, index) => {
        return nombresNormalizados.indexOf(nombre.toLowerCase()) !== index;
      });

      if (duplicadosEnPayload.length > 0) {
        return NextResponse.json(
          {
            error: 'Ya existen cursos duplicados en la lista enviada',
            duplicateNames: Array.from(new Set(duplicadosEnPayload))
          },
          { status: 409 }
        );
      }

      if (nombresCursos.length > 0) {
        const cursosExistentes = await tx.cursos.findMany({
          where: {
            ...cursoWhere,
            OR: nombresCursos.map(nombre => ({
              nombre: { equals: nombre, mode: 'insensitive' }
            }))
          },
          select: { nombre: true }
        });

        if (cursosExistentes.length > 0) {
          const duplicateNames = Array.from(
            new Set(cursosExistentes.map(curso => curso.nombre))
          );
          return NextResponse.json(
            {
              error: 'Ya existen cursos con el mismo nombre en esta sede',
              duplicateNames
            },
            { status: 409 }
          );
        }
      }

      type CursoRecord = Cursos;
      type GradoRecord = Grados;

      const cursosCreados: CursoRecord[] = [];
      const gradosCreados: GradoRecord[] = [];

      for (const gradoCurso of gradosCursos) {
        const gradoId = gradoCurso.grado_id;

        const gradoPredeterminado = GRADOS_PREDETERMINADOS.find(g => g.id === gradoId);
        if (!gradoPredeterminado) {
          return NextResponse.json(
            { error: `Grado con ID ${gradoId} no es válido` },
            { status: 400 }
          );
        }

        const nombreCanonico = gradoPredeterminado.nombre;
        const nivelCanonico = gradoPredeterminado.nivel;

        let grado = await tx.grados.findFirst({
          where: {
            orden: gradoPredeterminado.orden,
            ...gradoWhere,
          }
        });

        if (!grado) {
          grado = await tx.grados.create({
            data: {
              nombre: nombreCanonico,
              nivel: nivelCanonico,
              orden: gradoPredeterminado.orden,
              institucion_id: institucionId,
              ...sedeData,
            }
          });
          gradosCreados.push(grado);
        } else if (grado.nombre !== nombreCanonico || grado.nivel !== nivelCanonico) {
          grado = await tx.grados.update({
            where: { id: grado.id },
            data: {
              nombre: nombreCanonico,
              nivel: nivelCanonico,
            }
          });
        }

        for (const cursoData of gradoCurso.cursos) {
          const curso = await tx.cursos.create({
            data: {
              nombre: cursoData.nombre,
              grado_id: grado.id,
              institucion_id: institucionId,
              ...sedeData,
            }
          });

          cursosCreados.push(curso);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${cursosCreados.length} curso(s) creado(s) exitosamente`,
        data: {
          gradosCreados: gradosCreados || [],
          cursosCreados: cursosCreados
        }
      });
    });

  } catch (error) {
    const sedeResp = sedeErrorToResponse(error);
    if (sedeResp) return sedeResp;
    const rbacResp = rbacErrorToResponse(error);
    if (rbacResp) return rbacResp;
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error creating cursos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
