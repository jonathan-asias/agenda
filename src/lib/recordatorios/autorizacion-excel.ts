import * as XLSX from 'xlsx';
import type { Recordatorio } from '@/types/recordatorio';

function formatFechaHora(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  });
}

function formatSoloFecha(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', {
    dateStyle: 'full',
    timeZone: 'America/Bogota',
  });
}

function formatSoloHora(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

function estadoLabel(respuesta?: string | null): string {
  if (respuesta === 'autorizado') return 'Autorizó';
  if (respuesta === 'no_autorizado') return 'No autorizó';
  return 'Pendiente';
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function buildAutorizacionConsolidadoWorkbook(recordatorio: Recordatorio): XLSX.WorkBook {
  const estudiantes = [...(recordatorio.estudiantes ?? [])].sort((a, b) => {
    const an = `${a.estudiante.apellidos} ${a.estudiante.nombres}`.toLowerCase();
    const bn = `${b.estudiante.apellidos} ${b.estudiante.nombres}`.toLowerCase();
    return an.localeCompare(bn, 'es');
  });

  let autorizaron = 0;
  let noAutorizaron = 0;
  let pendientes = 0;
  for (const item of estudiantes) {
    if (item.autorizacion_respuesta === 'autorizado') autorizaron += 1;
    else if (item.autorizacion_respuesta === 'no_autorizado') noAutorizaron += 1;
    else pendientes += 1;
  }

  const resumenRows: Array<Array<string | number>> = [
    ['Campo', 'Valor'],
    ['Nombre de la autorización', recordatorio.nombre],
    ['Descripción', recordatorio.descripcion],
    ['Evento', recordatorio.evento_nombre || ''],
    ['Lugar', recordatorio.lugar_evento || ''],
    ['Fecha del evento', formatSoloFecha(recordatorio.fecha_evento)],
    ['Hora de inicio', formatSoloHora(recordatorio.fecha_evento)],
    ['Hora de fin', formatSoloHora(recordatorio.hora_fin)],
    ['Fecha de vencimiento', formatFechaHora(recordatorio.fecha)],
    ['Área', recordatorio.area?.nombre || ''],
    ['Materia', recordatorio.materia?.nombre || ''],
    ['Grado', recordatorio.grado?.nombre || ''],
    ['Curso', recordatorio.curso?.nombre || ''],
    [
      'Docente',
      recordatorio.docente
        ? `${recordatorio.docente.nombres} ${recordatorio.docente.apellidos}`.trim()
        : '',
    ],
    ['Email docente', recordatorio.docente?.email || ''],
    ['Total estudiantes', estudiantes.length],
    ['Autorizaron', autorizaron],
    ['No autorizaron', noAutorizaron],
    ['Pendientes', pendientes],
    ['Generado el', formatFechaHora(new Date().toISOString())],
  ];

  const respuestasRows: Array<Array<string | number>> = [
    [
      'Nombres',
      'Apellidos',
      'Código estudiantil',
      'Estado',
      'Respondido el',
      'Autorización',
      'Evento',
      'Grado',
      'Curso',
      'Materia',
      'Docente',
    ],
    ...estudiantes.map((item) => [
      item.estudiante.nombres,
      item.estudiante.apellidos,
      item.estudiante.codigo_estudiantil || '',
      estadoLabel(item.autorizacion_respuesta),
      item.autorizacion_respondido_at
        ? formatFechaHora(item.autorizacion_respondido_at)
        : '',
      recordatorio.nombre,
      recordatorio.evento_nombre || '',
      recordatorio.grado?.nombre || '',
      recordatorio.curso?.nombre || '',
      recordatorio.materia?.nombre || '',
      recordatorio.docente
        ? `${recordatorio.docente.nombres} ${recordatorio.docente.apellidos}`.trim()
        : '',
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const resumenSheet = XLSX.utils.aoa_to_sheet(resumenRows);
  resumenSheet['!cols'] = [{ wch: 28 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, resumenSheet, 'Resumen');

  const respuestasSheet = XLSX.utils.aoa_to_sheet(respuestasRows);
  respuestasSheet['!cols'] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 22 },
    { wch: 28 },
    { wch: 24 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, respuestasSheet, 'Respuestas');

  return wb;
}

export function getAutorizacionConsolidadoFilename(recordatorio: Recordatorio): string {
  const base = slugify(recordatorio.nombre || 'autorizacion') || 'autorizacion';
  const date = new Date().toISOString().slice(0, 10);
  return `consolidado-autorizacion-${base}-${date}.xlsx`;
}

/** Descarga el Excel del consolidado en el navegador. */
export function downloadAutorizacionConsolidadoExcel(recordatorio: Recordatorio): void {
  const wb = buildAutorizacionConsolidadoWorkbook(recordatorio);
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getAutorizacionConsolidadoFilename(recordatorio);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
