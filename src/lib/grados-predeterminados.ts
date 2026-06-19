/** Grados del sistema educativo colombiano (misma lista en wizard y APIs). */
export const GRADOS_PREDETERMINADOS = [
  { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
  { id: 2, nombre: 'PRE-JARDÍN', nivel: 'Educación Inicial', orden: 2 },
  { id: 3, nombre: 'JARDÍN', nivel: 'Educación Inicial', orden: 3 },
  { id: 4, nombre: 'TRANSICIÓN', nivel: 'Educación Inicial', orden: 4 },
  { id: 5, nombre: '1°', nivel: 'Primaria', orden: 5 },
  { id: 6, nombre: '2°', nivel: 'Primaria', orden: 6 },
  { id: 7, nombre: '3°', nivel: 'Primaria', orden: 7 },
  { id: 8, nombre: '4°', nivel: 'Primaria', orden: 8 },
  { id: 9, nombre: '5°', nivel: 'Primaria', orden: 9 },
  { id: 10, nombre: '6°', nivel: 'Secundaria', orden: 10 },
  { id: 11, nombre: '7°', nivel: 'Secundaria', orden: 11 },
  { id: 12, nombre: '8°', nivel: 'Secundaria', orden: 12 },
  { id: 13, nombre: '9°', nivel: 'Secundaria', orden: 13 },
  { id: 14, nombre: '10°', nivel: 'Media', orden: 14 },
  { id: 15, nombre: '11°', nivel: 'Media', orden: 15 },
] as const;

export type GradoPredeterminado = (typeof GRADOS_PREDETERMINADOS)[number];

/** Corrige nombres guardados con codificación UTF-8 mal interpretada (ej. 6Â° → 6°). */
export function normalizarNombreGrado(nombre: string): string {
  return nombre.replace(/Â°/g, '°');
}

export function nombreGradoPorOrden(orden: number): string | undefined {
  return GRADOS_PREDETERMINADOS.find((g) => g.orden === orden)?.nombre;
}

export function nivelGradoPorOrden(orden: number): string | undefined {
  return GRADOS_PREDETERMINADOS.find((g) => g.orden === orden)?.nivel;
}

/** Nombre canónico por orden; si no hay orden, normaliza el texto recibido. */
export function nombreGradoCanonico(orden: number, nombreActual: string): string {
  return nombreGradoPorOrden(orden) ?? normalizarNombreGrado(nombreActual);
}
