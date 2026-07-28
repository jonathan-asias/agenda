import { plainTextToSilabusHtml } from '@/lib/silabus/form-html';

/**
 * Extrae texto de un PDF y lo convierte a HTML básico.
 * Usa unpdf (sin worker binario pesado).
 */
export async function extractPdfToHtml(buffer: Buffer): Promise<{
  html: string;
  pageCount: number;
  charCount: number;
}> {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const bytes = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(bytes);
  const { text, totalPages } = await extractText(pdf, { mergePages: true });
  const plain = Array.isArray(text) ? text.join('\n\n') : String(text || '');
  const html = plainTextToSilabusHtml(plain);
  return {
    html,
    pageCount: totalPages || 0,
    charCount: plain.trim().length,
  };
}
