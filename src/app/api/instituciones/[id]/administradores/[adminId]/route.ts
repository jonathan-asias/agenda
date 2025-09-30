import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { supabaseAdmin } from '../../../../../../lib/supabase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; adminId: string }> }
) {
  try {
    const { id, adminId } = await params;
    const institucionId = parseInt(id);
    const administradorId = parseInt(adminId);

    if (isNaN(institucionId) || isNaN(administradorId)) {
      return NextResponse.json(
        { error: 'ID de institución o administrador inválido' },
        { status: 400 }
      );
    }

    // Verificar que la institución existe
    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId }
    });

    if (!institucion) {
      return NextResponse.json(
        { error: 'Institución no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el administrador existe y pertenece a la institución
    const administrador = await prisma.administradores.findFirst({
      where: {
        id: administradorId,
        institucion_id: institucionId
      }
    });

    if (!administrador) {
      return NextResponse.json(
        { error: 'Administrador no encontrado o no pertenece a esta institución' },
        { status: 404 }
      );
    }

    // Eliminar el usuario de Supabase Auth si tiene supabase_user_id
    if (administrador.supabase_user_id) {
      console.log('Eliminando usuario de Supabase Auth con ID:', administrador.supabase_user_id);
      try {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
          administrador.supabase_user_id
        );
        
        if (authError) {
          console.error('Error al eliminar usuario de Supabase Auth:', authError);
          console.error('Detalles del error:', JSON.stringify(authError, null, 2));
          // Continuamos con la eliminación de la base de datos aunque falle Supabase
        } else {
          console.log('Usuario eliminado exitosamente de Supabase Auth');
        }
      } catch (authError) {
        console.error('Error al eliminar usuario de Supabase Auth:', authError);
        console.error('Stack trace:', authError instanceof Error ? authError.stack : 'No stack trace available');
        // Continuamos con la eliminación de la base de datos aunque falle Supabase
      }
    } else {
      console.log('No se encontró supabase_user_id para el administrador:', administrador.id);
      console.log('Datos del administrador:', {
        id: administrador.id,
        correo: administrador.correo,
        supabase_user_id: administrador.supabase_user_id
      });
    }

    // Eliminar el administrador de la base de datos
    await prisma.administradores.delete({
      where: {
        id: administradorId
      }
    });

    return NextResponse.json(
      { message: 'Administrador eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
