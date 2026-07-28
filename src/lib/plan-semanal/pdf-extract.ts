import { plainTextToPlanSemanalHtml } from '@/lib/plan-semanal/form-html';

/**
 * Extrae texto de un PDF y lo convierte a HTML básico del plan semanal.
 */
export async function extractPdfToPlanSemanalHtml(buffer: Buffer): Promise<{
  html: string;
  pageCount: number;
  charCount: number;
}> {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const bytes = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(bytes);
  const { text, totalPages } = await extractText(pdf, { mergePages: true });
  const plain = Array.isArray(text) ? text.join('\n\n') : String(text || '');
  const html = plainTextToPlanSemanalHtml(plain);
  return {
    html,
    pageCount: totalPages || 0,
    charCount: plain.trim().length,
  };
}
