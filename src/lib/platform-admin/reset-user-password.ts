import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { resolveSupabaseUserIdForReset } from '@/lib/auth/resolveSupabaseUserId';
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
} from '@/lib/supabase-admin';
import { invalidateUserAuthSessions } from '@/lib/auth/invalidate-user-sessions';

export type PlatformResetUserType = 'institucion' | 'administrador' | 'docente';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;

export function validatePlatformAdminPassword(password: string): string | null {
  if (!PASSWORD_REGEX.test(password)) {
    return 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos (@$!%*?&)';
  }
  return null;
}

export async function resetUserPasswordByPlatformAdmin(
  tx: Prisma.TransactionClient,
  params: {
    userType: PlatformResetUserType;
    email: string;
    password: string;
  }
): Promise<{ email: string; userType: PlatformResetUserType }> {
  const email = params.email.trim().toLowerCase();
  const validationError = validatePlatformAdminPassword(params.password);
  if (validationError) {
    throw new Error(validationError);
  }

  const hashedPassword = await bcrypt.hash(params.password, 12);

  switch (params.userType) {
    case 'institucion': {
      const inst = await tx.instituciones.findUnique({ where: { email } });
      if (!inst) throw new Error('Institución no encontrada');
      await tx.instituciones.update({
        where: { email },
        data: { password: hashedPassword },
      });
      break;
    }
    case 'administrador': {
      const admin = await tx.administradores.findUnique({ where: { correo: email } });
      if (!admin) throw new Error('Administrador no encontrado');
      await tx.administradores.update({
        where: { correo: email },
        data: { password: hashedPassword },
      });
      break;
    }
    case 'docente': {
      const docente = await tx.docentes.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });
      if (!docente) throw new Error('Docente no encontrado');
      break;
    }
    default:
      throw new Error('Tipo de usuario inválido');
  }

  if (!isSupabaseAdminConfigured()) {
    throw new Error('Supabase Admin no configurado (SERVICE_ROLE_KEY)');
  }

  const supabaseUserId = await resolveSupabaseUserIdForReset(email, params.userType);
  if (!supabaseUserId) {
    throw new Error('No se encontró cuenta de autenticación para este correo');
  }

  const supabaseAdmin = getSupabaseAdminClient();
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(supabaseUserId, {
    password: params.password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error('No se pudo actualizar la contraseña en Supabase Auth');
  }

  // Invalidate refresh tokens and global sessions after admin reset
  await invalidateUserAuthSessions(supabaseAdmin, supabaseUserId);

  return { email, userType: params.userType };
}
