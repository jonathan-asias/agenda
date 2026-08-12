import { parseLocalDateInput } from '@/lib/notifications/reminder-email-html';

/** Minutos exactos antes del evento en que vence la autorización. */
export const AUTORIZACION_MINUTOS_ANTES = 30;

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseLocalDateTimeInput(dateStr: string, timeStr: string): Date | null {
  const date = parseLocalDateInput(dateStr);
  if (!date) return null;
  const m = TIME_RE.exec(timeStr.trim());
  if (!m) return null;
  const next = new Date(date);
  next.setHours(Number(m[1]), Number(m[2]), 0, 0);
  return next;
}

export function formatTimeInputFromDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDateInputFromDate(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Calcula vencimiento = evento − 30 minutos (misma lógica automática del formulario). */
export function computeAutorizacionVencimiento(evento: Date): Date {
  return new Date(evento.getTime() - AUTORIZACION_MINUTOS_ANTES * 60 * 1000);
}

/**
 * Valida vencimiento vs evento.
 * - Fecha de vencimiento ≤ día del evento
 * - Hora de vencimiento = exactamente 30 min antes del evento
 */
export function validateAutorizacionVencimiento(
  vencimiento: Date,
  evento: Date
): string | null {
  const vencDay = new Date(vencimiento);
  vencDay.setHours(0, 0, 0, 0);
  const eventDay = new Date(evento);
  eventDay.setHours(0, 0, 0, 0);
  if (vencDay > eventDay) {
    return 'La fecha de vencimiento no puede ser posterior a la fecha del evento.';
  }

  const expected = computeAutorizacionVencimiento(evento);
  if (Math.abs(vencimiento.getTime() - expected.getTime()) > 60_000) {
    return `La hora de vencimiento debe ser exactamente ${AUTORIZACION_MINUTOS_ANTES} minutos antes del evento (${formatTimeInputFromDate(expected)}).`;
  }
  return null;
}

/** Valida que la hora de llegada no sea después del inicio del evento. */
export function validateHoraLlegada(llegada: Date, inicio: Date): string | null {
  if (llegada.getTime() > inicio.getTime()) {
    return 'La hora de llegada no puede ser después de la hora de inicio.';
  }
  return null;
}

/** Valida que la hora de fin sea posterior a la de inicio. */
export function validateHoraFin(inicio: Date, fin: Date): string | null {
  if (fin.getTime() <= inicio.getTime()) {
    return 'La hora de fin debe ser posterior a la hora de inicio.';
  }
  return null;
}
