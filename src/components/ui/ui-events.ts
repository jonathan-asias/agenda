export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastDetail {
  type: ToastType;
  title: string;
  text?: string;
  /** Milisegundos hasta cerrar automáticamente. 0 = solo cierre manual. */
  duration?: number;
}

export interface ConfirmDetail {
  title: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: 'danger' | 'warning' | 'default';
  icon?: 'warning' | 'question' | 'info' | 'error';
  inputPlaceholder?: string;
  inputValidator?: (value: string) => string | null;
  resolve: (confirmed: boolean) => void;
}

export interface LoadingDetail {
  open: boolean;
  title?: string;
  text?: string;
}

export const TOAST_EVENT = 'agenda:toast';
export const CONFIRM_EVENT = 'agenda:confirm';
export const LOADING_EVENT = 'agenda:loading';

export function dispatchToast(detail: ToastDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}

export function dispatchConfirm(detail: ConfirmDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONFIRM_EVENT, { detail }));
}

export function dispatchLoading(detail: LoadingDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(LOADING_EVENT, { detail }));
}
