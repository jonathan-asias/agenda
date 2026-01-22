import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('=== VERIFICANDO EMAIL ===');
    console.log('Email recibido:', email);
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      );
    }

    if (!isSupabaseAdminConfigured()) {
      console.error('Supabase admin no está configurado. No se puede verificar el email.');
      return NextResponse.json(
        { success: false, error: 'El servicio de autenticación no está configurado.' },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // Buscar usuario por email en Supabase Auth usando listUsers
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (error) {
      console.error('Error listando usuarios:', error);
      return NextResponse.json(
        { success: false, error: 'Error verificando email' },
        { status: 500 }
      );
    }

    // Verificar si el email existe en la lista de usuarios
    const usuarioExiste = data.users.some(user => 
      user.email?.toLowerCase() === email.toLowerCase()
    );
    
    console.log('Resultado de la búsqueda:');
    console.log('- Email buscado:', email);
    console.log('- Usuario encontrado:', usuarioExiste);
    console.log('- Total usuarios en la lista:', data.users.length);
    console.log('- Emails en la lista:', data.users.map(u => u.email).filter(Boolean));

    return NextResponse.json({
      success: true,
      exists: usuarioExiste,
      email: email
    });

  } catch (error) {
    console.error('Error en check-email:', error);
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