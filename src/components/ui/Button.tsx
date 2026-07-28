'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { tokens } from '@/design/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'success' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-primary)] disabled:opacity-50',
  secondary:
    'bg-[var(--color-secondary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-secondary-hover)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-secondary)] disabled:opacity-50',
  destructive:
    'bg-[var(--color-danger)] text-[var(--color-text-inverse)] hover:bg-[var(--color-danger-hover)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-danger)] disabled:opacity-50',
  success:
    'bg-[var(--color-success)] text-[var(--color-text-inverse)] hover:bg-[var(--color-success-hover)] focus-visible:ring-white focus-visible:ring-offset-[var(--color-success)] disabled:opacity-50',
  outline:
    'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-nested)] focus-ring-outline',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-nested)] focus-ring-outline',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  disabled,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed min-h-11';
  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const radiusStyle = { borderRadius: tokens.radius[size] };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      style={{ ...radiusStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
