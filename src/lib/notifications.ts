import Swal from 'sweetalert2';

/**
 * Muestra un mensaje de éxito (toast/modal).
 * @param title - Título o mensaje principal (ej: "¡Docente Eliminado!")
 * @param text - Texto opcional secundario
 */
export function showSuccess(title: string, text?: string): Promise<unknown> {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    customClass: { popup: 'rounded-2xl' },
  });
}

/**
 * Muestra un mensaje de error.
 * @param title - Título o mensaje principal (ej: "Error", "Error al eliminar")
 * @param text - Texto opcional secundario
 */
export function showError(title: string, text?: string): Promise<unknown> {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-lg' },
  });
}

export interface ShowConfirmOptions {
  title: string;
  text?: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  icon?: 'warning' | 'question' | 'info';
  reverseButtons?: boolean;
  focusCancel?: boolean;
}

/**
 * Muestra un diálogo de confirmación (Sí/Cancelar).
 * @returns Promise<true> si el usuario confirma, Promise<false> si cancela
 */
export function showConfirm(options: ShowConfirmOptions): Promise<boolean> {
  const {
    title,
    text,
    html,
    confirmButtonText = 'Sí, eliminar',
    cancelButtonText = 'Cancelar',
    confirmButtonColor = '#dc2626',
    cancelButtonColor = '#64748b',
    icon = 'warning',
    reverseButtons = true,
    focusCancel = true,
  } = options;

  return Swal.fire({
    icon,
    title,
    text,
    html,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    reverseButtons,
    focusCancel,
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-lg',
      cancelButton: 'rounded-lg',
    },
  }).then((result) => Boolean(result.isConfirmed));
}
