import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email: emailParam } = await params;
    const email = decodeURIComponent(emailParam);

    if (!email || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      const docente = await tx.docentes.findFirst({
        where: {
          email: email.trim(),
          institucion_id: userInstitutionId,
        },
        include: {
          institucion: { select: { id: true, nombre: true } },
          sede: { select: { id: true, nombre: true } },
          docenteAsignaciones: {
            include: {
              grado: { select: { id: true, nombre: true, nivel: true } },
              curso: { select: { id: true, nombre: true, jornada: true } },
              materia: {
                select: {
                  id: true,
                  nombre: true,
                  area: { select: { id: true, nombre: true } }
                }
              }
            }
          }
        }
      });

      if (!docente) {
        return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 });
      }

      enforceTenant(userInstitutionId, docente.institucion_id);

      return NextResponse.json({
        docente: {
          id: docente.id,
          nombres: docente.nombres,
          apellidos: docente.apellidos,
          email: docente.email,
          telefono: docente.telefono,
          institucion: docente.institucion,
          sede: docente.sede,
          docenteAsignaciones: docente.docenteAsignaciones
        }
      });
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error buscando docente:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
