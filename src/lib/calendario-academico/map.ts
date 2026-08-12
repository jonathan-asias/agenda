import {
  CALENDARIO_EVENTO_CATEGORIA_LABELS,
  CALENDARIO_TIPO_COLORS,
  isCalendarioEventoCategoria,
  normalizeCalendarioEventoTipo,
  type CalendarioEvento,
  type CalendarioEventoCategoria,
} from '@/lib/calendario-academico/tipos';

export type CalendarioEventoRow = {
  id: number;
  institucion_id: number;
  sede_id: number | null;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  categoria?: string | null;
  lugar?: string | null;
  todo_el_dia: boolean;
  fecha_inicio: Date;
  fecha_fin: Date;
  color: string | null;
  created_at: Date;
  updated_at: Date;
  sede?: { id: number; nombre: string } | null;
};

export function mapCalendarioEvento(row: CalendarioEventoRow): CalendarioEvento {
  const tipo = normalizeCalendarioEventoTipo(row.tipo);
  const categoria =
    row.categoria && isCalendarioEventoCategoria(row.categoria) ? row.categoria : null;
  return {
    id: row.id,
    institucionId: row.institucion_id,
    sedeId: row.sede_id,
    sedeNombre: row.sede?.nombre ?? (row.sede_id == null ? 'Sede principal' : null),
    titulo: row.titulo,
    descripcion: row.descripcion,
    tipo,
    categoria,
    lugar: row.lugar ?? null,
    todoElDia: row.todo_el_dia,
    fechaInicio: row.fecha_inicio.toISOString(),
    fechaFin: row.fecha_fin.toISOString(),
    color: row.color || CALENDARIO_TIPO_COLORS[tipo],
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function resolveEventoTitulo(params: {
  titulo: string;
  tipo: string;
  categoria: CalendarioEventoCategoria | null;
}): string {
  const trimmed = params.titulo.trim();
  if (trimmed) return trimmed.slice(0, 255);
  if (params.tipo === 'evento' && params.categoria) {
    return CALENDARIO_EVENTO_CATEGORIA_LABELS[params.categoria];
  }
  return 'Actividad';
}
