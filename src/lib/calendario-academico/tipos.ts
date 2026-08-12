/** Tipos y constantes del calendario académico. */

export const CALENDARIO_TIPOS = [
  'inicio_periodo',
  'fin_periodo',
  'vacaciones',
  'no_lectivo',
  'evento',
  'otro',
] as const;

export type CalendarioEventoTipo = (typeof CALENDARIO_TIPOS)[number];

export const CALENDARIO_TIPO_LABELS: Record<CalendarioEventoTipo, string> = {
  inicio_periodo: 'Inicio de periodo',
  fin_periodo: 'Fin de periodo',
  vacaciones: 'Vacaciones',
  no_lectivo: 'Día no lectivo',
  evento: 'Evento',
  otro: 'Otro',
};

export const CALENDARIO_TIPO_COLORS: Record<CalendarioEventoTipo, string> = {
  inicio_periodo: '#059669',
  fin_periodo: '#dc2626',
  vacaciones: '#d97706',
  no_lectivo: '#64748b',
  evento: '#2563eb',
  otro: '#7c3aed',
};

/** Subtipos cuando el tipo del calendario es `evento` (solo uno). */
export const CALENDARIO_EVENTO_CATEGORIAS = [
  'salida_pedagogica',
  'izada_bandera',
  'dia_estudiante',
  'reunion_padres',
  'acto_civico',
  'celebracion',
  'otro_evento',
] as const;

export type CalendarioEventoCategoria = (typeof CALENDARIO_EVENTO_CATEGORIAS)[number];

export const CALENDARIO_EVENTO_CATEGORIA_LABELS: Record<CalendarioEventoCategoria, string> = {
  salida_pedagogica: 'Salida pedagógica',
  izada_bandera: 'Izada de bandera',
  dia_estudiante: 'Día del estudiante',
  reunion_padres: 'Reunión de padres',
  acto_civico: 'Acto cívico',
  celebracion: 'Celebración',
  otro_evento: 'Otro evento',
};

export function isCalendarioEventoTipo(value: string): value is CalendarioEventoTipo {
  return (CALENDARIO_TIPOS as readonly string[]).includes(value);
}

export function normalizeCalendarioEventoTipo(value: string): CalendarioEventoTipo {
  if (value === 'reunion') return 'evento';
  if ((CALENDARIO_TIPOS as readonly string[]).includes(value)) {
    return value as CalendarioEventoTipo;
  }
  return 'otro';
}

export function isCalendarioEventoCategoria(
  value: string
): value is CalendarioEventoCategoria {
  return (CALENDARIO_EVENTO_CATEGORIAS as readonly string[]).includes(value);
}

export type CalendarioEvento = {
  id: number;
  institucionId: number;
  sedeId: number | null;
  sedeNombre: string | null;
  titulo: string;
  descripcion: string | null;
  tipo: CalendarioEventoTipo;
  categoria: CalendarioEventoCategoria | null;
  lugar: string | null;
  todoElDia: boolean;
  fechaInicio: string;
  fechaFin: string;
  color: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CalendarioVista = 'mes' | 'semana' | 'dia';
