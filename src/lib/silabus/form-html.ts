export type SilabusFormFields = {
  justificacion: string;
  objetivos_generales: string;
  objetivos_especificos: string;
  contenidos: string;
  metodologia: string;
  evaluacion: string;
  recursos: string;
  bibliografia: string;
};

export const SILABUS_FORM_LABELS: Record<keyof SilabusFormFields, string> = {
  justificacion: 'Justificación',
  objetivos_generales: 'Objetivos generales',
  objetivos_especificos: 'Objetivos específicos',
  contenidos: 'Contenidos / temáticas',
  metodologia: 'Metodología',
  evaluacion: 'Evaluación',
  recursos: 'Recursos didácticos',
  bibliografia: 'Bibliografía',
};

export const EMPTY_SILABUS_FORM: SilabusFormFields = {
  justificacion: '',
  objetivos_generales: '',
  objetivos_especificos: '',
  contenidos: '',
  metodologia: '',
  evaluacion: '',
  recursos: '',
  bibliografia: '',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function textToParagraphs(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '<p class="silabus-empty"><em>(Sin contenido)</em></p>';
  return trimmed
    .split(/\n{2,}/)
    .map((block) => {
      const lines = escapeHtml(block.trim()).replace(/\n/g, '<br/>');
      return `<p>${lines}</p>`;
    })
    .join('\n');
}

export function parseSilabusFormFields(raw: unknown): SilabusFormFields {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out = { ...EMPTY_SILABUS_FORM };
  (Object.keys(EMPTY_SILABUS_FORM) as Array<keyof SilabusFormFields>).forEach((key) => {
    const v = obj[key];
    out[key] = typeof v === 'string' ? v : '';
  });
  return out;
}

export function validateSilabusForm(fields: SilabusFormFields): string | null {
  const required: Array<keyof SilabusFormFields> = [
    'objetivos_generales',
    'contenidos',
    'metodologia',
    'evaluacion',
  ];
  for (const key of required) {
    if (!fields[key].trim()) {
      return `Completa el campo: ${SILABUS_FORM_LABELS[key]}`;
    }
  }
  return null;
}

/** Convierte el formulario estructurado a HTML legible en web. */
export function silabusFormToHtml(fields: SilabusFormFields): string {
  const sections = (Object.keys(SILABUS_FORM_LABELS) as Array<keyof SilabusFormFields>)
    .filter((key) => fields[key].trim())
    .map(
      (key) => `
<section class="silabus-section" data-field="${key}">
  <h3>${escapeHtml(SILABUS_FORM_LABELS[key])}</h3>
  ${textToParagraphs(fields[key])}
</section>`
    );
  return `<article class="silabus-doc">${sections.join('\n')}</article>`;
}

/** Texto plano de PDF → HTML simple por párrafos. */
export function plainTextToSilabusHtml(text: string): string {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
  if (!cleaned) {
    return '<article class="silabus-doc"><p><em>No se pudo extraer texto del PDF. Puedes editar este contenido manualmente.</em></p></article>';
  }
  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
  return `<article class="silabus-doc">${paragraphs}</article>`;
}
