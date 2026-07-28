'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import {
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
  type Country,
} from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import es from 'react-phone-number-input/locale/es.json';
import 'react-phone-number-input/style.css';

/** Valida que el teléfono sea válido (E.164 con indicativo de país). */
export function isPhoneValid(phone: string): boolean {
  return !!phone && isValidPhoneNumber(phone);
}

const COUNTRY_OPTIONS_ORDER: ReturnType<typeof getCountries> = [...getCountries()].sort(
  (a, b) => (es[a as keyof typeof es] as string || a).localeCompare((es[b as keyof typeof es] as string) || b, 'es')
);

/**
 * Recorta el número nacional (sin indicativo) a `maxNationalDigits`.
 * El valor se guarda en E.164: +{indicativo}{nacional}.
 */
function limitNationalDigits(phone: string, maxNationalDigits: number, country: Country): string {
  if (!phone) return '';

  let callingCode: string;
  try {
    callingCode = getCountryCallingCode(country);
  } catch {
    return phone;
  }

  const digits = phone.replace(/\D/g, '');

  // Aún escribiendo el indicativo
  if (digits.length <= callingCode.length) {
    return phone.startsWith('+') ? `+${digits}` : digits;
  }

  const prefix = digits.startsWith(callingCode) ? callingCode : '';
  const national = prefix ? digits.slice(prefix.length) : digits;
  const truncatedNational = national.slice(0, maxNationalDigits);

  if (prefix) {
    return `+${prefix}${truncatedNational}`;
  }

  return phone.startsWith('+') ? `+${truncatedNational}` : truncatedNational;
}

export interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /**
   * Máximo de dígitos del número nacional (sin contar el indicativo de país).
   * Por defecto 10 (celular Colombia: 300 123 4567).
   */
  maxNationalDigits?: number;
  /** Mensaje cuando el número es inválido (valor con indicativo). */
  invalidMessage?: string;
  /** Mostrar borde verde cuando el número es válido. */
  showValidState?: boolean;
  /**
   * Si se define, controla el estilo de error (en lugar de validar en vivo).
   * Útil para no pintar rojo mientras el usuario escribe.
   */
  error?: boolean;
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
  onBlur,
  disabled = false,
  maxNationalDigits = 10,
  invalidMessage = defaultInvalidMessage,
  showValidState = false,
  error,
  id,
  'aria-label': ariaLabel = 'Número de teléfono',
  placeholder = 'Ej: 300 123 4567',
  className = '',
  numberInputClassName = '',
}: PhoneInputFieldProps) {
  const [country, setCountry] = useState<Country>('CO');

  const autoInvalid = !!value && !isPhoneValid(value);
  const invalid = error !== undefined ? error : autoInvalid;
  const valid = showValidState && !!value && isPhoneValid(value) && !invalid;

  const handleChange = (next: string | undefined) => {
    const raw = next ?? '';
    onChange(limitNationalDigits(raw, maxNationalDigits, country));
  };

  const inputClassName = [
    'flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 transition-colors duration-150 placeholder:text-slate-400 min-w-0 form-quiet-focus',
    disabled
      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
      : invalid
      ? 'border-[var(--color-danger-border-input)]'
      : valid
      ? 'border-green-300'
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
        country={country}
        onCountryChange={(next) => {
          if (next) setCountry(next);
        }}
        countries={COUNTRY_OPTIONS_ORDER}
        flags={flags}
        labels={es}
        placeholder={placeholder}
        value={value || undefined}
        onChange={handleChange}
        limitMaxLength
        disabled={disabled}
        className={wrapperClassName}
        numberInputProps={{
          id,
          className: inputClassName,
          required: true,
          disabled,
          'aria-label': ariaLabel,
          onBlur,
          inputMode: 'numeric',
        }}
      />
      {invalid && invalidMessage && <p className="mt-1 text-xs text-red-600">{invalidMessage}</p>}
    </div>
  );
}
