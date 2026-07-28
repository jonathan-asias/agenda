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
export {
  DarkSkeleton,
  StatsCardsSkeleton,
  TableRowsSkeleton,
  CardListSkeleton,
  DetailSectionsSkeleton,
  InstitutionPageSkeleton,
  DashboardPageSkeleton,
  ProfilePageSkeleton,
  ListPageSkeleton,
  WizardDataSkeleton,
} from './PageSkeletons';
export { default as PhoneInputField } from './PhoneInputField';

export { default as EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { default as ErrorBanner } from './ErrorBanner';
export type { ErrorBannerProps } from './ErrorBanner';

export { ToastHost } from './Toast';
export { ConfirmHost } from './ConfirmDialog';
export { LoadingHost } from './LoadingOverlay';
export { default as InfoTooltip } from './InfoTooltip';
export type { InfoTooltipProps } from './InfoTooltip';

export {
  default as TurnstileField,
  isTurnstileClientEnabled,
  isTurnstileVerified,
} from './TurnstileField';
export type { TurnstileFieldProps } from './TurnstileField';

/** @deprecated Usa TurnstileField / isTurnstileVerified */
export {
  default as RecaptchaField,
  isTurnstileClientEnabled as isRecaptchaClientEnabled,
  isTurnstileVerified as isRecaptchaVerified,
} from './TurnstileField';
export type { TurnstileFieldProps as RecaptchaFieldProps } from './TurnstileField';
