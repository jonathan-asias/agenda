import type { Recordatorio } from '@/types/recordatorio';

/** True si algún acudiente ya respondió la autorización. */
export function recordatorioTieneRespuestasAutorizacion(
  recordatorio: Pick<Recordatorio, 'tipo' | 'estudiantes'> | null | undefined
): boolean {
  if (!recordatorio || recordatorio.tipo !== 'autorizacion') return false;
  return (recordatorio.estudiantes ?? []).some(
    (item) =>
      item.autorizacion_respuesta === 'autorizado' ||
      item.autorizacion_respuesta === 'no_autorizado'
  );
}
