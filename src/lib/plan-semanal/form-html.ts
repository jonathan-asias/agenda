export type PlanSemanalClase = {
  numero: number;
  fecha: string;
  tema_especifico: string;
  actividades: string;
  recursos: string;
  tiempo: string;
};

export type PlanSemanalFormFields = {
  periodo_academico: string;
  semana: string;
  fecha_inicio: string;
  fecha_final: string;
  num_estudiantes: string;
  unidad_eje: string;
  tema_semana: string;
  logro_objetivo: string;
  competencias: string;
  estandar_dba: string;
  evidencia_esperada: string;
  clases: PlanSemanalClase[];
  tarea_casa: string;
  fecha_entrega: string;
  medio_entrega: string;
  criterios_evaluacion: string;
  actividades_no_desarrolladas: string;
  ajustes_realizados: string;
  estudiantes_seguimiento: string;
  estrategias_apoyo: string;
  evaluacion_realizada: string;
  instrumento_utilizado: string;
  resultados_generales: string;
  dificultades: string;
  acciones_siguiente_semana: string;
  info_familias: string;
  materiales_requeridos: string;
  recomendaciones_casa: string;
  evidencias_notas: string;
};

export const PLAN_SEMANAL_FIELD_LABELS: Record<
  Exclude<keyof PlanSemanalFormFields, 'clases'>,
  string
> = {
  periodo_academico: 'Periodo académico',
  semana: 'Semana',
  fecha_inicio: 'Fecha inicio',
  fecha_final: 'Fecha final',
  num_estudiantes: 'N.º estudiantes',
  unidad_eje: 'Unidad o eje temático',
  tema_semana: 'Tema de la semana',
  logro_objetivo: 'Logro u objetivo de aprendizaje',
  competencias: 'Competencias a desarrollar',
  estandar_dba: 'Estándar o DBA',
  evidencia_esperada: 'Evidencia esperada',
  tarea_casa: 'Tarea o actividad para casa',
  fecha_entrega: 'Fecha de entrega',
  medio_entrega: 'Medio de entrega',
  criterios_evaluacion: 'Criterios de evaluación',
  actividades_no_desarrolladas: 'Actividades no desarrolladas',
  ajustes_realizados: 'Ajustes realizados',
  estudiantes_seguimiento: 'Estudiantes que requieren seguimiento',
  estrategias_apoyo: 'Estrategias de apoyo',
  evaluacion_realizada: 'Evaluación realizada',
  instrumento_utilizado: 'Instrumento utilizado',
  resultados_generales: 'Resultados generales',
  dificultades: 'Dificultades encontradas',
  acciones_siguiente_semana: 'Acciones para la siguiente semana',
  info_familias: 'Información para las familias',
  materiales_requeridos: 'Materiales requeridos',
  recomendaciones_casa: 'Recomendaciones para casa',
  evidencias_notas: 'Evidencias (notas)',
};

function emptyClases(count = 4): PlanSemanalClase[] {
  return Array.from({ length: count }, (_, i) => ({
    numero: i + 1,
    fecha: '',
    tema_especifico: '',
    actividades: '',
    recursos: '',
    tiempo: '',
  }));
}

export const EMPTY_PLAN_SEMANAL_FORM: PlanSemanalFormFields = {
  periodo_academico: '',
  semana: '',
  fecha_inicio: '',
  fecha_final: '',
  num_estudiantes: '',
  unidad_eje: '',
  tema_semana: '',
  logro_objetivo: '',
  competencias: '',
  estandar_dba: '',
  evidencia_esperada: '',
  clases: emptyClases(4),
  tarea_casa: '',
  fecha_entrega: '',
  medio_entrega: '',
  criterios_evaluacion: '',
  actividades_no_desarrolladas: '',
  ajustes_realizados: '',
  estudiantes_seguimiento: '',
  estrategias_apoyo: '',
  evaluacion_realizada: '',
  instrumento_utilizado: '',
  resultados_generales: '',
  dificultades: '',
  acciones_siguiente_semana: '',
  info_familias: '',
  materiales_requeridos: '',
  recomendaciones_casa: '',
  evidencias_notas: '',
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
  if (!trimmed) return '<p class="ps-empty"><em>(Sin contenido)</em></p>';
  return trimmed
    .split(/\n{2,}/)
    .map((block) => {
      const lines = escapeHtml(block.trim()).replace(/\n/g, '<br/>');
      return `<p>${lines}</p>`;
    })
    .join('\n');
}

function section(title: string, body: string): string {
  return `<section class="ps-section"><h3>${escapeHtml(title)}</h3>${body}</section>`;
}

function fieldBlock(label: string, value: string): string {
  if (!value.trim()) return '';
  return `<div class="ps-field"><h4>${escapeHtml(label)}</h4>${textToParagraphs(value)}</div>`;
}

function parseClases(raw: unknown): PlanSemanalClase[] {
  if (!Array.isArray(raw) || raw.length === 0) return emptyClases(4);
  return raw.slice(0, 8).map((item, i) => {
    const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    return {
      numero: typeof row.numero === 'number' ? row.numero : i + 1,
      fecha: typeof row.fecha === 'string' ? row.fecha : '',
      tema_especifico: typeof row.tema_especifico === 'string' ? row.tema_especifico : '',
      actividades: typeof row.actividades === 'string' ? row.actividades : '',
      recursos: typeof row.recursos === 'string' ? row.recursos : '',
      tiempo: typeof row.tiempo === 'string' ? row.tiempo : '',
    };
  });
}

export function parsePlanSemanalFormFields(raw: unknown): PlanSemanalFormFields {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out: PlanSemanalFormFields = { ...EMPTY_PLAN_SEMANAL_FORM, clases: emptyClases(4) };
  (Object.keys(EMPTY_PLAN_SEMANAL_FORM) as Array<keyof PlanSemanalFormFields>).forEach((key) => {
    if (key === 'clases') {
      out.clases = parseClases(obj.clases);
      return;
    }
    const v = obj[key];
    out[key] = typeof v === 'string' ? v : '';
  });
  return out;
}

export function validatePlanSemanalForm(fields: PlanSemanalFormFields): string | null {
  if (!fields.periodo_academico.trim()) return 'Completa el periodo académico';
  if (!fields.semana.trim()) return 'Completa el número o nombre de la semana';
  if (!fields.fecha_inicio.trim()) return 'Completa la fecha de inicio';
  if (!fields.fecha_final.trim()) return 'Completa la fecha final';
  if (!fields.tema_semana.trim()) return 'Completa el tema de la semana';
  if (!fields.logro_objetivo.trim()) return 'Completa el logro u objetivo de aprendizaje';

  const start = Date.parse(fields.fecha_inicio);
  const end = Date.parse(fields.fecha_final);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 'Las fechas de inicio y final deben ser válidas';
  }
  if (end < start) {
    return 'La fecha final no puede ser anterior a la fecha de inicio';
  }

  const hasClase = fields.clases.some(
    (c) =>
      c.tema_especifico.trim() ||
      c.actividades.trim() ||
      c.recursos.trim() ||
      c.tiempo.trim() ||
      c.fecha.trim()
  );
  if (!hasClase) {
    return 'Completa al menos una clase en el desarrollo semanal';
  }
  return null;
}

/** Convierte el formulario del plan semanal a HTML legible. */
export function planSemanalFormToHtml(
  fields: PlanSemanalFormFields,
  meta?: { asignatura?: string; curso?: string; docente?: string }
): string {
  const headerBits = [
    meta?.docente ? `<p><strong>Docente:</strong> ${escapeHtml(meta.docente)}</p>` : '',
    meta?.asignatura
      ? `<p><strong>Asignatura:</strong> ${escapeHtml(meta.asignatura)}</p>`
      : '',
    meta?.curso ? `<p><strong>Curso:</strong> ${escapeHtml(meta.curso)}</p>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const info = [
    fieldBlock('Periodo académico', fields.periodo_academico),
    fieldBlock('Semana', fields.semana),
    fieldBlock('Fecha inicio', fields.fecha_inicio),
    fieldBlock('Fecha final', fields.fecha_final),
    fieldBlock('N.º estudiantes', fields.num_estudiantes),
    headerBits ? `<div class="ps-field">${headerBits}</div>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const planeacion = [
    fieldBlock('Unidad o eje temático', fields.unidad_eje),
    fieldBlock('Tema de la semana', fields.tema_semana),
    fieldBlock('Logro u objetivo de aprendizaje', fields.logro_objetivo),
    fieldBlock('Competencias a desarrollar', fields.competencias),
    fieldBlock('Estándar o DBA', fields.estandar_dba),
    fieldBlock('Evidencia esperada', fields.evidencia_esperada),
  ]
    .filter(Boolean)
    .join('\n');

  const clasesRows = fields.clases
    .filter(
      (c) =>
        c.tema_especifico.trim() ||
        c.actividades.trim() ||
        c.recursos.trim() ||
        c.tiempo.trim() ||
        c.fecha.trim()
    )
    .map(
      (c) => `
<tr>
  <td>${c.numero}</td>
  <td>${escapeHtml(c.fecha)}</td>
  <td>${escapeHtml(c.tema_especifico)}</td>
  <td>${escapeHtml(c.actividades).replace(/\n/g, '<br/>')}</td>
  <td>${escapeHtml(c.recursos).replace(/\n/g, '<br/>')}</td>
  <td>${escapeHtml(c.tiempo)}</td>
</tr>`
    )
    .join('\n');

  const desarrollo = clasesRows
    ? `<div class="ps-table-wrap"><table class="ps-table">
<thead><tr>
  <th>Clase</th><th>Fecha</th><th>Tema específico</th>
  <th>Actividades</th><th>Recursos</th><th>Tiempo</th>
</tr></thead>
<tbody>${clasesRows}</tbody>
</table></div>`
    : '<p class="ps-empty"><em>(Sin clases registradas)</em></p>';

  const trabajo = [
    fieldBlock('Tarea o actividad para casa', fields.tarea_casa),
    fieldBlock('Fecha de entrega', fields.fecha_entrega),
    fieldBlock('Medio de entrega', fields.medio_entrega),
    fieldBlock('Criterios de evaluación', fields.criterios_evaluacion),
  ]
    .filter(Boolean)
    .join('\n');

  const seguimiento = [
    fieldBlock('Actividades no desarrolladas', fields.actividades_no_desarrolladas),
    fieldBlock('Ajustes realizados', fields.ajustes_realizados),
    fieldBlock('Estudiantes que requieren seguimiento', fields.estudiantes_seguimiento),
    fieldBlock('Estrategias de apoyo', fields.estrategias_apoyo),
  ]
    .filter(Boolean)
    .join('\n');

  const evaluacion = [
    fieldBlock('Evaluación realizada', fields.evaluacion_realizada),
    fieldBlock('Instrumento utilizado', fields.instrumento_utilizado),
    fieldBlock('Resultados generales', fields.resultados_generales),
    fieldBlock('Dificultades encontradas', fields.dificultades),
    fieldBlock('Acciones para la siguiente semana', fields.acciones_siguiente_semana),
  ]
    .filter(Boolean)
    .join('\n');

  const comunicacion = [
    fieldBlock('Información para las familias', fields.info_familias),
    fieldBlock('Materiales requeridos', fields.materiales_requeridos),
    fieldBlock('Recomendaciones para casa', fields.recomendaciones_casa),
  ]
    .filter(Boolean)
    .join('\n');

  const evidencias = fieldBlock('Evidencias', fields.evidencias_notas);

  return `<article class="ps-doc">
  <h2>Plan de clases — seguimiento semanal</h2>
  ${section('Información general', info || '<p class="ps-empty"><em>(Sin datos)</em></p>')}
  ${section('Planeación', planeacion || '<p class="ps-empty"><em>(Sin datos)</em></p>')}
  ${section('Desarrollo de las clases', desarrollo)}
  ${trabajo ? section('Trabajo independiente', trabajo) : ''}
  ${seguimiento ? section('Seguimiento', seguimiento) : ''}
  ${evaluacion ? section('Evaluación', evaluacion) : ''}
  ${comunicacion ? section('Comunicación con acudientes', comunicacion) : ''}
  ${evidencias ? section('Evidencias', evidencias) : ''}
</article>`;
}

/** Texto plano de PDF → HTML simple. */
export function plainTextToPlanSemanalHtml(text: string): string {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
  if (!cleaned) {
    return '<article class="ps-doc"><p><em>No se pudo extraer texto del PDF. Puedes editar este contenido manualmente.</em></p></article>';
  }
  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
  return `<article class="ps-doc"><h2>Plan de clases semanal</h2>${paragraphs}</article>`;
}
