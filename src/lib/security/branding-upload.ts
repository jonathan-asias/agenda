import { NextRequest } from 'next/server';
import { withDbTenant } from '@/lib/db/rls-context';
import {
  getAuthInstitutionId,
  enforceTenant,
} from '@/lib/tenant';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const REGISTRATION_BOOTSTRAP_MS = 30 * 60 * 1000; // 30 min
const MAGIC_SCAN_BYTES = 64 * 1024;

function isPngBytes(buf: Uint8Array): boolean {
  return (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  );
}

function isJpegBytes(buf: Uint8Array): boolean {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function isWebpBytes(buf: Uint8Array): boolean {
  return (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  );
}

function containsEmbeddedMarkup(buf: Uint8Array): boolean {
  const text = new TextDecoder('utf-8', { fatal: false })
    .decode(buf.slice(0, Math.min(buf.length, MAGIC_SCAN_BYTES)))
    .toLowerCase();
  return /<html|<script|javascript:/i.test(text);
}

export function resolveBrandingContentType(file: File, header: Uint8Array): string {
  const lower = file.name.toLowerCase();
  if (isPngBytes(header) || lower.endsWith('.png')) return 'image/png';
  if (isJpegBytes(header) || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (isWebpBytes(header) || lower.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

export function validateBrandingFile(file: File, label: string): string | null {
  if (file.size <= 0) {
    return `${label}: archivo vacío`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${label}: tamaño máximo 5 MB`;
  }
  const lower = file.name.toLowerCase();
  const typeOk =
    ALLOWED_TYPES.has(file.type) ||
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp');
  if (!typeOk) {
    return `${label}: solo PNG, JPEG o WebP`;
  }
  return null;
}

/** Valida tipo declarado, magic bytes y ausencia de markup embebido (polyglots). */
export async function validateBrandingFileContent(
  file: File,
  label: string
): Promise<string | null> {
  const basic = validateBrandingFile(file, label);
  if (basic) return basic;

  const header = new Uint8Array(
    await file.slice(0, MAGIC_SCAN_BYTES).arrayBuffer()
  );

  if (containsEmbeddedMarkup(header)) {
    return `${label}: contenido no permitido en imagen`;
  }

  const lower = file.name.toLowerCase();
  const asPng = file.type === 'image/png' || lower.endsWith('.png');
  const asJpeg =
    file.type === 'image/jpeg' || lower.endsWith('.jpg') || lower.endsWith('.jpeg');
  const asWebp = file.type === 'image/webp' || lower.endsWith('.webp');

  if (asPng && !isPngBytes(header)) return `${label}: archivo PNG inválido`;
  if (asJpeg && !isJpegBytes(header)) return `${label}: archivo JPEG inválido`;
  if (asWebp && !isWebpBytes(header)) return `${label}: archivo WebP inválido`;

  return null;
}

/**
 * Autoriza PUT branding: sesión + tenant, o bootstrap post-registro (email + ventana temporal).
 */
export async function authorizeBrandingWrite(
  request: NextRequest,
  institucionId: number,
  bootstrapEmail: string | null
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const userInstitutionId = await getAuthInstitutionId(request);

  if (userInstitutionId != null) {
    try {
      enforceTenant(userInstitutionId, institucionId);
      return { ok: true };
    } catch {
      return { ok: false, status: 403, error: 'Acceso denegado a este recurso' };
    }
  }

  if (!bootstrapEmail?.trim()) {
    return { ok: false, status: 401, error: 'Se requiere autenticación' };
  }

  return withDbTenant(institucionId, async (tx) => {
    const institucion = await tx.instituciones.findUnique({
      where: { id: institucionId },
      select: { email: true, created_at: true },
    });

    if (!institucion) {
      return { ok: false as const, status: 404, error: 'Institución no encontrada' };
    }

    const normalizedBootstrap = bootstrapEmail.trim().toLowerCase();
    if (institucion.email.toLowerCase() !== normalizedBootstrap) {
      return { ok: false as const, status: 403, error: 'Acceso denegado' };
    }

    const ageMs = Date.now() - institucion.created_at.getTime();
    if (ageMs > REGISTRATION_BOOTSTRAP_MS) {
      return {
        ok: false as const,
        status: 401,
        error: 'Ventana de registro expirada. Inicie sesión para actualizar el branding.',
      };
    }

    return { ok: true as const };
  });
}
