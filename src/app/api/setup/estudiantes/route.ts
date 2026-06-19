import { NextRequest, NextResponse } from 'next/server';
import {
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';
import { withAdminSedeDb } from '@/lib/security/require-admin-api';
import { rbacErrorToResponse } from '@/lib/security/rbac';
import {
  assertRecordBelongsToSede,
  sedeDataForCreate,
  sedeErrorToResponse,
} from '@/lib/sede-scope';
type EstudianteInput = {
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente?: string | null;
  telefono_acudiente: string;
  grado_id: number;
  curso_id: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {      institucionId: number;
      estudiantes: EstudianteInput[];
    };
    
    const { institucionId, estudiantes } = body;
    
    
    // Validaciones bÃ¡sicas
    if (!institucionId) {
      return NextResponse.json(
        { success: false, error: 'institucionId es requerido' },
        { status: 400 }
      );
    }
    
    if (!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere al menos un estudiante' },
        { status: 400 }
      );
    }
    
    return await withAdminSedeDb(request, async (tx, { institutionId, scope }) => {
    const institucion = await tx.instituciones.findUnique({      where: { id: institucionId }
    });
    
    if (!institucion) {
      return NextResponse.json(
        { success: false, error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    enforceTenant(institutionId, institucionId);

    const sedeData = sedeDataForCreate(scope);
    
    type EstudianteCreadoResumen = {
      id: number;
      nombres: string;
      apellidos: string;
      codigo_estudiantil: string;
      nombre_acudiente: string;
      correo_acudiente: string | null;
      telefono_acudiente: string;
      grado_id: number;
      curso_id: number;
    };

    type ErrorRegistro = {
      estudiante: string;
      error: string;
      stack?: string;
    };

    const estudiantesCreados: EstudianteCreadoResumen[] = [];
    const errores: ErrorRegistro[] = [];
    
    // Crear cada estudiante
    for (let i = 0; i < estudiantes.length; i++) {
      const estudiante = estudiantes[i];
      
      
      try {
        
        const curso = await tx.cursos.findFirst({
          where: { id: estudiante.curso_id, institucion_id: institucionId },
        });
        if (!curso) {
          throw new Error(`Curso con ID ${estudiante.curso_id} no encontrado`);
        }
        assertRecordBelongsToSede(curso.sede_id, scope);

        const grado = await tx.grados.findFirst({
          where: { id: estudiante.grado_id, institucion_id: institucionId },
        });
        if (!grado) {
          throw new Error(`Grado con ID ${estudiante.grado_id} no encontrado`);
        }
        assertRecordBelongsToSede(grado.sede_id, scope);

        const estudianteCreado = await tx.estudiantes.create({          data: {
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            codigo_estudiantil: estudiante.codigo_estudiantil,
            nombre_acudiente: estudiante.nombre_acudiente,
            correo_acudiente: estudiante.correo_acudiente,
            telefono_acudiente: estudiante.telefono_acudiente,
            grado_id: estudiante.grado_id,
            curso_id: estudiante.curso_id,
            institucion_id: institucionId,
            ...sedeData,
            activo: true
          }
        });
        
        
        estudiantesCreados.push({
          id: estudianteCreado.id,
          nombres: estudianteCreado.nombres,
          apellidos: estudianteCreado.apellidos,
          codigo_estudiantil: estudianteCreado.codigo_estudiantil,
          nombre_acudiente: estudianteCreado.nombre_acudiente,
          correo_acudiente: estudianteCreado.correo_acudiente,
          telefono_acudiente: estudianteCreado.telefono_acudiente,
          grado_id: estudianteCreado.grado_id,
          curso_id: estudianteCreado.curso_id
        });
        
      } catch (error) {
        console.error(`Error creando estudiante ${estudiante.codigo_estudiantil}:`, error);
        console.error('Stack trace del error:', error instanceof Error ? error.stack : 'No stack trace');
        errores.push({
          estudiante: estudiante.codigo_estudiantil,
          error: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    
    return NextResponse.json({
      success: true,
      message: `Se crearon ${estudiantesCreados.length} estudiante(s) exitosamente`,
      data: {
        estudiantesCreados,
        errores,
        total: estudiantes.length,
        exitosos: estudiantesCreados.length,
        fallidos: errores.length
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
    console.error('Error en endpoint estudiantes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
