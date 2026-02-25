'use client';

import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber, getCountries } from 'react-phone-number-input';
import es from 'react-phone-number-input/locale/es.json';
import 'react-phone-number-input/style.css';

/** Valida que el teléfono sea válido (E.164 con indicativo de país). */
export function isPhoneValid(phone: string): boolean {
  return !!phone && isValidPhoneNumber(phone);
}

const COUNTRY_OPTIONS_ORDER: ReturnType<typeof getCountries> = [...getCountries()].sort(
  (a, b) => (es[a as keyof typeof es] as string || a).localeCompare((es[b as keyof typeof es] as string) || b, 'es')
);

export interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Mensaje cuando el número es inválido (valor con indicativo). */
  invalidMessage?: string;
  /** Mostrar borde verde cuando el número es válido. */
  showValidState?: boolean;
  id?: string;
  'aria-label'?: string;
  placeholder?: string;
  /** Clase adicional en el contenedor. */
  className?: string;
  /** Clase adicional en el input numérico (se combina con estados disabled/error/valid). */
  numberInputClassName?: string;
}

const defaultInvalidMessage = 'Ingrese un número de teléfono válido con indicativo de país';

export default function PhoneInputField({
  value,
  onChange,
  disabled = false,
  invalidMessage = defaultInvalidMessage,
  showValidState = false,
  id,
  'aria-label': ariaLabel = 'Número de teléfono',
  placeholder = 'Ej: 300 123 4567',
  className = '',
  numberInputClassName = '',
}: PhoneInputFieldProps) {
  const invalid = !!value && !isPhoneValid(value);
  const valid = showValidState && !!value && isPhoneValid(value);

  const inputClassName = [
    'flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400 min-w-0',
    disabled
      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
      : invalid
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : valid
      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
      : 'border-slate-300',
    numberInputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClassName = [
    'w-full',
    disabled ? 'PhoneInput--disabled' : '',
    invalid ? 'PhoneInput--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <PhoneInput
        international
        defaultCountry="CO"
        countries={COUNTRY_OPTIONS_ORDER}
        labels={es}
        placeholder={placeholder}
        value={value || undefined}
        onChange={(v) => onChange(v || '')}
        disabled={disabled}
        className={wrapperClassName}
        numberInputProps={{
          id,
          className: inputClassName,
          required: true,
          disabled,
          'aria-label': ariaLabel,
        }}
      />
      {invalid && invalidMessage && <p className="mt-1 text-xs text-red-600">{invalidMessage}</p>}
    </div>
  );
}
