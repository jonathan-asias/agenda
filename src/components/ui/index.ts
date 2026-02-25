/**
 * Sistema UI reutilizable global.
 * Componentes con Tailwind, sin modificar lógica.
 */

export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Card, CardHeader } from './Card';
export type { CardProps, CardHeaderProps, CardVariant } from './Card';

export { default as Modal } from './Modal';
export type { ModalProps } from './Modal';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from './Table';

export { default as Loader, LoaderPage } from './Loader';
export type { LoaderProps, LoaderSize } from './Loader';

export { default as Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

export { default as Form } from './Form';
export type { FormProps } from './Form';

export { default as FormField } from './FormField';
export type { FormFieldProps } from './FormField';

export { default as Skeleton } from './Skeleton';
export { default as PhoneInputField } from './PhoneInputField';
