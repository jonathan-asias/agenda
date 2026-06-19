/**
 * Notificaciones UI imperativas (toast, confirmación, carga).
 * Reemplaza SweetAlert2 con el sistema de componentes propio.
 */
import {
  dispatchConfirm,
  dispatchLoading,
  dispatchToast,
  type ConfirmDetail,
} from '@/components/ui/ui-events';

export function showLoading(title: string, text?: string): void {
  dispatchLoading({ open: true, title, text });
}

export function closeLoading(): void {
  dispatchLoading({ open: false });
}

export function showSuccess(title: string, text?: string): Promise<void> {
  dispatchToast({ type: 'success', title, text });
  return Promise.resolve();
}

export function showError(title: string, text?: string): Promise<void> {
  dispatchToast({ type: 'error', title, text, duration: 6000 });
  return Promise.resolve();
}

export function showWarning(title: string, text?: string): Promise<void> {
  dispatchToast({ type: 'warning', title, text });
  return Promise.resolve();
}

export interface ShowConfirmOptions {
  title: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  icon?: 'warning' | 'question' | 'info' | 'error';
  reverseButtons?: boolean;
  focusCancel?: boolean;
  inputPlaceholder?: string;
  inputValidator?: (value: string) => string | null;
}

export function showConfirm(options: ShowConfirmOptions): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  const variant =
    options.icon === 'error' || options.confirmButtonColor === '#dc2626'
      ? 'danger'
      : options.icon === 'warning'
        ? 'warning'
        : 'default';

  return new Promise((resolve) => {
    const detail: ConfirmDetail = {
      title: options.title,
      text: options.text,
      html: options.html,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      variant,
      icon: options.icon,
      inputPlaceholder: options.inputPlaceholder,
      inputValidator: options.inputValidator,
      resolve,
    };
    dispatchConfirm(detail);
  });
}
