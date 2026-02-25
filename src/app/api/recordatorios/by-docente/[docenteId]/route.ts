import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docenteId: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { docenteId: docenteIdParam } = await params;
    const docenteId = parseInt(docenteIdParam);

    if (!docenteId || isNaN(docenteId)) {
      return NextResponse.json({ error: 'ID de docente inválido' }, { status: 400 });
    }

    const docente = await prisma.docentes.findUnique({
      where: { id: docenteId },
      select: { institucion_id: true }
    });
    if (!docente) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
    }
    enforceTenant(userInstitutionId, docente.institucion_id);

    const recordatorios = await prisma.recordatorios.findMany({
      where: {
        docente_id: docenteId
      },
      include: {
        grado: {
          select: {
            id: true,
            nombre: true,
            nivel: true
          }
        },
        curso: {
          select: {
            id: true,
            nombre: true,
            jornada: true
          }
        },
        area: {
          select: {
            id: true,
            nombre: true
          }
        },
        materia: {
          select: {
            id: true,
            nombre: true
          }
        },
        estudiantes: {
          include: {
            estudiante: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
                codigo_estudiantil: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    return NextResponse.json({ recordatorios });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando recordatorios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

