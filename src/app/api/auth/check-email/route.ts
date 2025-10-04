import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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