const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAGIC_SCAN_BYTES = 64 * 1024;

const ALLOWED_EXTENSIONS = ['.pdf'] as const;

function fileExtension(name: string): string {
  const lower = name.toLowerCase();
  const idx = lower.lastIndexOf('.');
  return idx >= 0 ? lower.slice(idx) : '';
}

function isPdfBytes(buf: Uint8Array): boolean {
  return (
    buf.length >= 5 &&
    buf[0] === 0x25 &&
    buf[1] === 0x50 &&
    buf[2] === 0x44 &&
    buf[3] === 0x46 &&
    buf[4] === 0x2d
  ); // %PDF-
}

export function resolveSilabusMimeType(fileName: string, declaredType?: string): string {
  const ext = fileExtension(fileName);
  if (ext === '.pdf') return 'application/pdf';
  if (declaredType && declaredType !== 'application/octet-stream') return declaredType;
  return 'application/pdf';
}

export function validateSilabusFile(file: File): string | null {
  if (file.size <= 0) return 'El archivo está vacío';
  if (file.size > MAX_FILE_BYTES) return 'El archivo supera el tamaño máximo (10 MB)';

  const ext = fileExtension(file.name);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return 'Solo se permiten archivos PDF';
  }
  return null;
}

export async function validateSilabusFileContent(file: File): Promise<string | null> {
  const basic = validateSilabusFile(file);
  if (basic) return basic;

  const header = new Uint8Array(await file.slice(0, MAGIC_SCAN_BYTES).arrayBuffer());
  if (!isPdfBytes(header)) {
    return 'El archivo PDF no es válido';
  }

  return null;
}

export function isPdfMime(mime: string, fileName?: string): boolean {
  if (mime === 'application/pdf') return true;
  return !!fileName && fileName.toLowerCase().endsWith('.pdf');
}

export const SILABUS_MAX_BYTES = MAX_FILE_BYTES;
