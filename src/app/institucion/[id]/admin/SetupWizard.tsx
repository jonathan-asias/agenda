'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback, useRef, memo, startTransition } from 'react';
import { showSuccess, showError } from '@/lib/notifications';
import PhoneInputField, { isPhoneValid } from '@/components/ui/PhoneInputField';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import InfoTooltip from '@/components/ui/InfoTooltip';
import type { Docente, Estudiante } from '@/types';
import { GRADOS_PREDETERMINADOS } from '@/lib/grados-predeterminados';
import { WizardDataSkeleton } from '@/components/ui/PageSkeletons';

interface SetupWizardProps {
  institucionId: number;
  onClose: () => void;
}

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

interface Curso {
  id: string;
  nombre: string;
  gradoId: number;
}

interface Materia {
  id: string;
  nombre: string;
  areaId: number;
}

interface MateriaCurso {
  materiaId: string;
  gradoId: number;
}

interface BufferedTextInputProps {
  value: string;
  onCommit: (value: string) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}

function BufferedTextInput({
  value,
  onCommit,
  type = 'text',
  disabled,
  className,
  placeholder,
  ariaLabel,
}: BufferedTextInputProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    if (draft !== value) onCommit(draft);
  };

  return (
    <input
      type={type}
      disabled={disabled}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className={`wizard-quiet-focus ${className || ''}`.trim()}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}

function getPasswordRequirementsDocente(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  };
}

const fieldErrorBorder = 'border-[var(--color-danger-border-input)]';
const fieldNormalBorder = 'border-slate-300';

type DocenteDatosDraft = {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
};

const DocenteDatosPersonalesPanel = memo(function DocenteDatosPersonalesPanel({
  value,
  onCommitField,
  onClearFieldError,
  camposHabilitados,
  erroresValidacion,
  camposValidados,
  emailVerificado,
  verificandoEmail,
  mostrarPassword,
  onTogglePassword,
  onVerifyEmail,
  onGeneratePassword,
  passwordEnabled,
  passwordButtonsEnabled,
}: {
  value: DocenteDatosDraft;
  onCommitField: (field: keyof DocenteDatosDraft, next: string) => void;
  onClearFieldError: (field: keyof DocenteDatosDraft) => void;
  camposHabilitados: { [key: string]: boolean };
  erroresValidacion: { [key: string]: string };
  camposValidados: { [key: string]: boolean };
  emailVerificado: boolean;
  verificandoEmail: boolean;
  mostrarPassword: boolean;
  onTogglePassword: () => void;
  onVerifyEmail: (email?: string) => void;
  onGeneratePassword: () => void;
  passwordEnabled: boolean;
  passwordButtonsEnabled: boolean;
}) {
  const [draft, setDraft] = useState(value);
  const draftRef = useRef(value);
  const apellidosRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
    draftRef.current = value;
  }, [value]);

  const updateDraft = (field: keyof DocenteDatosDraft, next: string) => {
    setDraft((prev) => {
      const updated = { ...prev, [field]: next };
      draftRef.current = updated;
      return updated;
    });
    // Quitar borde rojo mientras el usuario corrige (el error solo se revalida al salir del campo).
    if (erroresValidacion[field]) {
      onClearFieldError(field);
    }
  };

  /** Usa el valor del evento o el draft más reciente (ref) para evitar commits con estado stale. */
  const commitField = (field: keyof DocenteDatosDraft, next?: string) => {
    onCommitField(field, next !== undefined ? next : draftRef.current[field]);
  };

  const handleTelefonoChange = (val: string) => {
    updateDraft('telefono', val);
    // Habilitar email en cuanto el número sea válido, sin depender solo del blur.
    if (isPhoneValid(val)) {
      onCommitField('telefono', val);
    }
  };

  const isEmailFormatValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailChange = (val: string) => {
    updateDraft('email', val);
    // Commit al tener formato válido (habilita Verificar sin blur).
    // Si ya estaba verificado, también commit al editar para invalidar la verificación.
    if (isEmailFormatValid(val) || emailVerificado) {
      onCommitField('email', val);
    }
  };

  const passwordReqs = getPasswordRequirementsDocente(draft.password);
  const inputBase =
    'w-full px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 transition-colors duration-150 placeholder:text-slate-400 wizard-quiet-focus';

  // Habilitación local según el draft: así Tab no salta al acordeón mientras el padre aún no reaccionó al blur.
  const isNombreValido = (v: string) =>
    !!v.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim());

  const nombresOk = isNombreValido(draft.nombres);
  const apellidosOk = isNombreValido(draft.apellidos);
  const telefonoOk = isPhoneValid(draft.telefono);
  const emailOk = isEmailFormatValid(draft.email);

  const nombresEnabled = !!camposHabilitados.nombres;
  const apellidosEnabled = !!camposHabilitados.apellidos || nombresOk;
  const telefonoEnabled = !!camposHabilitados.telefono || (apellidosEnabled && apellidosOk);
  const emailEnabled = !!camposHabilitados.email || (telefonoEnabled && telefonoOk);
  const verifyEnabled = emailEnabled && emailOk && !emailVerificado && !verificandoEmail;

  const focusPhoneInput = () => {
    const input = phoneContainerRef.current?.querySelector<HTMLInputElement>(
      'input.PhoneInputInput, input[type="tel"]'
    );
    input?.focus();
  };

  /** Tab hacia adelante: confirmar campo y enfocar el siguiente lógico. */
  const handleForwardTab = (
    e: { key: string; shiftKey: boolean; preventDefault: () => void; currentTarget: HTMLInputElement },
    field: keyof DocenteDatosDraft,
    canGoNext: boolean,
    focusNext: () => void
  ) => {
    if (e.key !== 'Tab' || e.shiftKey) return;
    commitField(field, e.currentTarget.value);
    if (!canGoNext) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      focusNext();
    });
  };

  return (
    <div className="p-4 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nombres *</label>
          <input
            type="text"
            value={draft.nombres}
            onChange={(e) => updateDraft('nombres', e.target.value)}
            onBlur={(e) => commitField('nombres', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, 'nombres', nombresOk, () => apellidosRef.current?.focus())
            }
            disabled={!nombresEnabled}
            className={`${inputBase} ${
              erroresValidacion.nombres ? fieldErrorBorder : fieldNormalBorder
            } ${!nombresEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ingresa los nombres"
          />
          {erroresValidacion.nombres && (
            <p className="text-red-500 text-xs mt-1">{erroresValidacion.nombres}</p>
          )}
          {camposValidados.nombres && !erroresValidacion.nombres && (
            <p className="text-green-600 text-xs mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Nombres válidos
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Apellidos *</label>
          <input
            ref={apellidosRef}
            type="text"
            value={draft.apellidos}
            onChange={(e) => updateDraft('apellidos', e.target.value)}
            onBlur={(e) => commitField('apellidos', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, 'apellidos', apellidosOk, focusPhoneInput)
            }
            disabled={!apellidosEnabled}
            className={`${inputBase} ${
              erroresValidacion.apellidos ? fieldErrorBorder : fieldNormalBorder
            } ${!apellidosEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ingresa los apellidos"
          />
          {erroresValidacion.apellidos && (
            <p className="text-red-500 text-xs mt-1">{erroresValidacion.apellidos}</p>
          )}
          {camposValidados.apellidos && !erroresValidacion.apellidos && (
            <p className="text-green-600 text-xs mt-1 flex items-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Apellidos válidos
            </p>
          )}
        </div>

        <div
          ref={phoneContainerRef}
          onKeyDown={(e) => {
            if (e.key !== 'Tab' || e.shiftKey || !telefonoOk) return;
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT') return;
            e.preventDefault();
            commitField('telefono');
            requestAnimationFrame(() => emailRef.current?.focus());
          }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Teléfono Celular * (con indicativo de país)
          </label>
          <PhoneInputField
            value={draft.telefono}
            onChange={handleTelefonoChange}
            onBlur={() => commitField('telefono')}
            disabled={!telefonoEnabled}
            error={!!erroresValidacion.telefono}
            showValidState={!!camposValidados.telefono && !erroresValidacion.telefono}
            invalidMessage=""
            aria-label="Teléfono celular"
          />
          <div className="mt-1 min-h-[1.25rem]">
            {erroresValidacion.telefono ? (
              <p className="text-red-500 text-xs">{erroresValidacion.telefono}</p>
            ) : camposValidados.telefono ? (
              <p className="text-green-600 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Teléfono válido
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              ref={emailRef}
              type="email"
              value={draft.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={(e) => commitField('email', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Tab' && !e.shiftKey && telefonoOk) {
                  commitField('email', e.currentTarget.value);
                }
              }}
              disabled={!emailEnabled}
              className={`flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 transition-colors duration-150 placeholder:text-slate-400 wizard-quiet-focus ${
                erroresValidacion.email ? fieldErrorBorder : fieldNormalBorder
              } ${!emailEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="correo@ejemplo.com"
            />
            <button
              type="button"
              onClick={() => {
                const email = draftRef.current.email;
                commitField('email', email);
                onVerifyEmail(email);
              }}
              disabled={!verifyEnabled}
              tabIndex={verifyEnabled ? 0 : -1}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                verifyEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {verificandoEmail ? (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </div>
              ) : (
                'Verificar'
              )}
            </button>
          </div>
          <div className="mt-1 min-h-[2.5rem]">
            {erroresValidacion.email ? (
              <p className="text-red-500 text-xs">{erroresValidacion.email}</p>
            ) : verificandoEmail ? (
              <p className="text-blue-600 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comprobando email...
              </p>
            ) : emailVerificado ? (
              <p className="text-green-600 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email verificado y disponible
              </p>
            ) : emailOk ? (
              <p className="text-amber-600 text-xs flex items-center">
                <svg className="w-3 h-3 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Email válido. Haz clic en &quot;Verificar&quot; para comprobar disponibilidad
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña *</label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 h-11">
            <input
              ref={passwordRef}
              type={mostrarPassword ? 'text' : 'password'}
              value={draft.password}
              onChange={(e) => updateDraft('password', e.target.value)}
              onBlur={(e) => commitField('password', e.target.value)}
              disabled={!passwordEnabled}
              autoComplete="new-password"
              spellCheck={false}
              className={`wizard-quiet-focus absolute inset-0 h-11 w-full box-border px-3 pr-11 border rounded-lg text-sm leading-none text-slate-900 font-[inherit] tracking-normal [font-variant-ligatures:none] transition-colors duration-150 ${
                erroresValidacion.password ? fieldErrorBorder : fieldNormalBorder
              } ${!passwordEnabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onTogglePassword}
              disabled={!passwordButtonsEnabled}
              tabIndex={passwordButtonsEnabled ? 0 : -1}
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                {mostrarPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={onGeneratePassword}
            disabled={!passwordButtonsEnabled}
            tabIndex={passwordButtonsEnabled ? 0 : -1}
            className={`w-full sm:w-auto h-11 px-3 rounded-lg transition-colors flex items-center justify-center ${
              passwordButtonsEnabled
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generar
          </button>
        </div>
        <div className="mt-1 min-h-[1.25rem]">
          {erroresValidacion.password ? (
            <p className="text-red-500 text-xs">{erroresValidacion.password}</p>
          ) : camposValidados.password ? (
            <p className="text-green-600 text-xs flex items-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Contraseña válida
            </p>
          ) : null}
        </div>
        <div className="mt-2 text-xs text-slate-500 space-y-1">
          {(
            [
              [passwordReqs.length, 'Al menos 8 caracteres'],
              [passwordReqs.upper, 'Una letra mayúscula'],
              [passwordReqs.lower, 'Una letra minúscula'],
              [passwordReqs.number, 'Un número'],
              [passwordReqs.symbol, 'Un símbolo (@$!%*?&)'],
            ] as const
          ).map(([ok, label]) => (
            <p key={label} className={ok ? 'text-green-600' : 'text-slate-500'}>
              {ok ? '✓' : '•'} {label}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h5 className="font-medium text-blue-900 mb-2">🏢 Asignación Institucional</h5>
        <p className="text-sm text-blue-700">
          El docente será asignado automáticamente a la misma sede del administrador
        </p>
      </div>
    </div>
  );
});

function assignmentKey(gradoId: number, materiaId: string) {
  return `${gradoId}:${materiaId}`;
}

const GradoMateriasCheckboxes = memo(function GradoMateriasCheckboxes({
  grado,
  materias,
  assignedKeys,
  onToggle,
  onToggleAll,
}: {
  grado: { id: number; nombre: string; cursos: unknown[] };
  materias: Materia[];
  assignedKeys: Set<string>;
  onToggle: (gradoId: number, materiaId: string, checked: boolean) => void;
  onToggleAll: (gradoId: number, materiaIds: string[], checked: boolean) => void;
}) {
  const selectedCount = materias.filter((materia) =>
    assignedKeys.has(assignmentKey(grado.id, materia.id))
  ).length;
  const allSelected = materias.length > 0 && selectedCount === materias.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h5 className="break-words font-semibold text-slate-900">{grado.nombre}</h5>
          <span className="text-sm text-slate-500">
            {grado.cursos.length} curso{grado.cursos.length !== 1 ? 's' : ''}
            {materias.length > 0 && (
              <> · {selectedCount}/{materias.length} materias</>
            )}
          </span>
        </div>
        {materias.length > 0 && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={(e) =>
                onToggleAll(
                  grado.id,
                  materias.map((materia) => materia.id),
                  e.target.checked
                )
              }
              className="wizard-quiet-focus h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            Seleccionar todas
          </label>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {materias.map((materia) => {
          const isAsignada = assignedKeys.has(assignmentKey(grado.id, materia.id));
          return (
            <label
              key={materia.id}
              className={`flex cursor-pointer items-center space-x-2 rounded-lg border p-2 transition-colors ${
                isAsignada
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <input
                type="checkbox"
                checked={isAsignada}
                onChange={(e) => onToggle(grado.id, materia.id, e.target.checked)}
                className="wizard-quiet-focus h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-medium text-slate-900">{materia.nombre}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
});

const AsignarMateriasAGradosPanel = memo(function AsignarMateriasAGradosPanel({
  grados,
  materias,
  value,
  onChange,
}: {
  grados: Array<{ id: number; nombre: string; cursos: unknown[] }>;
  materias: Materia[];
  value: MateriaCurso[];
  onChange: (next: MateriaCurso[]) => void;
}) {
  const [assignedKeys, setAssignedKeys] = useState(
    () => new Set(value.map((item) => assignmentKey(item.gradoId, item.materiaId)))
  );

  useEffect(() => {
    setAssignedKeys(new Set(value.map((item) => assignmentKey(item.gradoId, item.materiaId))));
  }, [value]);

  const commitKeys = useCallback(
    (next: Set<string>) => {
      setAssignedKeys(next);
      const nextValue: MateriaCurso[] = Array.from(next, (entry) => {
        const sep = entry.indexOf(':');
        return {
          gradoId: Number(entry.slice(0, sep)),
          materiaId: entry.slice(sep + 1),
        };
      });
      startTransition(() => onChange(nextValue));
    },
    [onChange]
  );

  const handleToggle = useCallback(
    (gradoId: number, materiaId: string, checked: boolean) => {
      const key = assignmentKey(gradoId, materiaId);
      const next = new Set(assignedKeys);
      if (checked) next.add(key);
      else next.delete(key);
      commitKeys(next);
    },
    [assignedKeys, commitKeys]
  );

  const handleToggleAll = useCallback(
    (gradoId: number, materiaIds: string[], checked: boolean) => {
      const next = new Set(assignedKeys);
      materiaIds.forEach((materiaId) => {
        const key = assignmentKey(gradoId, materiaId);
        if (checked) next.add(key);
        else next.delete(key);
      });
      commitKeys(next);
    },
    [assignedKeys, commitKeys]
  );

  return (
    <div className="space-y-4">
      {grados.map((grado) => (
        <GradoMateriasCheckboxes
          key={grado.id}
          grado={grado}
          materias={materias}
          assignedKeys={assignedKeys}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
        />
      ))}
    </div>
  );
});

const AreasTogglePanel = memo(function AreasTogglePanel({
  areas,
  value,
  onChange,
}: {
  areas: Array<{ id: number; nombre: string; es_opcional: boolean }>;
  value: number[];
  onChange: (next: number[], toggledId: number, active: boolean) => void;
}) {
  const [activeIds, setActiveIds] = useState(() => new Set(value));

  useEffect(() => {
    setActiveIds(new Set(value));
  }, [value]);

  const toggle = useCallback(
    (areaId: number) => {
      const next = new Set(activeIds);
      const active = !next.has(areaId);
      if (active) next.add(areaId);
      else next.delete(areaId);

      setActiveIds(next);
      startTransition(() => onChange(Array.from(next), areaId, active));
    },
    [activeIds, onChange]
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {areas.map((area) => {
          const active = activeIds.has(area.id);
          return (
            <div
              key={area.id}
              className={`flex flex-col gap-3 rounded-lg border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                active ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="break-words font-medium text-slate-900">{area.nombre}</span>
                  {area.es_opcional && (
                    <span className="shrink-0 rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
                      Opcional
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label={`${active ? 'Desactivar' : 'Activar'} ${area.nombre}`}
                onClick={() => toggle(area.id)}
                className={`form-quiet-focus h-6 w-12 flex-shrink-0 rounded-full transition-colors ${
                  active ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    active ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const MateriasEditorPanel = memo(function MateriasEditorPanel({
  activeAreaIds,
  areas,
  examples,
  value,
  onChange,
}: {
  activeAreaIds: number[];
  areas: Array<{ id: number; nombre: string }>;
  examples: Record<number, string[]>;
  value: Materia[];
  onChange: (next: Materia[]) => void;
}) {
  const [localMaterias, setLocalMaterias] = useState(value);

  useEffect(() => {
    setLocalMaterias(value);
  }, [value]);

  const update = useCallback(
    (next: Materia[]) => {
      setLocalMaterias(next);
      startTransition(() => onChange(next));
    },
    [onChange]
  );

  const addMateria = useCallback(
    (areaId: number) => {
      const next = [
        ...localMaterias,
        {
          id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          nombre: 'Nueva Materia',
          areaId,
        },
      ];
      update(next);
    },
    [localMaterias, update]
  );

  return (
    <div className="space-y-4">
      {activeAreaIds.map((areaId) => {
        const area = areas.find((item) => item.id === areaId);
        const materiasDelArea = localMaterias.filter((materia) => materia.areaId === areaId);

        return (
          <div key={areaId} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h5 className="break-words font-semibold text-slate-900">{area?.nombre}</h5>
                <InfoTooltip
                  label={`Ejemplo de materias para ${area?.nombre}`}
                  size="sm"
                  panelVariant="light"
                  triggerVariant="muted"
                >
                  <div className="font-semibold text-slate-700">Ejemplos:</div>
                  {(examples[area?.id || 0] || ['Materia A', 'Materia B', 'Materia C'])
                    .slice(0, 3)
                    .map((example) => (
                      <div key={example}>{example}</div>
                    ))}
                  <div className="mt-2 text-[11px] text-orange-600">
                    El nombre de la materia debe seguir los estándares de la institución.
                  </div>
                </InfoTooltip>
              </div>
              <button
                type="button"
                onClick={() => addMateria(areaId)}
                className="flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Materia
              </button>
            </div>

            {materiasDelArea.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {materiasDelArea.map((materia) => (
                  <div
                    key={materia.id}
                    className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
                  >
                    <BufferedTextInput
                      value={materia.nombre}
                      onCommit={(nombre) => {
                        update(
                          localMaterias.map((item) =>
                            item.id === materia.id ? { ...item, nombre } : item
                          )
                        );
                      }}
                      className="flex-1 border-none bg-transparent text-sm font-medium text-slate-900 focus:outline-none focus:ring-0"
                      ariaLabel={`Nombre de la materia en ${area?.nombre || 'el área'}`}
                    />
                    <button
                      type="button"
                      onClick={() => update(localMaterias.filter((item) => item.id !== materia.id))}
                      className="rounded p-1 text-red-600 transition-colors hover:bg-red-50"
                      aria-label={`Eliminar materia ${materia.nombre}`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

interface DocenteForm {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
}

interface EstudianteForm {
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente: string;
  telefono_acudiente: string;
  grado_id: number;
  curso_id: number;
}

const isEstudianteNombreValido = (v: string) =>
  !!v.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim());

const isEstudianteEmailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const EstudianteFormPanel = memo(function EstudianteFormPanel({
  value,
  onFieldChange,
  camposHabilitados,
  erroresValidacion,
  camposValidados,
  gradosDisponibles,
  cursosDisponibles,
  cargandoCursos = false,
  onLimpiar,
  onAgregar,
}: {
  value: EstudianteForm;
  onFieldChange: (field: keyof EstudianteForm, next: string | number) => void;
  camposHabilitados: { [key: string]: boolean };
  erroresValidacion: { [key: string]: string };
  camposValidados: { [key: string]: boolean };
  gradosDisponibles: Array<{ id: number; nombre: string; nivel: string }>;
  cursosDisponibles: Array<{ id: number; nombre: string }>;
  cargandoCursos?: boolean;
  onLimpiar: () => void;
  onAgregar: () => void;
}) {
  const apellidosRef = useRef<HTMLInputElement>(null);
  const codigoRef = useRef<HTMLInputElement>(null);
  const nombreAcudienteRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const telefonoContainerRef = useRef<HTMLDivElement>(null);
  const gradoRef = useRef<HTMLSelectElement>(null);
  const cursoRef = useRef<HTMLSelectElement>(null);

  const nombresOk = isEstudianteNombreValido(value.nombres);
  const apellidosOk = isEstudianteNombreValido(value.apellidos);
  const codigoOk = value.codigo_estudiantil.trim().length >= 3;
  const nombreAcudienteOk = isEstudianteNombreValido(value.nombre_acudiente);
  const correoOk = isEstudianteEmailValido(value.correo_acudiente);
  const telefonoOk = isPhoneValid(value.telefono_acudiente);
  const gradoOk = value.grado_id > 0;

  const nombresEnabled = !!camposHabilitados.nombres;
  const apellidosEnabled = !!camposHabilitados.apellidos || nombresOk;
  const codigoEnabled = !!camposHabilitados.codigo_estudiantil || (apellidosEnabled && apellidosOk);
  const nombreAcudienteEnabled =
    !!camposHabilitados.nombre_acudiente || (codigoEnabled && codigoOk);
  const correoEnabled =
    !!camposHabilitados.correo_acudiente || (nombreAcudienteEnabled && nombreAcudienteOk);
  const telefonoEnabled = !!camposHabilitados.telefono_acudiente || (correoEnabled && correoOk);
  const gradoEnabled = !!camposHabilitados.grado_id || (telefonoEnabled && telefonoOk);
  const cursoEnabled =
    !cargandoCursos &&
    (!!camposHabilitados.curso_id || (gradoEnabled && gradoOk)) &&
    cursosDisponibles.length > 0;

  const inputBase =
    'w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 transition-all duration-200 placeholder:text-slate-400';

  const focusPhoneInput = () => {
    telefonoContainerRef.current
      ?.querySelector<HTMLInputElement>('input.PhoneInputInput, input[type="tel"]')
      ?.focus();
  };

  const handleForwardTab = (
    e: { key: string; shiftKey: boolean; preventDefault: () => void },
    canGoNext: boolean,
    focusNext: () => void
  ) => {
    if (e.key !== 'Tab' || e.shiftKey || !canGoNext) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      focusNext();
    });
  };

  const fieldFeedback = (field: string, label = '✓ Válido') => (
    <div className="mt-1 min-h-[1.25rem]">
      {erroresValidacion[field] ? (
        <p className="text-red-500 text-xs">{erroresValidacion[field]}</p>
      ) : camposValidados[field] ? (
        <p className="text-green-600 text-xs flex items-center">
          <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {label}
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h4 className="text-lg font-semibold text-slate-900 mb-4">Agregar Estudiante</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombres del Estudiante *
          </label>
          <input
            type="text"
            value={value.nombres}
            onChange={(e) => onFieldChange('nombres', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, nombresOk, () => apellidosRef.current?.focus())
            }
            disabled={!nombresEnabled}
            className={`${inputBase} ${
              erroresValidacion.nombres ? 'border-red-500' : 'border-slate-300'
            } ${!nombresEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ingresa los nombres"
          />
          {fieldFeedback('nombres')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apellidos del Estudiante *
          </label>
          <input
            ref={apellidosRef}
            type="text"
            value={value.apellidos}
            onChange={(e) => onFieldChange('apellidos', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, apellidosOk, () => codigoRef.current?.focus())
            }
            disabled={!apellidosEnabled}
            className={`${inputBase} ${
              erroresValidacion.apellidos ? 'border-red-500' : 'border-slate-300'
            } ${!apellidosEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ingresa los apellidos"
          />
          {fieldFeedback('apellidos')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Código del Estudiante *
          </label>
          <input
            ref={codigoRef}
            type="text"
            value={value.codigo_estudiantil}
            onChange={(e) => onFieldChange('codigo_estudiantil', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, codigoOk, () => nombreAcudienteRef.current?.focus())
            }
            disabled={!codigoEnabled}
            className={`${inputBase} ${
              erroresValidacion.codigo_estudiantil ? 'border-red-500' : 'border-slate-300'
            } ${!codigoEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ej: EST001"
          />
          {fieldFeedback('codigo_estudiantil')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del Acudiente *
          </label>
          <input
            ref={nombreAcudienteRef}
            type="text"
            value={value.nombre_acudiente}
            onChange={(e) => onFieldChange('nombre_acudiente', e.target.value)}
            onKeyDown={(e) =>
              handleForwardTab(e, nombreAcudienteOk, () => correoRef.current?.focus())
            }
            disabled={!nombreAcudienteEnabled}
            className={`${inputBase} ${
              erroresValidacion.nombre_acudiente ? 'border-red-500' : 'border-slate-300'
            } ${!nombreAcudienteEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Nombre completo del acudiente"
          />
          {fieldFeedback('nombre_acudiente')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Correo del Acudiente *
          </label>
          <input
            ref={correoRef}
            type="email"
            value={value.correo_acudiente}
            onChange={(e) => onFieldChange('correo_acudiente', e.target.value)}
            onKeyDown={(e) => handleForwardTab(e, correoOk, focusPhoneInput)}
            disabled={!correoEnabled}
            className={`${inputBase} ${
              erroresValidacion.correo_acudiente ? 'border-red-500' : 'border-slate-300'
            } ${!correoEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="correo@ejemplo.com"
          />
          {fieldFeedback('correo_acudiente')}
        </div>

        <div
          ref={telefonoContainerRef}
          onKeyDown={(e) => {
            if (e.key !== 'Tab' || e.shiftKey || !telefonoOk) return;
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT') return;
            e.preventDefault();
            requestAnimationFrame(() => gradoRef.current?.focus());
          }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Teléfono del Acudiente * (con indicativo de país)
          </label>
          <PhoneInputField
            value={value.telefono_acudiente}
            onChange={(val) => onFieldChange('telefono_acudiente', val)}
            disabled={!telefonoEnabled}
            showValidState={!!camposValidados.telefono_acudiente && !erroresValidacion.telefono_acudiente}
            invalidMessage=""
            aria-label="Teléfono del acudiente"
          />
          {fieldFeedback('telefono_acudiente')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Grado *</label>
          <select
            ref={gradoRef}
            value={value.grado_id}
            onChange={(e) => onFieldChange('grado_id', parseInt(e.target.value, 10))}
            onKeyDown={(e) =>
              handleForwardTab(e, gradoOk && cursosDisponibles.length > 0, () =>
                cursoRef.current?.focus()
              )
            }
            disabled={!gradoEnabled}
            className={`${inputBase} ${
              erroresValidacion.grado_id ? 'border-red-500' : 'border-slate-300'
            } ${!gradoEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value={0}>Selecciona un grado</option>
            {gradosDisponibles.map((grado) => (
              <option key={grado.id} value={grado.id}>
                {grado.nombre} - {grado.nivel}
              </option>
            ))}
          </select>
          {fieldFeedback('grado_id')}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Curso *</label>
          <select
            ref={cursoRef}
            value={value.curso_id}
            onChange={(e) => onFieldChange('curso_id', parseInt(e.target.value, 10))}
            disabled={!cursoEnabled}
            className={`${inputBase} ${
              erroresValidacion.curso_id ? 'border-red-500' : 'border-slate-300'
            } ${!cursoEnabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value={0}>
              {cargandoCursos
                ? 'Cargando…'
                : cursosDisponibles.length === 0
                  ? 'Selecciona un grado primero'
                  : 'Selecciona un curso'}
            </option>
            {!cargandoCursos &&
              cursosDisponibles.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
          </select>
          {fieldFeedback('curso_id')}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6">
        <button
          type="button"
          onClick={onLimpiar}
          className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-left sm:text-center"
        >
          Limpiar formulario
        </button>
        <button
          type="button"
          onClick={onAgregar}
          disabled={Object.keys(erroresValidacion).length > 0}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
            Object.keys(erroresValidacion).length > 0
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Agregar Estudiante
        </button>
      </div>
    </div>
  );
});

interface AsignacionDocente {
  docenteId: number;
  materiaId: number;
  gradoId: number;
  cursoId: number;
}

export default function SetupWizard({ institucionId, onClose }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [brandingColors, setBrandingColors] = useState({
    primary: '#2563eb',
    secondary: '#0f172a'
  });
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoParaEliminar, setCursoParaEliminar] = useState<{
    cursoId: number;
    gradoId: number;
    nombre: string;
  } | null>(null);
  const [eliminandoCurso, setEliminandoCurso] = useState(false);
  const [duplicadosCursos, setDuplicadosCursos] = useState<string[] | null>(null);
  const [mostrarExitoGradosCursos, setMostrarExitoGradosCursos] = useState<{
    gradosCreados: number;
    cursosCreados: number;
  } | null>(null);
  const [mostrarExitoAreasMaterias, setMostrarExitoAreasMaterias] = useState<{
    areasCreadas: number;
    materiasCreadas: number;
  } | null>(null);
  const [modalEmailDocente, setModalEmailDocente] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [modalDocenteAccion, setModalDocenteAccion] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [modalEstudianteAccion, setModalEstudianteAccion] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [estudianteParaEliminar, setEstudianteParaEliminar] = useState<{
    estudianteId: number;
    nombre: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Estados para áreas y materias
  const [areasActivas, setAreasActivas] = useState<number[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiasPorCurso, setMateriasPorCurso] = useState<MateriaCurso[]>([]);
  
  // Estados para docentes
  const [docentes, setDocentes] = useState<Docente[]>([]);
  /** Contraseñas definidas en el wizard (no se persisten en el tipo Docente). */
  const [passwordsPorDocente, setPasswordsPorDocente] = useState<Record<number, string>>({});
  const [docenteActual, setDocenteActual] = useState<DocenteForm>({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  });
  
  // Estados para estudiantes
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteActual, setEstudianteActual] = useState<EstudianteForm>({
    nombres: '',
    apellidos: '',
    codigo_estudiantil: '',
    nombre_acudiente: '',
    correo_acudiente: '',
    telefono_acudiente: '',
    grado_id: 0,
    curso_id: 0
  });
  
  // Estados para grados y cursos
  const [gradosDisponibles, setGradosDisponibles] = useState<any[]>([]);
  const [cursosDisponibles, setCursosDisponibles] = useState<any[]>([]);
  const [todosLosCursos, setTodosLosCursos] = useState<any[]>([]); // Para mantener todos los cursos cargados
  const [cargandoGrados, setCargandoGrados] = useState(false);
  const [cargandoCursos, setCargandoCursos] = useState(false);
  const [asignacionesDocente, setAsignacionesDocente] = useState<AsignacionDocente[]>([]);
  const [asignacionesPorDocente, setAsignacionesPorDocente] = useState<{[key: number]: {
    asignaciones: {
      gradoId: number;
      cursoId: number;
      gradoNombre: string;
      cursoNombre: string;
      materiasSeleccionadas: number[];
    }[]
  }}>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  // Estados para asignaciones del docente actual (nueva estructura)
  const [asignacionesGradoCurso, setAsignacionesGradoCurso] = useState<{
    gradoId: number;
    cursoId: number;
    gradoNombre: string;
    cursoNombre: string;
    materiasSeleccionadas: number[];
  }[]>([]);
  
  // Estado para controlar qué docentes tienen las asignaciones expandidas
  const [asignacionesExpandidas, setAsignacionesExpandidas] = useState<{[docenteId: number]: boolean}>({});
  
  // Estado para el modal de confirmación de guardado
  const [mostrarConfirmacionGuardado, setMostrarConfirmacionGuardado] = useState(false);
  
  // Estados legacy (se mantienen temporalmente para compatibilidad)
  const [gradosSeleccionados, setGradosSeleccionados] = useState<number[]>([]);
  const [cursosPorGrado, setCursosPorGrado] = useState<{[gradoId: number]: number[]}>({});
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<number[]>([]);
  const [materiasPorArea, setMateriasPorArea] = useState<{[areaId: number]: number[]}>({});
  
  // Estados para cargar datos desde la base de datos
  const [areasCargadas, setAreasCargadas] = useState<any[]>([]);
  const [materiasCargadas, setMateriasCargadas] = useState<any[]>([]);
  const [materiasGradosCargados, setMateriasGradosCargados] = useState<any[]>([]);
  const [cargandoAreasMaterias, setCargandoAreasMaterias] = useState(false);
  
  // Estados para filtrado inteligente
  const [materiasFiltradas, setMateriasFiltradas] = useState<any[]>([]);
  const [materiasPorGrado, setMateriasPorGrado] = useState<{[gradoId: number]: any[]}>({});
  
  // Estados para control del acordeón
  const [seccionActiva, setSeccionActiva] = useState<string>('datos');
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<{[key: string]: boolean}>({
    datos: false,
    grados: false,
    materias: false
  });
  const [seccionesHabilitadas, setSeccionesHabilitadas] = useState<{[key: string]: boolean}>({
    datos: true,
    grados: false,
    materias: false
  });
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const [camposHabilitados, setCamposHabilitados] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });
  const [camposValidados, setCamposValidados] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });
  
  // Estados de validación para estudiantes
  const [erroresValidacionEstudiante, setErroresValidacionEstudiante] = useState<{[key: string]: string}>({});
  const [camposHabilitadosEstudiante, setCamposHabilitadosEstudiante] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    codigo_estudiantil: false,
    nombre_acudiente: false,
    correo_acudiente: false,
    telefono_acudiente: false,
    grado_id: false,
    curso_id: false
  });
  const [camposValidadosEstudiante, setCamposValidadosEstudiante] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    codigo_estudiantil: false,
    nombre_acudiente: false,
    correo_acudiente: false,
    telefono_acudiente: false,
    grado_id: false,
    curso_id: false
  });
  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);

  // Función para determinar si los botones de contraseña deben estar habilitados
  const botonesPasswordHabilitados = () => {
    return camposValidados.email && !erroresValidacion.email && !verificandoEmail && emailVerificado;
  };

  // Función para verificar si el campo de contraseña debe estar habilitado
  const campoPasswordHabilitado = () => {
    return camposValidados.email && !erroresValidacion.email && !verificandoEmail && emailVerificado;
  };
  
  // Estados para resumen y confirmación
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarResumenAreas, setMostrarResumenAreas] = useState(false);
  const [gradosGuardados, setGradosGuardados] = useState<any[]>([]);
  const [cursosGuardados, setCursosGuardados] = useState<any[]>([]);
  const [gradosCargados, setGradosCargados] = useState<any[]>([]);
  const [mostrarGradosDisponibles, setMostrarGradosDisponibles] = useState(true);
  const [mostrarAreasMateriasDisponibles, setMostrarAreasMateriasDisponibles] = useState(true);

  const gradosPredeterminados = [...GRADOS_PREDETERMINADOS];

  // Áreas predefinidas según Ley 115 de 1994
  const areasPredeterminadas = [
    { id: 1, nombre: 'Ciencias naturales y educación ambiental', es_opcional: false, orden: 1 },
    { id: 2, nombre: 'Ciencias sociales, historia, geografía, constitución política y democracia', es_opcional: false, orden: 2 },
    { id: 3, nombre: 'Educación artística y cultural', es_opcional: false, orden: 3 },
    { id: 4, nombre: 'Educación ética y en valores humanos', es_opcional: false, orden: 4 },
    { id: 5, nombre: 'Educación física, recreación y deportes', es_opcional: false, orden: 5 },
    { id: 6, nombre: 'Educación religiosa', es_opcional: false, orden: 6 },
    { id: 7, nombre: 'Humanidades, lengua castellana e idiomas extranjeros', es_opcional: false, orden: 7 },
    { id: 8, nombre: 'Matemáticas', es_opcional: false, orden: 8 },
    { id: 9, nombre: 'Tecnología e informática', es_opcional: false, orden: 9 },
    { id: 10, nombre: 'Filosofía', es_opcional: true, orden: 10 },
    { id: 11, nombre: 'Educación sexual', es_opcional: true, orden: 11 },
    { id: 12, nombre: 'Cátedras y emprendimiento', es_opcional: true, orden: 12 },
    { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 },
  ];

  const ejemplosMateriasPorArea: Record<number, string[]> = {
    1: ['Biología', 'Física', 'Química', 'Ciencias ambientales'],
    2: ['Historia', 'Geografía', 'Ciencias sociales', 'Democracia'],
    3: ['Artes plásticas', 'Música', 'Teatro', 'Danza'],
    4: ['Ética', 'Valores', 'Convivencia', 'Ciudadanía'],
    5: ['Educación física', 'Deportes', 'Recreación', 'Psicomotricidad'],
    6: ['Religión', 'Ética religiosa', 'Cultura religiosa', 'Espiritualidad'],
    7: ['Lengua castellana', 'Inglés', 'Lectura crítica', 'Literatura'],
    8: ['Álgebra', 'Cálculo', 'Matemáticas básicas', 'Geometría'],
    9: ['Informática', 'Programación', 'Robótica', 'Tecnología'],
    10: ['Lógica', 'Filosofía', 'Pensamiento crítico', 'Ética filosófica'],
    11: ['Educación sexual', 'Salud sexual', 'Autocuidado', 'Afectividad'],
    12: ['Emprendimiento', 'Finanzas básicas', 'Proyectos', 'Innovación'],
    13: ['Disciplina', 'Convivencia', 'Normas', 'Comportamiento']
  };

  // Agrupar grados por nivel
  const gradosPorNivel = gradosPredeterminados.reduce((acc, grado) => {
    if (!acc[grado.nivel]) {
      acc[grado.nivel] = [];
    }
    acc[grado.nivel].push(grado);
    return acc;
  }, {} as Record<string, typeof gradosPredeterminados>);

  const agregarCurso = (gradoId: number) => {
    const nuevoCurso: Curso = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      nombre: '',
      gradoId,
    };

    setCursos((prev) => [...prev, nuevoCurso]);
  };

  const eliminarCurso = (cursoId: string) => {
    setCursos(cursos.filter(c => c.id !== cursoId));
  };

  const editarNombreCurso = (cursoId: string, nuevoNombre: string) => {
    setCursos(cursos.map(c => c.id === cursoId ? { ...c, nombre: nuevoNombre } : c));
  };

  const eliminarCursoGuardado = async (cursoId: number, gradoId: number) => {
    try {
      const response = await fetch(`/api/cursos/${cursoId}?institucionId=${institucionId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        await showError('Error', data?.error || 'No se pudo eliminar el curso');
        return;
      }

      setGradosCargados(prev =>
        prev.map((grado: any) =>
          grado.id === gradoId
            ? { ...grado, cursos: grado.cursos.filter((c: any) => c.id !== cursoId) }
            : grado
        )
      );
      setCursosDisponibles(prev => prev.filter((curso: any) => curso.id !== cursoId));
      setTodosLosCursos(prev => prev.filter((curso: any) => curso.id !== cursoId));
      setAsignacionesGradoCurso(prev => prev.filter(asignacion => asignacion.cursoId !== cursoId));
      setEstudianteActual(prev => (prev.curso_id === cursoId ? { ...prev, curso_id: 0 } : prev));
    } catch (error) {
      console.error('Error eliminando curso:', error);
      await showError('Error de conexión', 'Error de conexión al eliminar el curso');
    }
  };

  // Función para cargar grados desde la BD
  const cargarGrados = async () => {
    setCargandoGrados(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGradosCargados(data.grados);
        console.log('Grados cargados:', data.grados);
      } else {
        console.error('Error cargando grados');
      }
    } catch (error) {
      console.error('Error cargando grados:', error);
    } finally {
      setCargandoGrados(false);
    }
  };

  // Función para cargar grados para estudiantes
  const cargarGradosEstudiantes = async () => {
    setCargandoGrados(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGradosDisponibles(data.grados);
        console.log('Grados disponibles para estudiantes:', data.grados);
      } else {
        console.error('Error cargando grados para estudiantes');
      }
    } catch (error) {
      console.error('Error cargando grados para estudiantes:', error);
    } finally {
      setCargandoGrados(false);
    }
  };

  // Función para cargar cursos según el grado seleccionado
  const cargarCursosPorGrado = async (gradoId: number) => {
    setCargandoCursos(true);
    setCursosDisponibles([]);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        const grados = data.grados;
        const gradoSeleccionado = grados.find((g: any) => g.id === gradoId);
        if (gradoSeleccionado && gradoSeleccionado.cursos) {
          setCursosDisponibles(gradoSeleccionado.cursos);
          // Agregar estos cursos a la lista de todos los cursos si no existen
          setTodosLosCursos(prev => {
            const cursosExistentes = prev.map(c => c.id);
            const nuevosCursos = gradoSeleccionado.cursos.filter((curso: any) => !cursosExistentes.includes(curso.id));
            return [...prev, ...nuevosCursos];
          });
          console.log('Cursos disponibles para grado', gradoId, ':', gradoSeleccionado.cursos);
        } else {
          setCursosDisponibles([]);
          console.log('No hay cursos disponibles para el grado seleccionado');
        }
      } else {
        console.error('Error cargando cursos');
        setCursosDisponibles([]);
      }
    } catch (error) {
      console.error('Error cargando cursos:', error);
      setCursosDisponibles([]);
    } finally {
      setCargandoCursos(false);
    }
  };

  // Función para cargar áreas y materias desde la base de datos
  const cargarAreasMaterias = async () => {
    setCargandoAreasMaterias(true);
    try {
      const [responseAreas, responseMaterias, responseMateriasGrados] = await Promise.all([
        fetch(`/api/setup/areas/${institucionId}`),
        fetch(`/api/setup/materias/${institucionId}`),
        fetch(`/api/setup/materias-grados/${institucionId}`),
      ]);

      if (responseAreas.ok) {
        const dataAreas = await responseAreas.json();
        setAreasCargadas(dataAreas.areas || []);
      }

      if (responseMaterias.ok) {
        const dataMaterias = await responseMaterias.json();
        setMateriasCargadas(dataMaterias.materias || []);
      }

      if (responseMateriasGrados.ok) {
        const dataMateriasGrados = await responseMateriasGrados.json();
        setMateriasGradosCargados(dataMateriasGrados.materiasGrados || []);
      } else {
        console.error(
          'Error cargando materias-grados:',
          responseMateriasGrados.status,
          responseMateriasGrados.statusText
        );
      }
    } catch (error) {
      console.error('Error cargando áreas y materias:', error);
    } finally {
      setCargandoAreasMaterias(false);
    }
  };

  // Función para guardar áreas y materias
  // Función para generar contraseña aleatoria
  const generarPassword = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setDocenteActual(prev => ({ ...prev, password }));
  };

  // Función para limpiar formulario de docente
  // Función helper para obtener datos de materia y área por ID
  const obtenerDatosMateriaYArea = (materiaId: number) => {
    console.log(`🔍 Buscando materia ID: ${materiaId}`);
    
    // Buscar materia en materiasCargadas
    const materia = materiasCargadas.find(m => m.id === materiaId);
    console.log(`📚 Materia encontrada:`, materia);
    
    if (!materia) {
      console.log(`❌ Materia no encontrada para ID: ${materiaId}`);
      return { materiaNombre: `Materia ID: ${materiaId}`, areaNombre: 'Sin área' };
    }
    
    // Usar area_id en lugar de areaId (snake_case vs camelCase)
    const areaId = materia.area_id || materia.areaId;
    console.log(`🏫 Área ID de la materia: ${areaId} (tipo: ${typeof areaId})`);
    console.log(`📋 Áreas disponibles:`, areasCargadas.map(a => ({ id: a.id, nombre: a.nombre })));
    
    // Validar que areaId existe
    if (!areaId) {
      console.log(`❌ area_id/areaId es undefined/null:`, { area_id: materia.area_id, areaId: materia.areaId });
      return {
        materiaNombre: materia.nombre || `Materia ID: ${materiaId}`,
        areaNombre: 'Sin área (area_id undefined)'
      };
    }
    
    // Buscar área en areasCargadas usando areaId (con comparación flexible)
    let area = areasCargadas.find(a => a.id === areaId);
    
    // Si no se encuentra, intentar con conversión de tipos
    if (!area) {
      console.log(`⚠️ No se encontró con comparación exacta, intentando conversión de tipos...`);
      area = areasCargadas.find(a => a.id == areaId); // Comparación flexible
    }
    
    // Si aún no se encuentra, intentar con toString() (solo si ambos valores existen)
    if (!area && areaId != null) {
      console.log(`⚠️ Intentando con toString()...`);
      area = areasCargadas.find(a => a && a.id != null && a.id.toString() === areaId.toString());
    }
    
    console.log(`🎯 Área encontrada:`, area);
    
    if (!area) {
      console.log(`❌ Área no encontrada para ID: ${areaId}`);
      console.log(`🔍 IDs de áreas disponibles:`, areasCargadas.map(a => a.id));
      console.log(`🔍 Tipos de IDs:`, areasCargadas.map(a => ({ id: a.id, tipo: typeof a.id })));
    }
    
    return {
      materiaNombre: materia.nombre || `Materia ID: ${materiaId}`,
      areaNombre: area?.nombre || 'Sin área'
    };
  };

  const limpiarFormularioDocente = () => {
    setDocenteActual({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setAsignacionesDocente([]);
    setErroresValidacion({});
    setCamposHabilitados({
      nombres: true,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setCamposValidados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setVerificandoEmail(false);
    setEmailVerificado(false);
    
    // Limpiar selecciones de asignación (nueva estructura)
    setAsignacionesGradoCurso([]);
    
    // Limpiar selecciones de asignación (estructura legacy)
    setGradosSeleccionados([]);
    setCursosPorGrado({});
    setAreasSeleccionadas([]);
    setMateriasPorArea({});
    setMateriasFiltradas([]);
    setMateriasPorGrado({});
    
    // Limpiar estado de expansión
    setAsignacionesExpandidas({});
    setSeccionActiva('datos');
    setSeccionesCompletadas({
      datos: false,
      grados: false,
      materias: false
    });
    setSeccionesHabilitadas({
      datos: true,
      grados: false,
      materias: false
    });
  };

  const limpiarFormularioEstudiante = () => {
    setEstudianteActual({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: 0,
      curso_id: 0
    });
    setErroresValidacionEstudiante({});
    setCamposHabilitadosEstudiante({
      nombres: true,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCamposValidadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCursosDisponibles([]);
    // No limpiar todosLosCursos para mantener la referencia a los cursos ya cargados
    
    console.log('🧹 Formulario de estudiante limpiado');
  };

  // Función para limpiar todos los datos en caché al finalizar la configuración
  const limpiarDatosCompletos = () => {
    console.log('🧹 Limpiando todos los datos en caché...');
    
    // Limpiar datos de docentes
    setDocentes([]);
    setPasswordsPorDocente({});
    setDocenteActual({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setAsignacionesDocente([]);
    setAsignacionesPorDocente({});
    
    // Limpiar datos de estudiantes
    setEstudiantes([]);
    setEstudianteActual({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: 0,
      curso_id: 0
    });
    setGradosDisponibles([]);
    setCursosDisponibles([]);
    setTodosLosCursos([]);
    
    // Limpiar datos de materias y grados
    setMaterias([]);
    setMateriasGradosCargados([]);
    setGradosGuardados([]);
    setCursosGuardados([]);
    setGradosCargados([]);
    
    // Limpiar estados de validación
    setErroresValidacion({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setCamposHabilitados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setCamposValidados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    
    setErroresValidacionEstudiante({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: '',
      curso_id: ''
    });
    setCamposHabilitadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCamposValidadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    
    // Limpiar estados de carga
    setCargandoGrados(false);
    setCargandoCursos(false);
    setCargandoAreasMaterias(false);
    
    // Limpiar estados de resumen
    setMostrarResumen(false);
    setMostrarResumenAreas(false);
    
    // Resetear al paso inicial
    setCurrentStep(1);
    
    console.log('✅ Todos los datos en caché han sido limpiados');
  };

  // Función para verificar si el email ya existe en Supabase Auth
  const verificarEmailExistente = async (email: string) => {
    if (!email.trim() || !validarEmail(email.trim())) {
      return false;
    }

    setVerificandoEmail(true);
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para manejar selección de grados
  const handleGradoSeleccionado = (gradoId: number, seleccionado: boolean) => {
    if (seleccionado) {
      setGradosSeleccionados(prev => [...prev, gradoId]);
      // Inicializar cursos vacíos para este grado
      setCursosPorGrado(prev => ({ ...prev, [gradoId]: [] }));
    } else {
      setGradosSeleccionados(prev => prev.filter(id => id !== gradoId));
      // Limpiar cursos de este grado
      setCursosPorGrado(prev => {
        const nuevo = { ...prev };
        delete nuevo[gradoId];
        return nuevo;
      });
    }
  };

  // Función para manejar selección de cursos por grado
  const handleCursoSeleccionado = (gradoId: number, cursoId: number, seleccionado: boolean) => {
    setCursosPorGrado(prev => {
      const cursosActuales = prev[gradoId] || [];
      if (seleccionado) {
        return { ...prev, [gradoId]: [...cursosActuales, cursoId] };
      } else {
        return { ...prev, [gradoId]: cursosActuales.filter(id => id !== cursoId) };
      }
    });
  };

  // Función para manejar selección de áreas
  const handleAreaSeleccionada = (areaId: number, seleccionada: boolean) => {
    if (seleccionada) {
      setAreasSeleccionadas(prev => [...prev, areaId]);
      // Inicializar materias vacías para esta área
      setMateriasPorArea(prev => ({ ...prev, [areaId]: [] }));
    } else {
      setAreasSeleccionadas(prev => prev.filter(id => id !== areaId));
      // Limpiar materias de esta área
      setMateriasPorArea(prev => {
        const nuevo = { ...prev };
        delete nuevo[areaId];
        return nuevo;
      });
    }
  };

  // Funciones para el nuevo flujo de asignación grado-curso-materia
  
  // Agregar grado-curso a las asignaciones
  const agregarGradoCurso = (gradoId: number, cursoId: number) => {
    const grado = gradosCargados.find(g => g.id === gradoId);
    const curso = grado?.cursos?.find((c: any) => c.id === cursoId);
    
    if (grado && curso) {
      // Verificar si ya existe esta combinación
      const existe = asignacionesGradoCurso.some(a => a.gradoId === gradoId && a.cursoId === cursoId);
      
      if (!existe) {
        setAsignacionesGradoCurso(prev => [...prev, {
          gradoId,
          cursoId,
          gradoNombre: grado.nombre,
          cursoNombre: curso.nombre,
          materiasSeleccionadas: []
        }]);
      }
    }
  };
  
  // Eliminar grado-curso de las asignaciones
  const eliminarGradoCurso = (gradoId: number, cursoId: number) => {
    setAsignacionesGradoCurso(prev => 
      prev.filter(a => !(a.gradoId === gradoId && a.cursoId === cursoId))
    );
  };
  
  // Manejar selección de materias para un grado-curso específico
  const handleMateriaGradoCurso = (gradoId: number, cursoId: number, materiaId: number, seleccionada: boolean) => {
    setAsignacionesGradoCurso(prev => 
      prev.map(asignacion => {
        if (asignacion.gradoId === gradoId && asignacion.cursoId === cursoId) {
          return {
            ...asignacion,
            materiasSeleccionadas: seleccionada
              ? [...asignacion.materiasSeleccionadas, materiaId]
              : asignacion.materiasSeleccionadas.filter(id => id !== materiaId)
          };
        }
        return asignacion;
      })
    );
  };

  // Función legacy para manejar selección de materias por grado
  const handleMateriaSeleccionada = (gradoId: number, materiaId: number, seleccionada: boolean) => {
    setMateriasPorArea(prev => {
      const materiasActuales = prev[gradoId] || [];
      if (seleccionada) {
        return { ...prev, [gradoId]: [...materiasActuales, materiaId] };
      } else {
        return { ...prev, [gradoId]: materiasActuales.filter(id => id !== materiaId) };
      }
    });
  };

  // Función para validar si una sección está completa
  const validarSeccion = (seccion: string) => {
    switch (seccion) {
      case 'datos': {
        const passwordReqs = getPasswordRequirementsDocente(docenteActual.password);
        const passwordOk = Object.values(passwordReqs).every(Boolean);
        return (
          docenteActual.nombres.trim() !== '' &&
          docenteActual.apellidos.trim() !== '' &&
          docenteActual.telefono.trim() !== '' &&
          docenteActual.email.trim() !== '' &&
          docenteActual.password.trim() !== '' &&
          passwordOk &&
          emailVerificado &&
          Object.keys(erroresValidacion).length === 0
        );
      }
      case 'grados':
        return asignacionesGradoCurso.length > 0;
      case 'materias':
        return (
          asignacionesGradoCurso.length > 0 &&
          asignacionesGradoCurso.every(
            (asignacion) => asignacion.materiasSeleccionadas.length > 0
          )
        );
      default:
        return false;
    }
  };

  const docenteSubpasosCompletos =
    seccionesCompletadas.datos &&
    seccionesCompletadas.grados &&
    seccionesCompletadas.materias &&
    Object.keys(erroresValidacion).length === 0;

  // Función para actualizar el estado de las secciones
  const actualizarEstadoSecciones = () => {
    const nuevasCompletadas = { ...seccionesCompletadas };
    const nuevasHabilitadas = { ...seccionesHabilitadas };

    // Validar sección de datos
    nuevasCompletadas.datos = validarSeccion('datos');
    if (nuevasCompletadas.datos) {
      nuevasHabilitadas.grados = true;
    }

    // Validar sección de grados
    nuevasCompletadas.grados = validarSeccion('grados');
    if (nuevasCompletadas.grados) {
      nuevasHabilitadas.materias = true;
    }

    // Validar sección de materias
    nuevasCompletadas.materias = validarSeccion('materias');

    setSeccionesCompletadas(nuevasCompletadas);
    setSeccionesHabilitadas(nuevasHabilitadas);
  };

  // Función para cambiar de sección
  const cambiarSeccion = (seccion: string) => {
    if (seccionesHabilitadas[seccion]) {
      setSeccionActiva(seccion);
    }
  };

  // Función para filtrar materias por grados seleccionados usando tabla materiaGrados
  const filtrarMateriasPorGrados = () => {
    if (asignacionesGradoCurso.length === 0) {
      setMateriasFiltradas([]);
      setMateriasPorGrado({});
      return;
    }

    console.log('=== FILTRANDO MATERIAS POR GRADOS ===');
    console.log('Asignaciones grado-curso:', asignacionesGradoCurso);
    console.log('Materias-grados cargados:', materiasGradosCargados);

    // Paso 1: Obtener IDs únicos de grados de las asignaciones
    const gradoIds = [...new Set(asignacionesGradoCurso.map(a => a.gradoId))];
    console.log('IDs únicos de grados:', gradoIds);

    // Paso 2: Buscar en tabla materiaGrados donde grado_id IN (gradoIds)
    const relacionesRelevantes = materiasGradosCargados.filter(mg => 
      gradoIds.includes(mg.grado_id)
    );
    console.log('Relaciones encontradas:', relacionesRelevantes);

    // Paso 3: Obtener IDs únicos de materias
    const materiaIds = [...new Set(relacionesRelevantes.map(mg => mg.materia_id))];
    console.log('IDs de materias únicas:', materiaIds);

    // Paso 4: Buscar materias en la tabla materias por IDs
    const materiasEncontradas = materiasCargadas.filter(materia => 
      materiaIds.includes(materia.id)
    );
    console.log('Materias encontradas:', materiasEncontradas);

    // Paso 5: Agrupar materias por grado
    const materiasAgrupadas: {[gradoId: number]: any[]} = {};
    
    gradoIds.forEach(gradoId => {
      // Filtrar relaciones para este grado específico
      const relacionesDelGrado = relacionesRelevantes.filter(mg => mg.grado_id === gradoId);
      
      // Obtener IDs de materias para este grado
      const materiaIdsDelGrado = relacionesDelGrado.map(mg => mg.materia_id);
      
      // Buscar materias completas para este grado
      const materiasDelGrado = materiasCargadas.filter(materia => 
        materiaIdsDelGrado.includes(materia.id)
      ).map(materia => ({
        id: materia.id,
        nombre: materia.nombre,
        areaId: materia.area_id,
        gradoId: gradoId
      }));
      
      materiasAgrupadas[gradoId] = materiasDelGrado;
      console.log(`Materias para grado ${gradoId}:`, materiasDelGrado);
    });

    setMateriasPorGrado(materiasAgrupadas);
    setMateriasFiltradas(materiasEncontradas);
    
    console.log('Materias agrupadas por grado:', materiasAgrupadas);
    console.log('Materias filtradas totales:', materiasEncontradas);
  };

  // Función para verificar manualmente el email
  const verificarEmailManual = async (emailOverride?: string) => {
    const emailToCheck = (emailOverride ?? docenteActual.email).trim();
    if (!emailToCheck || !validarEmail(emailToCheck)) {
      setModalEmailDocente({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido primero.'
      });
      return;
    }

    if (emailOverride !== undefined && docenteActual.email !== emailToCheck) {
      setDocenteActual((prev) => ({ ...prev, email: emailToCheck }));
    }

    const emailNorm = emailToCheck.toLowerCase();

    // Ya usado por un docente agregado en este asistente (aún no persistido)
    const emailEnWizard = docentes.some((d) => d.email.toLowerCase() === emailNorm);
    if (emailEnWizard) {
      setEmailVerificado(false);
      setErroresValidacion((prev) => ({
        ...prev,
        email: 'Este email ya está asignado a otro docente en este asistente',
      }));
      setCamposHabilitados((prev) => ({ ...prev, password: false }));
      setModalEmailDocente({
        tipo: 'error',
        titulo: 'Email no disponible',
        mensaje:
          'Ya agregaste un docente con este correo en el asistente. Usa otro email.',
      });
      return;
    }

    setVerificandoEmail(true);
    setEmailVerificado(false);
    
    try {
      const emailExiste = await verificarEmailExistente(emailToCheck);
      
      if (emailExiste) {
        setErroresValidacion(prev => ({
          ...prev,
          email: 'Este email ya está registrado en el sistema'
        }));
        setEmailVerificado(false);
        // Deshabilitar el campo de contraseña cuando el email no esté disponible
        setCamposHabilitados(prev => ({ ...prev, password: false }));
        setModalEmailDocente({
          tipo: 'error',
          titulo: 'Email no disponible',
          mensaje: 'Este email ya está registrado. Por favor usa otro email.'
        });
      } else {
        setErroresValidacion(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
        setEmailVerificado(true);
        // Habilitar el campo de contraseña cuando el email esté verificado
        setCamposHabilitados(prev => ({ ...prev, password: true }));
        setModalEmailDocente({
          tipo: 'success',
          titulo: 'Email disponible',
          mensaje: 'Puedes continuar con la contraseña.'
        });
      }
    } catch (error) {
      console.error('Error verificando email:', error);
      setModalEmailDocente({
        tipo: 'error',
        titulo: 'Error verificando email',
        mensaje: 'Intenta nuevamente.'
      });
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para validar email
  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar campo en tiempo real
  const validarCampo = async (campo: string, valor: string) => {
    let nextError: string | undefined;
    let campoValido = false;
    let unlockNext: string | null = null;

    switch (campo) {
      case 'nombres':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          nextError = 'Solo se permiten letras y espacios';
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          campoValido = true;
          unlockNext = 'apellidos';
        }
        break;
      case 'apellidos':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          nextError = 'Solo se permiten letras y espacios';
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          campoValido = true;
          unlockNext = 'telefono';
        }
        break;
      case 'telefono':
        if (valor && typeof valor === 'string' && valor.trim() && !isPhoneValid(valor.trim())) {
          nextError = 'Ingrese un número de teléfono válido con indicativo de país';
        } else if (valor && typeof valor === 'string' && valor.trim() && isPhoneValid(valor.trim())) {
          campoValido = true;
          unlockNext = 'email';
        }
        break;
      case 'email':
        if (valor.trim() && !validarEmail(valor.trim())) {
          nextError = 'Formato de email inválido';
          setEmailVerificado(false);
        } else if (valor.trim() && validarEmail(valor.trim())) {
          campoValido = true;
          setEmailVerificado(false);
        } else {
          setEmailVerificado(false);
        }
        break;
      case 'password': {
        const reqs = getPasswordRequirementsDocente(String(valor || ''));
        const allOk = Object.values(reqs).every(Boolean);
        if (valor && !allOk) {
          nextError = 'La contraseña debe cumplir todos los requisitos';
        } else if (valor && allOk) {
          campoValido = true;
        }
        break;
      }
    }

    setErroresValidacion((prev) => {
      const next = { ...prev };
      if (nextError) next[campo] = nextError;
      else delete next[campo];
      return next;
    });

    setCamposValidados((prev) => ({ ...prev, [campo]: campoValido }));

    setCamposHabilitados((prev) => {
      const next = { ...prev };
      if (unlockNext) next[unlockNext] = true;
      // La contraseña solo se habilita tras verificar el email (no al validar formato).
      if (campo === 'email') next.password = false;
      return next;
    });
  };

  const validarCampoRef = useRef(validarCampo);
  validarCampoRef.current = validarCampo;

  // Función para validar teléfono celular colombiano
  const validarTelefonoColombiano = (telefono: string) => {
    // Remover espacios y caracteres especiales
    const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Validar que tenga 10 dígitos y empiece con 3
    if (telefonoLimpio.length === 10 && telefonoLimpio.startsWith('3')) {
      return true;
    }
    
    // También aceptar formato con código de país +57
    if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('573')) {
      return true;
    }
    
    return false;
  };

  // Función para validar campos de estudiantes
  const validarCampoEstudiante = async (campo: string, valor: string | number) => {
    const errores = { ...erroresValidacionEstudiante };
    const habilitados = { ...camposHabilitadosEstudiante };
    const validados = { ...camposValidadosEstudiante };
    
    switch (campo) {
      case 'nombres':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.apellidos = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'apellidos':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.codigo_estudiantil = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'codigo_estudiantil':
        if (valor && typeof valor === 'string' && valor.trim().length < 3) {
          errores[campo] = 'Mínimo 3 caracteres';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim().length >= 3) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.nombre_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'nombre_acudiente':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.correo_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'correo_acudiente':
        if (valor && typeof valor === 'string' && !validarEmail(valor.trim())) {
          errores[campo] = 'Formato de email inválido';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && validarEmail(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.telefono_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'telefono_acudiente':
        if (valor && typeof valor === 'string' && valor.trim() && !isPhoneValid(valor.trim())) {
          errores[campo] = 'Ingrese un número de teléfono válido con indicativo de país';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim() && isPhoneValid(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.grado_id = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'grado_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.curso_id = true;
          // Cargar cursos cuando se selecciona un grado
          cargarCursosPorGrado(valor);
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'curso_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
    }
    
    setErroresValidacionEstudiante(errores);
    setCamposHabilitadosEstudiante(habilitados);
    setCamposValidadosEstudiante(validados);
  };

  const validarCampoEstudianteRef = useRef(validarCampoEstudiante);
  validarCampoEstudianteRef.current = validarCampoEstudiante;

  // Función para agregar docente
  const handleAgregarDocente = () => {
    if (!docenteSubpasosCompletos) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Formulario incompleto',
        mensaje:
          'Completa los tres subpasos: datos personales, grados/cursos y materias por asignación.',
      });
      return;
    }

    // Validaciones básicas
    if (!docenteActual.nombres.trim() || !docenteActual.apellidos.trim() || !docenteActual.telefono.trim() || !docenteActual.email.trim() || !docenteActual.password.trim()) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Por favor completa todos los campos.'
      });
      return;
    }

    // Validar nombres y apellidos (solo letras y espacios)
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(docenteActual.nombres.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Nombre inválido',
        mensaje: 'Los nombres solo pueden contener letras y espacios.'
      });
      return;
    }
    if (!nombreRegex.test(docenteActual.apellidos.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Apellido inválido',
        mensaje: 'Los apellidos solo pueden contener letras y espacios.'
      });
      return;
    }

    // Validar email
    if (!validarEmail(docenteActual.email.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido.'
      });
      return;
    }

    // Validar teléfono celular colombiano
    if (!isPhoneValid(docenteActual.telefono)) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Teléfono inválido',
        mensaje: 'Por favor ingresa un número de teléfono válido con indicativo de país.'
      });
      return;
    }

    const passwordReqs = getPasswordRequirementsDocente(docenteActual.password);
    const passwordOk = Object.values(passwordReqs).every(Boolean);
    if (!passwordOk) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Contraseña inválida',
        mensaje: 'La contraseña debe cumplir todos los requisitos: al menos 8 caracteres, mayúscula, minúscula, número y símbolo.'
      });
      return;
    }

    // Verificar si el email ya existe en la lista local
    const emailExiste = docentes.some(d => d.email.toLowerCase() === docenteActual.email.trim().toLowerCase());
    if (emailExiste) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Email duplicado',
        mensaje: 'Ya existe un docente con este email en la lista actual.'
      });
      return;
    }

    const nuevoDocente: Docente = {
      id: Date.now(), // ID temporal
      nombres: docenteActual.nombres.trim(),
      apellidos: docenteActual.apellidos.trim(),
      telefono: docenteActual.telefono.trim(),
      email: docenteActual.email.trim().toLowerCase(),
      sede_id: undefined, // Se asignará automáticamente
      activo: true
    };

    setDocentes([...docentes, nuevoDocente]);
    setPasswordsPorDocente((prev) => ({
      ...prev,
      [nuevoDocente.id]: docenteActual.password,
    }));

    // Guardar asignaciones del docente (nueva estructura)
    console.log('=== GUARDANDO ASIGNACIONES PARA DOCENTE:', nuevoDocente.id, '===');
    console.log('Asignaciones grado-curso:', asignacionesGradoCurso);
    
    setAsignacionesPorDocente(prev => ({
      ...prev,
      [nuevoDocente.id]: {
        asignaciones: asignacionesGradoCurso
      }
    }));
    
    limpiarFormularioDocente();
    setModalDocenteAccion({
      tipo: 'success',
      titulo: 'Docente agregado',
      mensaje: 'Docente agregado correctamente.'
    });
  };

  // Función para eliminar un docente de la lista
  const eliminarDocente = (docenteId: number) => {
    // Confirmar eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este docente?')) {
      // Remover de la lista de docentes
      setDocentes(prev => prev.filter(d => d.id !== docenteId));
      setPasswordsPorDocente((prev) => {
        const next = { ...prev };
        delete next[docenteId];
        return next;
      });

      // Remover sus asignaciones
      setAsignacionesPorDocente(prev => {
        const nuevasAsignaciones = { ...prev };
        delete nuevasAsignaciones[docenteId];
        return nuevasAsignaciones;
      });
      
      // Remover estado de expansión
      setAsignacionesExpandidas(prev => {
        const nuevasExpandidas = { ...prev };
        delete nuevasExpandidas[docenteId];
        return nuevasExpandidas;
      });
      
      console.log(`🗑️ Docente eliminado: ${docenteId}`);
      showSuccess('Docente eliminado', 'Docente eliminado correctamente');
    }
  };

  // Función para agregar estudiante
  const handleAgregarEstudiante = () => {
    // Validaciones básicas
    if (!estudianteActual.nombres.trim() || !estudianteActual.apellidos.trim() || 
        !estudianteActual.codigo_estudiantil.trim() || !estudianteActual.nombre_acudiente.trim() ||
        !estudianteActual.correo_acudiente.trim() || !estudianteActual.telefono_acudiente.trim() ||
        estudianteActual.grado_id === 0 || estudianteActual.curso_id === 0) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Por favor completa todos los campos.'
      });
      return;
    }

    // Validar email del acudiente
    if (!validarEmail(estudianteActual.correo_acudiente.trim())) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido para el acudiente.'
      });
      return;
    }

    // Validar teléfono del acudiente
    if (!isPhoneValid(estudianteActual.telefono_acudiente)) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Teléfono inválido',
        mensaje: 'Por favor ingresa un número de teléfono válido con indicativo de país para el acudiente.'
      });
      return;
    }

    // Verificar que no haya errores de validación
    if (Object.keys(erroresValidacionEstudiante).length > 0) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Errores de validación',
        mensaje: 'Por favor corrige los errores antes de continuar.'
      });
      return;
    }

    // Verificar que no exista un estudiante con el mismo código
    const estudianteExistente = estudiantes.find(e => e.codigo_estudiantil === estudianteActual.codigo_estudiantil.trim());
    if (estudianteExistente) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Código duplicado',
        mensaje: 'Ya existe un estudiante con este código.'
      });
      return;
    }

    // Crear nuevo estudiante
    const nuevoEstudiante: Estudiante = {
      id: Date.now(), // ID temporal
      nombres: estudianteActual.nombres.trim(),
      apellidos: estudianteActual.apellidos.trim(),
      codigo_estudiantil: estudianteActual.codigo_estudiantil.trim(),
      nombre_acudiente: estudianteActual.nombre_acudiente.trim(),
      correo_acudiente: estudianteActual.correo_acudiente.trim().toLowerCase(),
      telefono_acudiente: estudianteActual.telefono_acudiente.trim(),
      grado_id: estudianteActual.grado_id,
      curso_id: estudianteActual.curso_id,
      institucion_id: institucionId,
      activo: true
    };

    // Agregar a la lista
    setEstudiantes([...estudiantes, nuevoEstudiante]);
    
    limpiarFormularioEstudiante();
    setModalEstudianteAccion({
      tipo: 'success',
      titulo: 'Estudiante agregado',
      mensaje: 'Estudiante agregado correctamente.'
    });
  };

  // Función para eliminar un estudiante de la lista
  const eliminarEstudiante = (estudianteId: number) => {
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;
    setEstudianteParaEliminar({
      estudianteId,
      nombre: `${estudiante.nombres} ${estudiante.apellidos}`
    });
  };

  // Función para alternar la expansión de asignaciones
  const toggleAsignaciones = (docenteId: number) => {
    setAsignacionesExpandidas(prev => ({
      ...prev,
      [docenteId]: !prev[docenteId]
    }));
  };

  // Función para guardar docentes en la base de datos
  const handleSaveDocentes = async () => {
    if (docentes.length === 0) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Sin docentes',
        mensaje: 'No hay docentes para guardar.'
      });
      return;
    }

    // Mostrar resumen antes de guardar
    // Ya no mostramos el modal de resumen, vamos directamente al paso 4
    setCurrentStep(4);
  };

  // Función para mostrar confirmación de guardado
  const mostrarConfirmacion = () => {
    setMostrarConfirmacionGuardado(true);
  };

  // Función para guardar docentes directamente
  const guardarDocentes = async () => {
    if (saving) {
      return;
    }
    setMostrarConfirmacionGuardado(false);
    setSaving(true);
    try {
      console.log('=== GUARDANDO DOCENTES ===');
      console.log('Docentes a guardar:', docentes.length);
      console.log('Institución ID:', institucionId);
      console.log('Docentes completos:', docentes);

      // Procesar cada docente individualmente con sus asignaciones
      const resultados = [];
      const erroresDocentes: string[] = [];
      
      for (let i = 0; i < docentes.length; i++) {
        const docente = docentes[i];
        
        console.log(`=== PROCESANDO DOCENTE ${i + 1}/${docentes.length} ===`);
        console.log('Docente:', docente);
        
        const password = passwordsPorDocente[docente.id];
        if (!password) {
          erroresDocentes.push(
            `Error guardando ${docente.nombres} ${docente.apellidos}: falta la contraseña definida en el wizard.`
          );
          continue;
        }
        
        // Obtener asignaciones del docente desde las asignaciones guardadas
        const asignacionesRaw = asignacionesPorDocente[docente.id] || { asignaciones: [] };
        
        console.log('Asignaciones raw para este docente:', asignacionesRaw);
        
        // Convertir asignacionesGradoCurso a la estructura esperada por el backend
        const asignaciones: {
          grados: number[];
          cursos: { [key: number]: number[] };
          materias: { [key: number]: number[] };
        } = {
          grados: [],
          cursos: {},
          materias: {}
        };
        
        // Procesar cada asignación grado-curso
        asignacionesRaw.asignaciones.forEach(asignacion => {
          const gradoId = asignacion.gradoId;
          const cursoId = asignacion.cursoId;
          const materiaIds = asignacion.materiasSeleccionadas;
          
          // Agregar grado si no existe
          if (!asignaciones.grados.includes(gradoId)) {
            asignaciones.grados.push(gradoId);
          }
          
          // Agregar curso al grado
          if (!asignaciones.cursos[gradoId]) {
            asignaciones.cursos[gradoId] = [];
          }
          if (!asignaciones.cursos[gradoId].includes(cursoId)) {
            asignaciones.cursos[gradoId].push(cursoId);
          }
          
          // Agregar materias al grado
          if (!asignaciones.materias[gradoId]) {
            asignaciones.materias[gradoId] = [];
          }
          materiaIds.forEach(materiaId => {
            if (!asignaciones.materias[gradoId].includes(materiaId)) {
              asignaciones.materias[gradoId].push(materiaId);
            }
          });
        });
        
        console.log('Asignaciones procesadas para este docente:', asignaciones);
        
        const datosAEnviar = {
          institucionId,
          docentes: [{
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            telefono: docente.telefono,
            email: docente.email,
            password: password
          }],
          asignaciones: asignaciones
        };

        console.log('Datos que se envían:', JSON.stringify(datosAEnviar, null, 2));

        const response = await fetch('/api/setup/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosAEnviar)
        });
        
        console.log('Status de respuesta:', response.status);

        const rawText = await response.text();
        let responseData: {
          error?: string;
          details?: string;
          message?: string;
          success?: boolean;
          data?: { errores?: Array<{ error?: string; docente?: string }>; exitosos?: number; fallidos?: number };
        } = {};
        try {
          responseData = rawText ? JSON.parse(rawText) : {};
        } catch {
          responseData = { error: rawText || `Error HTTP ${response.status}` };
        }
        console.log('Respuesta del servidor:', responseData);

        const apiErrores = responseData.data?.errores ?? [];
        const creadoOk =
          response.ok &&
          responseData.success !== false &&
          (responseData.data?.exitosos == null || responseData.data.exitosos > 0) &&
          apiErrores.length === 0;

        resultados.push({
          docente: docente.email,
          success: creadoOk,
          data: responseData
        });
        
        if (!creadoOk) {
          const detalle =
            responseData.error ||
            responseData.details ||
            responseData.message ||
            apiErrores.map((e) => e.error).filter(Boolean).join('; ') ||
            (Object.keys(responseData).length === 0
              ? `Error HTTP ${response.status} (sin detalle)`
              : 'Error desconocido');
          console.error(`Error guardando docente ${docente.email}:`, responseData);
          erroresDocentes.push(
            `Error guardando ${docente.nombres} ${docente.apellidos}: ${detalle}`
          );
        }
      }
      
      // Resumir resultados
      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;
      
      console.log('=== RESUMEN DE RESULTADOS ===');
      console.log('Exitosos:', exitosos);
      console.log('Fallidos:', fallidos);
      
      if (exitosos > 0) {
        setModalDocenteAccion({
          tipo: fallidos > 0 ? 'info' : 'success',
          titulo: fallidos > 0 ? 'Docentes creados con errores' : 'Docentes creados',
          mensaje: `Se crearon ${exitosos} docente(s) exitosamente${fallidos > 0 ? ` (${fallidos} con errores)` : ''}.${
            erroresDocentes.length > 0 ? ` ${erroresDocentes[0]}` : ''
          }`
        });
        if (erroresDocentes.length > 0) {
          console.error('Errores al guardar docentes:', erroresDocentes);
        }
        // Avanzar al siguiente paso solo si se crearon docentes exitosamente
        setCurrentStep(4);
      } else {
        setModalDocenteAccion({
          tipo: 'error',
          titulo: 'No se pudieron crear docentes',
          mensaje:
            erroresDocentes[0] ||
            'No se pudo crear ningún docente. Revisa los errores.',
        });
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Error de conexión',
        mensaje: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSaving(false);
    }
  };

  // Función para guardar estudiantes
  const guardarEstudiantes = async () => {
    setSaving(true);
    try {
      console.log('=== GUARDANDO ESTUDIANTES ===');
      console.log('Estudiantes a guardar:', estudiantes.length);
      console.log('Institución ID:', institucionId);
      console.log('Estudiantes completos:', estudiantes);

      // Procesar cada estudiante individualmente
      const resultados = [];
      
      for (let i = 0; i < estudiantes.length; i++) {
        const estudiante = estudiantes[i];
        
        console.log(`=== PROCESANDO ESTUDIANTE ${i + 1}/${estudiantes.length} ===`);
        console.log('Estudiante:', estudiante);
        
        const datosAEnviar = {
          institucionId,
          estudiantes: [estudiante]
        };

        console.log('Datos que se envían:', JSON.stringify(datosAEnviar, null, 2));

        const response = await fetch('/api/setup/estudiantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosAEnviar)
        });
        
        console.log('Status de respuesta:', response.status);
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        resultados.push({
          estudiante: estudiante.codigo_estudiantil,
          success: response.ok,
          data: responseData
        });
        
        if (!response.ok) {
          console.error(`Error guardando estudiante ${estudiante.codigo_estudiantil}:`, responseData);
          await showError('Error guardando estudiante', `Error guardando ${estudiante.nombres} ${estudiante.apellidos}: ${
              responseData.error || responseData.details || 'Error desconocido'
            }`);
        }
      }
      
      // Resumir resultados
      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;
      
      console.log('=== RESUMEN DE RESULTADOS ===');
      console.log('Exitosos:', exitosos);
      console.log('Fallidos:', fallidos);
      
      if (exitosos > 0) {
        await showSuccess('Estudiantes creados', `Se crearon ${exitosos} estudiante(s) exitosamente${fallidos > 0 ? ` (${fallidos} con errores)` : ''}`);
        // Avanzar al siguiente paso solo si se crearon estudiantes exitosamente
        setCurrentStep(5);
      } else {
        await showError('No se pudieron crear estudiantes', 'No se pudo crear ningún estudiante. Revisa los errores mostrados.');
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      await showError('Error de conexión', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  // Función para generar contraseña aleatoria
  const generarPasswordAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  };

  const handleSaveAreasYMaterias = async () => {
    setSaving(true);
    try {
      const areasActivasData = areasPredeterminadas.filter(area => 
        areasActivas.includes(area.id)
      );
      
      console.log('=== GUARDANDO AREAS Y MATERIAS ===');
      console.log('Áreas activas:', areasActivasData.length);
      console.log('Materias:', materias.length);

      const response = await fetch('/api/setup/areas-materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucionId,
          areas: areasActivasData,
          materias
        })
      });
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (response.ok) {
        // Ahora guardar las asignaciones materia-grado
        if (materiasPorCurso.length > 0) {
          console.log('Guardando asignaciones materia-grado...');
          
          // Crear un mapa de IDs temporales a IDs reales de las materias
          const materiaIdMap = new Map();
          responseData.data.materiasCreadas.forEach((materia: any, index: number) => {
            // Usar el índice para mapear, ya que las materias se crean en el mismo orden
            if (index < materias.length) {
              const materiaOriginal = materias[index];
              materiaIdMap.set(materiaOriginal.id, materia.id);
            }
          });
          
          console.log('Mapa de IDs de materias:', Object.fromEntries(materiaIdMap));
          console.log('Materias originales:', materias);
          console.log('Materias creadas:', responseData.data.materiasCreadas);
          
          // Convertir asignaciones a usar IDs reales
          const asignacionesReales = materiasPorCurso.map(asignacion => {
            const materiaIdReal = materiaIdMap.get(asignacion.materiaId);
            if (!materiaIdReal) {
              console.error('No se encontró ID real para:', asignacion.materiaId);
              console.error('Mapa disponible:', Object.fromEntries(materiaIdMap));
              throw new Error(`No se encontró el ID real para la materia temporal ${asignacion.materiaId}`);
            }
            return {
              materiaId: materiaIdReal,
              gradoId: asignacion.gradoId
            };
          });
          
          console.log('Asignaciones con IDs reales:', asignacionesReales);
          
          const asignacionesResponse = await fetch('/api/setup/materia-grados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              institucionId,
              asignaciones: asignacionesReales
            })
          });
          
          const asignacionesData = await asignacionesResponse.json();
          console.log('Respuesta asignaciones:', asignacionesData);
          
          if (asignacionesResponse.ok) {
            setMostrarResumenAreas(false);
            setMostrarExitoAreasMaterias({
              areasCreadas: areasActivas.length,
              materiasCreadas: responseData?.materiasCreadas?.length || materias.length
            });
            console.log('Asignaciones guardadas:', asignacionesData);
            await cargarAreasMaterias();
            setCurrentStep(3);
          } else {
            console.error('Error guardando asignaciones:', asignacionesData);
            await showError('Error al guardar asignaciones', asignacionesData.details || asignacionesData.error || 'Error desconocido');
          }
        } else {
          setMostrarResumenAreas(false);
          setMostrarExitoAreasMaterias({
            areasCreadas: areasActivas.length,
            materiasCreadas: responseData?.materiasCreadas?.length || materias.length
          });
          console.log('Datos guardados:', responseData);
          await cargarAreasMaterias();
          setCurrentStep(3);
        }
      } else {
        console.error('Error del servidor:', responseData);
        console.error('Status del response:', response.status);
        console.error('Headers del response:', response.headers);
        
        const errorMessage = responseData.details || responseData.error || responseData.message || 'Error desconocido del servidor';
        await showError('Error al guardar', errorMessage);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      await showError('Error de conexión', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGradosYCursos = async () => {
    setSaving(true);
    try {
      const normalizarNombre = (nombre: string) => nombre.trim().toLowerCase();

      // Mapear cursos ya guardados por id predeterminado del grado (no por id de BD)
      const cursosExistentesPorGrado = new Map<number, Set<string>>();
      gradosCargados.forEach((grado: any) => {
        const pred = gradosPredeterminados.find(
          (g) => g.orden === grado.orden || g.nombre === grado.nombre
        );
        if (!pred) return;
        cursosExistentesPorGrado.set(
          pred.id,
          new Set((grado.cursos || []).map((curso: any) => normalizarNombre(curso.nombre || '')))
        );
      });

      const cursosNuevos = cursos.filter((curso) => {
        const nombre = normalizarNombre(curso.nombre || '');
        if (!nombre) return false;
        const existentes = cursosExistentesPorGrado.get(curso.gradoId) || new Set<string>();
        return !existentes.has(nombre);
      });

      if (cursosNuevos.length === 0) {
        setMostrarResumen(false);
        setSaving(false);
        setMostrarExitoGradosCursos({ gradosCreados: 0, cursosCreados: 0 });
        return;
      }

      // Detectar nombres duplicados en el payload (mismo o distinto grado)
      const nombresEnPayload = cursosNuevos.map((c) => normalizarNombre(c.nombre));
      const duplicadosPayload = cursosNuevos
        .filter((c, i) => nombresEnPayload.indexOf(normalizarNombre(c.nombre)) !== i)
        .map((c) => c.nombre.trim());
      if (duplicadosPayload.length > 0) {
        setMostrarResumen(false);
        setDuplicadosCursos(Array.from(new Set(duplicadosPayload)));
        return;
      }

      const gradosConCursos = gradosPredeterminados.filter((grado) =>
        cursosNuevos.some((curso) => curso.gradoId === grado.id)
      );

      const gradosCursos = gradosConCursos.map((grado) => ({
        grado_id: grado.id,
        cursos: cursosNuevos
          .filter((curso) => curso.gradoId === grado.id)
          .map((curso) => ({
            nombre: curso.nombre.trim(),
          })),
      }));

      const response = await fetch('/api/setup/grados-cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucionId,
          gradosCursos,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMostrarResumen(false);
        setCursos([]);
        setGradosGuardados(responseData.data.gradosCreados);
        setCursosGuardados(responseData.data.cursosCreados);
        setMostrarExitoGradosCursos({
          gradosCreados: responseData.data.gradosCreados?.length || 0,
          cursosCreados: responseData.data.cursosCreados?.length || 0,
        });
        await cargarGrados();
        setCurrentStep(2);
      } else if (response.status === 409) {
        setMostrarResumen(false);
        const duplicateNames = responseData?.duplicateNames;
        setDuplicadosCursos(
          Array.isArray(duplicateNames) && duplicateNames.length > 0 ? duplicateNames : []
        );
      } else {
        console.error('Error del servidor:', responseData);
        await showError(
          'Error al guardar',
          responseData.details || responseData.error || 'Error desconocido'
        );
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      await showError(
        'Error de conexión',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setSaving(false);
    }
  };

  // Prefetch grados y áreas/materias al abrir el wizard (también al reabrirlo con datos ya guardados)
  useEffect(() => {
    if (!institucionId) return;
    void cargarGrados();
    void cargarAreasMaterias();
  }, [institucionId]);

  // Recargar grados al entrar a pasos 1 o 2 si aún no hay datos
  useEffect(() => {
    if ((currentStep === 1 || currentStep === 2) && gradosCargados.length === 0 && !cargandoGrados) {
      void cargarGrados();
    }
  }, [currentStep]);

  // Cargar áreas y materias al entrar al paso 2 o 3 si aún no hay datos
  useEffect(() => {
    if (
      (currentStep === 2 || currentStep === 3) &&
      areasCargadas.length === 0 &&
      materiasCargadas.length === 0 &&
      !cargandoAreasMaterias
    ) {
      void cargarAreasMaterias();
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 4 && gradosDisponibles.length === 0) {
      cargarGradosEstudiantes();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!institucionId) return;

    const cargarBranding = async () => {
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/branding`);
        if (!response.ok) return;
        const data = await response.json();
        setBrandingColors({
          primary: data.color_primario || '#2563eb',
          secondary: data.color_secundario || '#0f172a'
        });
      } catch (error) {
        console.error('Error cargando branding:', error);
      }
    };

    cargarBranding();
  }, [institucionId]);

  useEffect(() => {
    const body = document.body;
    const count = Number(body.dataset.modalCount || '0');
    body.dataset.modalCount = String(count + 1);
    body.classList.add('modal-open');
    return () => {
      const next = Math.max(Number(body.dataset.modalCount || '1') - 1, 0);
      if (next === 0) {
        body.classList.remove('modal-open');
        delete body.dataset.modalCount;
      } else {
        body.dataset.modalCount = String(next);
      }
    };
  }, []);

  // Actualizar estado de secciones cuando cambien los datos
  useEffect(() => {
    startTransition(() => {
      actualizarEstadoSecciones();
    });
  }, [docenteActual, emailVerificado, erroresValidacion, asignacionesGradoCurso]);

  // Filtrar materias cuando cambien las asignaciones grado-curso
  useEffect(() => {
    if (materiasGradosCargados.length > 0 && asignacionesGradoCurso.length > 0) {
      filtrarMateriasPorGrados();
    }
  }, [asignacionesGradoCurso, materiasGradosCargados]);

  const cursosPendientesValidos = cursos.filter((c) => c.nombre.trim().length > 0);
  const tieneGradosYCursosGuardados = gradosCargados.some(
    (g: any) => Array.isArray(g.cursos) && g.cursos.length > 0
  );
  const tieneAreasYMateriasGuardadas =
    areasCargadas.length > 0 && materiasCargadas.length > 0;

  const handleAreasActivasChange = useCallback(
    (next: number[], toggledId: number, active: boolean) => {
      setAreasActivas(next);
      if (!active) {
        setMaterias((prev) => prev.filter((materia) => materia.areaId !== toggledId));
      }
    },
    []
  );

  const handleNext = () => {
    if (saving) return;
    if (currentStep === 1 && !tieneGradosYCursosGuardados) return;
    if (currentStep === 2 && !tieneAreasYMateriasGuardadas) return;
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (saving) return;
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const docenteDatosValue = {
    nombres: docenteActual.nombres,
    apellidos: docenteActual.apellidos,
    telefono: docenteActual.telefono,
    email: docenteActual.email,
    password: docenteActual.password,
  };

  const handleDocenteDatosCommit = useCallback(
    (field: keyof DocenteDatosDraft, next: string) => {
      startTransition(() => {
        setDocenteActual((prev) =>
          prev[field] === next ? prev : { ...prev, [field]: next }
        );
      });
      void validarCampoRef.current(field, next);
    },
    []
  );

  const handleClearDocenteFieldError = useCallback((field: keyof DocenteDatosDraft) => {
    setErroresValidacion((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleEstudianteFieldChange = useCallback(
    (field: keyof EstudianteForm, next: string | number) => {
      setEstudianteActual((prev) => {
        if (field === 'grado_id') {
          return { ...prev, grado_id: next as number, curso_id: 0 };
        }
        return prev[field] === next ? prev : { ...prev, [field]: next };
      });
      void validarCampoEstudianteRef.current(field, next);
    },
    []
  );

  return (
    <>
    <Modal
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      size="full"
      className="max-w-5xl overflow-hidden"
      closeOnOverlayClick={false}
      showCloseButton={false}
      zIndex={100}
      contentClassName="overflow-hidden flex flex-col flex-1 min-h-0 p-0"
    >
          {duplicadosCursos !== null && (
            <Modal
              open
              onClose={() => setDuplicadosCursos(null)}
              title="Cursos duplicados"
              size="md"
              zIndex={110}
            >
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                No se pueden crear cursos con nombres duplicados.
              </p>
              {duplicadosCursos.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {duplicadosCursos.map((nombre) => (
                    <div
                      key={nombre}
                      className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                      <span className="font-medium">{nombre}</span>
                      <span className="text-xs font-semibold text-red-600">Duplicado</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Revisa los nombres de los cursos.</p>
              )}
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button type="button" variant="primary" onClick={() => setDuplicadosCursos(null)}>
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {mostrarExitoGradosCursos && (
            <Modal
              open
              onClose={() => setMostrarExitoGradosCursos(null)}
              title="Configuración guardada"
              size="md"
              zIndex={110}
            >
              <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
                {mostrarExitoGradosCursos.cursosCreados > 0 ? (
                  <>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      Grados y cursos guardados correctamente.
                    </p>
                    <p>Grados creados: <span className="font-semibold">{mostrarExitoGradosCursos.gradosCreados}</span></p>
                    <p>Cursos creados: <span className="font-semibold">{mostrarExitoGradosCursos.cursosCreados}</span></p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-[var(--color-text-primary)]">No hay cursos nuevos para guardar.</p>
                    <p>Agrega un curso nuevo y vuelve a intentar.</p>
                  </>
                )}
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button type="button" variant="primary" onClick={() => setMostrarExitoGradosCursos(null)}>
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {mostrarExitoAreasMaterias && (
            <Modal
              open
              onClose={() => setMostrarExitoAreasMaterias(null)}
              title="Configuración guardada"
              size="md"
              zIndex={110}
            >
              <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <p className="font-medium text-[var(--color-text-primary)]">Áreas y materias guardadas correctamente.</p>
                <p>Áreas activas: <span className="font-semibold">{mostrarExitoAreasMaterias.areasCreadas}</span></p>
                <p>Materias creadas: <span className="font-semibold">{mostrarExitoAreasMaterias.materiasCreadas}</span></p>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button type="button" variant="primary" onClick={() => setMostrarExitoAreasMaterias(null)}>
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {modalEmailDocente && (
            <Modal
              open
              onClose={() => setModalEmailDocente(null)}
              title={modalEmailDocente.titulo}
              size="md"
              zIndex={110}
            >
              <p className={`text-sm font-medium ${
                modalEmailDocente.tipo === 'success' ? 'text-green-700' : modalEmailDocente.tipo === 'error' ? 'text-red-700' : 'text-[var(--color-text-primary)]'
              }`}>
                {modalEmailDocente.mensaje}
              </p>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button
                  type="button"
                  variant={modalEmailDocente.tipo === 'error' ? 'destructive' : 'primary'}
                  onClick={() => setModalEmailDocente(null)}
                >
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {modalDocenteAccion && (
            <Modal
              open
              onClose={() => setModalDocenteAccion(null)}
              title={modalDocenteAccion.titulo}
              size="md"
              zIndex={110}
            >
              <p className={`text-sm font-medium ${
                modalDocenteAccion.tipo === 'success' ? 'text-green-700' : modalDocenteAccion.tipo === 'error' ? 'text-red-700' : 'text-[var(--color-text-primary)]'
              }`}>
                {modalDocenteAccion.mensaje}
              </p>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button
                  type="button"
                  variant={modalDocenteAccion.tipo === 'error' ? 'destructive' : 'primary'}
                  onClick={() => setModalDocenteAccion(null)}
                >
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {modalEstudianteAccion && (
            <Modal
              open
              onClose={() => setModalEstudianteAccion(null)}
              title={modalEstudianteAccion.titulo}
              size="md"
              zIndex={110}
            >
              <p className={`text-sm font-medium ${
                modalEstudianteAccion.tipo === 'success' ? 'text-green-700' : modalEstudianteAccion.tipo === 'error' ? 'text-red-700' : 'text-[var(--color-text-primary)]'
              }`}>
                {modalEstudianteAccion.mensaje}
              </p>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex justify-end">
                <Button
                  type="button"
                  variant={modalEstudianteAccion.tipo === 'error' ? 'destructive' : 'primary'}
                  onClick={() => setModalEstudianteAccion(null)}
                >
                  Entendido
                </Button>
              </div>
            </Modal>
          )}
          {estudianteParaEliminar && (
            <Modal
              open
              onClose={() => setEstudianteParaEliminar(null)}
              title="Eliminar estudiante"
              size="md"
              zIndex={110}
            >
              <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <p className="font-medium text-[var(--color-text-primary)]">
                  ¿Eliminar al estudiante &quot;{estudianteParaEliminar.nombre}&quot;?
                </p>
                <p>Esta acción lo removerá de la lista actual.</p>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEstudianteParaEliminar(null)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setEstudiantes((prev) => prev.filter((e) => e.id !== estudianteParaEliminar.estudianteId));
                    setEstudianteParaEliminar(null);
                    setModalEstudianteAccion({
                      tipo: 'success',
                      titulo: 'Estudiante eliminado',
                      mensaje: 'Estudiante eliminado correctamente.',
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </Modal>
          )}
          {cursoParaEliminar && (
            <Modal
              open
              onClose={() => !eliminandoCurso && setCursoParaEliminar(null)}
              title="Confirmar eliminación"
              size="md"
              zIndex={110}
              closeOnOverlayClick={!eliminandoCurso}
            >
              <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <p className="font-medium text-[var(--color-text-primary)]">
                  ¿Eliminar el curso &quot;{cursoParaEliminar.nombre}&quot;?
                </p>
                <p>
                  Ten en cuenta que se eliminará toda la información relacionada: estudiantes,
                  asignaciones y recordatorios.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setCursoParaEliminar(null)} disabled={eliminandoCurso}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={eliminandoCurso}
                  onClick={async () => {
                    setEliminandoCurso(true);
                    await eliminarCursoGuardado(cursoParaEliminar.cursoId, cursoParaEliminar.gradoId);
                    setEliminandoCurso(false);
                    setCursoParaEliminar(null);
                  }}
                >
                  {eliminandoCurso ? 'Eliminando…' : 'Eliminar'}
                </Button>
              </div>
            </Modal>
          )}
        {/* Header: color fijo (no usa branding de la institución) */}
        <div className="relative shrink-0 overflow-hidden rounded-t-2xl bg-slate-700 px-4 py-3 text-white sm:px-6 sm:py-4">
          <div className="flex flex-col items-start gap-3 pr-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Configuración Inicial</h2>
              <p className="mt-1 text-xs text-white/90 sm:text-sm">
                {currentStep === 0 ? 'Introducción' : `Paso ${currentStep} de 5`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="absolute right-3 top-3 rounded-lg p-2 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-white transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full items-start">
            {[
              { num: 0, label: 'Introducción' },
              { num: 1, label: 'Grados y Cursos' },
              { num: 2, label: 'Áreas y Materias' },
              { num: 3, label: 'Docentes' },
              { num: 4, label: 'Estudiantes' },
              { num: 5, label: 'Resumen' },
            ].map((step, index, steps) => (
              <div
                key={step.num}
                className="relative flex min-w-0 flex-1 flex-col items-center px-0.5"
              >
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    currentStep >= step.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`mt-1 w-full text-center text-[10px] font-medium leading-tight sm:text-xs ${
                    currentStep >= step.num ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-4 z-0 h-0.5 w-full ${
                      currentStep > step.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white p-4 sm:p-6">
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              {cargandoGrados && (
                <div className="mb-6">
                  <WizardDataSkeleton label="Cargando elementos ya guardados…" sections={1} />
                </div>
              )}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Configuración inicial de la institución
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Este asistente te guía paso a paso para dejar lista la estructura de tu institución: grados, cursos, áreas, materias, docentes y estudiantes.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Objetivo
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Configurar de forma ordenada los datos que la plataforma necesita para que los docentes puedan crear recordatorios y los estudiantes ver la información correcta. Al finalizar tendrás definidos grados y cursos, áreas y materias, docentes con sus asignaciones y estudiantes por curso.
                </p>
                <h4 className="font-semibold text-slate-900 flex items-center pt-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Cómo usar esta configuración
                </h4>
                <ul className="text-slate-700 leading-relaxed space-y-2 list-disc list-inside">
                  <li>Completa cada paso en orden; podrás volver atrás si necesitas cambiar algo.</li>
                  <li>En <strong>Grados y Cursos</strong> defines la estructura académica (ej. 5° A, 5° B).</li>
                  <li>En <strong>Áreas y Materias</strong> defines las asignaturas y las vinculas a grados.</li>
                  <li>En <strong>Docentes</strong> das de alta a los profesores y los asignas a grados, cursos y materias.</li>
                  <li>En <strong>Estudiantes</strong> registras alumnos y los asignas a un grado y curso.</li>
                  <li>En <strong>Resumen</strong> revisas todo antes de finalizar.</li>
                </ul>
                <p className="text-slate-600 text-sm pt-2">
                  Usa los botones <strong>Anterior</strong> y <strong>Siguiente</strong> para moverte entre pasos. Al terminar el último paso podrás cerrar el asistente y seguir usando el panel de administración.
                </p>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 1: Grados y Cursos
                </h3>
                <p className="text-slate-600">
                  Los grados están predefinidos según el sistema educativo. Agrega los cursos que necesites para cada grado.
                </p>
              </div>

              {cargandoGrados ? (
                <WizardDataSkeleton label="Cargando grados y cursos guardados…" sections={4} />
              ) : (
              <>
              <div className="space-y-6">
                {Object.entries(gradosPorNivel).map(([nivel, grados]) => (
                  <div key={nivel} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-lg text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {nivel}
                    </h4>
                    
                    <div className="space-y-4">
                      {grados.map((grado) => {
                        const cursosDelGrado = cursos.filter(c => c.gradoId === grado.id);
                        const ejemploCurso = `${grado.nombre} A`;
                        const gradoExistente = gradosCargados.find((g: any) => g.nombre === grado.nombre);
                        const cursosExistentes = gradoExistente?.cursos || [];
                        
                        return (
                          <div key={grado.id} className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                              <div className="flex flex-wrap items-center gap-2 min-w-0">
                                <span className="font-semibold text-slate-900 text-lg">
                                  {grado.nombre}
                                </span>
                                <InfoTooltip
                                  label={`Ejemplo de curso para ${grado.nombre}`}
                                  size="sm"
                                  panelVariant="light"
                                  triggerVariant="muted"
                                >
                                  <div className="font-semibold text-slate-700">Ejemplos:</div>
                                  <div>{ejemploCurso}</div>
                                  <div>{grado.nombre} B</div>
                                  <div>{grado.nombre} C</div>
                                  <div className="mt-2 text-[11px] text-orange-600">
                                    Ten en cuenta que el nombre del curso debe seguir los estándares de la institución.
                                  </div>
                                </InfoTooltip>
                                <span className="text-sm text-slate-500">
                                  ({cursosDelGrado.length} curso{cursosDelGrado.length !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <button
                                onClick={() => agregarCurso(grado.id)}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Curso
                              </button>
                            </div>

                            {cursosExistentes.length > 0 && (
                              <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                                <div className="text-xs font-semibold uppercase text-blue-700">
                                  Cursos ya creados
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {cursosExistentes.map((curso: any) => (
                                    <span
                                      key={curso.id}
                                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200"
                                    >
                                      {curso.nombre}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {cursosDelGrado.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {cursosDelGrado.map((curso) => {
                                  return (
                                  <div
                                    key={curso.id}
                                    className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
                                  >
                                    <BufferedTextInput
                                      value={curso.nombre}
                                      onCommit={(nombre) => editarNombreCurso(curso.id, nombre)}
                                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900"
                                      placeholder={ejemploCurso}
                                      ariaLabel={`Nombre del curso para ${grado.nombre}`}
                                    />
                                    <button
                                      onClick={() => eliminarCurso(curso.id)}
                                      className="text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de guardar */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                    <p className="text-sm text-blue-700">
                      Guarda los grados predeterminados y los cursos creados en la base de datos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMostrarResumen(true)}
                    disabled={saving || cursosPendientesValidos.length === 0}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ver Resumen y Guardar
                      </>
                    )}
                  </button>
                </div>
                {cursosPendientesValidos.length === 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    Agrega al menos un curso con nombre para poder guardar
                  </p>
                )}
                {!tieneGradosYCursosGuardados && (
                  <p className="text-sm text-amber-700 mt-2">
                    Debes guardar al menos un grado con cursos antes de continuar al siguiente paso.
                  </p>
                )}
              </div>
              </>
              )}
            </div>
          )}

          {/* Modal de Resumen */}
          <Modal
            open={mostrarResumen}
            onClose={() => !saving && setMostrarResumen(false)}
            title={
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/20">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 008 22h12V4H8a4 4 0 00-4 4v11.5zM8 4v13" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold leading-tight text-white sm:text-xl">Resumen académico</div>
                  <div className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
                    Grados y cursos que se crearán
                  </div>
                </div>
              </div>
            }
            size="full"
            className="max-w-4xl overflow-hidden"
            zIndex={110}
            closeOnOverlayClick={!saving}
            showCloseButton={!saving}
            contentClassName="overflow-y-auto flex-1 px-6 py-4 max-h-[70vh]"
            headerClassName="border-b-0 bg-slate-800 px-5 py-5 sm:px-6"
            titleClassName="min-w-0"
            closeButtonClassName="text-white/80 hover:bg-white/15 hover:text-white"
          >
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-4.5A11.95 11.95 0 0112 2a11.95 11.95 0 01-8 3.5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Todo listo para guardar</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Verifica la estructura académica. Los grados y cursos indicados se agregarán a tu institución.
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.08 12.08 0 0118 15.5c0 1.38-2.686 2.5-6 2.5s-6-1.12-6-2.5c0-1.77.388-3.435.84-4.922L12 14z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold leading-none text-emerald-700">
                      {gradosPredeterminados.filter(grado =>
                        cursosPendientesValidos.some(curso => curso.gradoId === grado.id)
                      ).length}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700/80">Grados</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold leading-none text-blue-700">{cursosPendientesValidos.length}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700/80">Cursos</div>
                  </div>
                </div>
              </div>
            </div>

                  {/* Resumen de Grados */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">1</span>
                      <h3 className="font-semibold text-slate-900">Grados que se guardarán</h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {gradosPredeterminados.filter(grado => 
                          cursosPendientesValidos.some(curso => curso.gradoId === grado.id)
                        ).map((grado) => (
                          <div key={grado.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700">
                              {grado.nombre}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900">{grado.nombre}</div>
                              <div className="truncate text-xs text-slate-500">{grado.nivel}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Cursos */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">2</span>
                      <h3 className="font-semibold text-slate-900">Cursos que se guardarán</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(gradosPorNivel).map(([nivel, grados]) => {
                          const gradosConCursosNivel = grados.filter(g => 
                            cursosPendientesValidos.some(curso => curso.gradoId === g.id)
                          );
                          if (gradosConCursosNivel.length === 0) return null;
                          
                          return (
                            <div key={nivel} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">{nivel}</h4>
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                  {gradosConCursosNivel.length} {gradosConCursosNivel.length === 1 ? 'grado' : 'grados'}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {gradosConCursosNivel.map((grado) => {
                                  const cursosDelGrado = cursosPendientesValidos.filter(c => c.gradoId === grado.id);
                                  return (
                                    <div key={grado.id} className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
                                      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-3 py-2">
                                        <span className="text-sm font-bold text-slate-800">{grado.nombre}</span>
                                        <span className="text-xs font-medium text-blue-700">{cursosDelGrado.length} {cursosDelGrado.length === 1 ? 'curso' : 'cursos'}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-2 p-3">
                                        {cursosDelGrado.map((curso) => (
                                          <span key={curso.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {curso.nombre}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

            <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarResumen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="button" variant="primary" onClick={handleSaveGradosYCursos} disabled={saving}>
                {saving ? 'Guardando…' : 'Confirmar y guardar'}
              </Button>
            </div>
          </Modal>

          {/* Modal de Resumen para Áreas y Materias */}
          <Modal
            open={mostrarResumenAreas}
            onClose={() => !saving && setMostrarResumenAreas(false)}
            title={
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/20">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold leading-tight text-white sm:text-xl">Resumen académico</div>
                  <div className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
                    Áreas, materias y asignaciones
                  </div>
                </div>
              </div>
            }
            size="full"
            className="max-w-4xl overflow-hidden"
            zIndex={110}
            closeOnOverlayClick={!saving}
            showCloseButton={!saving}
            contentClassName="overflow-y-auto flex-1 px-6 py-4 max-h-[70vh]"
            headerClassName="border-b-0 bg-slate-800 px-5 py-5 sm:px-6"
            titleClassName="min-w-0"
            closeButtonClassName="text-white/80 hover:bg-white/15 hover:text-white"
          >
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-4.5A11.95 11.95 0 0112 2a11.95 11.95 0 01-8 3.5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Todo listo para guardar</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Verifica áreas, materias y su vínculo con los grados antes de confirmar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                <div className="text-2xl font-bold leading-none text-purple-700">{areasActivas.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-purple-700/80">Áreas</div>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <div className="text-2xl font-bold leading-none text-blue-700">{materias.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700/80">Materias</div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-2xl font-bold leading-none text-emerald-700">{materiasPorCurso.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700/80">Asignaciones</div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-2xl font-bold leading-none text-amber-700">{gradosCargados.length}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700/80">Grados</div>
              </div>
            </div>

                  {/* Resumen de Áreas */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700">1</span>
                      <h3 className="font-semibold text-slate-900">Áreas activas</h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {areasActivas.map((areaId) => {
                          const area = areasPredeterminadas.find(a => a.id === areaId);
                          return (
                            <div key={areaId} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">
                                A
                              </div>
                              <div className="min-w-0">
                                <div className="break-words font-semibold text-slate-900">{area?.nombre}</div>
                                {area?.es_opcional && (
                                  <span className="mt-1 inline-flex rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                    Opcional
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Materias */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">2</span>
                      <h3 className="font-semibold text-slate-900">Materias creadas</h3>
                    </div>
                    <div className="space-y-4">
                        {areasActivas.map((areaId) => {
                          const area = areasPredeterminadas.find(a => a.id === areaId);
                          const materiasDelArea = materias.filter(m => m.areaId === areaId);
                          
                          if (materiasDelArea.length === 0) return null;
                          
                          return (
                            <div key={areaId} className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
                              <div className="mb-3 flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700">{area?.nombre}</h4>
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                  {materiasDelArea.length} {materiasDelArea.length === 1 ? 'materia' : 'materias'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {materiasDelArea.map((materia) => (
                                  <span key={materia.id} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                    {materia.nombre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Resumen de Asignaciones */}
                  {materiasPorCurso.length > 0 && (
                    <div className="mb-6">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">3</span>
                        <h3 className="font-semibold text-slate-900">Asignaciones a grados</h3>
                      </div>
                      <div className="space-y-4">
                          {gradosCargados.map((grado) => {
                            const asignacionesDelGrado = materiasPorCurso.filter(mc => mc.gradoId === grado.id);
                            if (asignacionesDelGrado.length === 0) return null;
                            
                            return (
                              <div key={grado.id} className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-3 py-2">
                                  <span className="text-sm font-bold text-slate-800">{grado.nombre}</span>
                                  <span className="text-xs font-medium text-emerald-700">
                                    {asignacionesDelGrado.length} {asignacionesDelGrado.length === 1 ? 'materia' : 'materias'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 p-3">
                                  {asignacionesDelGrado.map((asignacion) => {
                                    const materia = materias.find(m => m.id === asignacion.materiaId);
                                    return (
                                      <span key={asignacion.materiaId} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        {materia?.nombre}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

            <div className="pt-4 mt-4 border-t border-[var(--color-border-light)] flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarResumenAreas(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="button" variant="primary" onClick={handleSaveAreasYMaterias} disabled={saving}>
                {saving ? 'Guardando…' : 'Confirmar y guardar'}
              </Button>
            </div>
          </Modal>

          {currentStep === 2 && (
            <div>
              <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 2: Áreas y Materias
              </h3>
              <p className="text-slate-600">
                  Activa las áreas que necesitas y crea las materias específicas para cada una.
                </p>
              </div>

              {/* Resumen de Grados Cargados */}
              {cargandoGrados ? (
                <div className="mb-6">
                  <WizardDataSkeleton label="Cargando grados disponibles…" sections={2} />
                </div>
              ) : gradosCargados.length > 0 ? (
                <div className="mb-6 overflow-hidden rounded-xl border border-green-200 bg-green-50">
                  <button
                    type="button"
                    onClick={() => setMostrarGradosDisponibles((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-green-100/70"
                    aria-expanded={mostrarGradosDisponibles}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
                      <h4 className="font-semibold text-green-900">
                        Grados Disponibles ({gradosCargados.length})
                      </h4>
                      <span className="hidden text-xs text-green-700 sm:inline">
                        Solo consulta — no se pueden eliminar aquí
                      </span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-green-800 border border-green-200">
                      {mostrarGradosDisponibles ? 'Ocultar' : 'Ver'}
                      <svg
                        className={`h-4 w-4 transition-transform ${mostrarGradosDisponibles ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {mostrarGradosDisponibles && (
                    <div className="border-t border-green-200 px-4 pb-4 pt-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {gradosCargados.map((grado) => (
                          <div key={grado.id} className="rounded-lg border border-green-200 bg-white p-3">
                            <div className="font-medium text-slate-900">{grado.nombre}</div>
                            <div className="text-sm text-slate-600">
                              {grado.cursos.length} curso{grado.cursos.length !== 1 ? 's' : ''}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {grado.cursos.length === 0 ? (
                                <span className="text-xs text-slate-500">Sin cursos registrados</span>
                              ) : (
                                grado.cursos.map((curso: any) => (
                                  <span
                                    key={curso.id}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                  >
                                    {curso.nombre}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-amber-700">No se encontraron grados. Asegúrate de completar el Paso 1 primero.</span>
                  </div>
                </div>
              )}

              {/* Áreas y materias ya guardadas */}
              {cargandoAreasMaterias ? (
                <div className="mb-6">
                  <WizardDataSkeleton label="Cargando áreas y materias guardadas…" sections={2} />
                </div>
              ) : areasCargadas.length > 0 || materiasCargadas.length > 0 ? (
                <div className="mb-6 overflow-hidden rounded-xl border border-blue-200 bg-blue-50">
                  <button
                    type="button"
                    onClick={() => setMostrarAreasMateriasDisponibles((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-100/70"
                    aria-expanded={mostrarAreasMateriasDisponibles}
                  >
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        Áreas y materias guardadas ({areasCargadas.length} área
                        {areasCargadas.length !== 1 ? 's' : ''}, {materiasCargadas.length} materia
                        {materiasCargadas.length !== 1 ? 's' : ''})
                      </h4>
                      <span className="hidden text-xs text-blue-700 sm:inline">
                        Solo consulta — no se pueden eliminar aquí
                      </span>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-800">
                      {mostrarAreasMateriasDisponibles ? 'Ocultar' : 'Ver'}
                      <svg
                        className={`h-4 w-4 transition-transform ${mostrarAreasMateriasDisponibles ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {mostrarAreasMateriasDisponibles && (
                    <div className="space-y-4 border-t border-blue-200 px-4 pb-4 pt-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {areasCargadas.map((area: any) => {
                          const materiasDelArea = materiasCargadas.filter(
                            (m: any) => m.area_id === area.id || m.areaId === area.id
                          );
                          return (
                            <div
                              key={area.id}
                              className="rounded-lg border border-blue-200 bg-white p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-900">{area.nombre}</div>
                                  <div className="text-sm text-slate-600">
                                    {materiasDelArea.length} materia
                                    {materiasDelArea.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                                {area.es_opcional && (
                                  <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                    Opcional
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {materiasDelArea.length === 0 ? (
                                  <span className="text-xs text-slate-500">Sin materias registradas</span>
                                ) : (
                                  materiasDelArea.map((materia: any) => (
                                    <span
                                      key={materia.id}
                                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                    >
                                      {materia.nombre}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {materiasGradosCargados.length > 0 && (
                        <div>
                          <h5 className="mb-2 text-sm font-semibold text-blue-900">
                            Asignaciones a grados ({materiasGradosCargados.length})
                          </h5>
                          <div className="space-y-2">
                            {gradosCargados.map((grado: any) => {
                              const asignaciones = materiasGradosCargados.filter(
                                (mg: any) => mg.grado_id === grado.id || mg.gradoId === grado.id
                              );
                              if (asignaciones.length === 0) return null;
                              return (
                                <div
                                  key={grado.id}
                                  className="rounded-lg border border-blue-100 bg-white p-3"
                                >
                                  <div className="mb-2 text-sm font-medium text-slate-800">
                                    {grado.nombre}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {asignaciones.map((mg: any) => (
                                      <span
                                        key={mg.id ?? `${mg.materia_id}-${mg.grado_id}`}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                                      >
                                        {mg.materia?.nombre ||
                                          materiasCargadas.find(
                                            (m: any) => m.id === (mg.materia_id ?? mg.materiaId)
                                          )?.nombre ||
                                          'Materia'}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Sección 1: Activar/Desactivar Áreas */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  2.1 Seleccionar Áreas
                </h4>
                <AreasTogglePanel
                  areas={areasPredeterminadas}
                  value={areasActivas}
                  onChange={handleAreasActivasChange}
                />
              </div>

              {/* Sección 2: Crear Materias */}
              {areasActivas.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    2.2 Crear Materias por Área
                  </h4>
                  <MateriasEditorPanel
                    activeAreaIds={areasActivas}
                    areas={areasPredeterminadas}
                    examples={ejemplosMateriasPorArea}
                    value={materias}
                    onChange={setMaterias}
                  />
                </div>
              )}

              {/* Sección 3: Asignar Materias a Grados */}
              {areasActivas.length > 0 && materias.length > 0 && gradosCargados.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    2.3 Asignar Materias a Grados
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-4">
                      Selecciona qué materias se imparten en cada grado. Esto definirá el plan de estudios.
                    </p>
                    
                    <div className="space-y-4">
                      <AsignarMateriasAGradosPanel
                        grados={gradosCargados}
                        materias={materias}
                        value={materiasPorCurso}
                        onChange={setMateriasPorCurso}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de guardar */}
              {areasActivas.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                      <p className="text-sm text-blue-700">
                        Guarda las áreas activas, materias y asignaciones a grados
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarResumenAreas(true)}
                      disabled={saving || materias.length === 0}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ver Resumen y Guardar
                    </button>
                  </div>
                  {materias.length === 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      Crea al menos una materia para poder guardar
                    </p>
                  )}
                  {!tieneAreasYMateriasGuardadas && (
                    <p className="mt-2 text-sm text-amber-700">
                      Debes guardar áreas y materias antes de continuar al siguiente paso.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 3: Creación de Docentes
              </h3>
              <p className="text-slate-600">
                  Crea los docentes y asígnalos a las materias correspondientes
              </p>
            </div>

              {/* Formulario de creación de docente con acordeón */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  📝 Información del Docente
                </h4>

                {/* Acordeón de secciones */}
                <div className="space-y-4">
                  {/* Sección 1: Datos Personales */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('datos')}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        seccionActiva === 'datos' 
                          ? 'bg-blue-50 text-blue-900' 
                          : seccionesCompletadas.datos 
                            ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {seccionesCompletadas.datos ? '✅' : seccionActiva === 'datos' ? '📋' : '⏳'}
                        </span>
                        <span className="font-medium">Datos Personales</span>
                        {seccionesCompletadas.datos && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'datos' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'datos' && (
                      <DocenteDatosPersonalesPanel
                        value={docenteDatosValue}
                        onCommitField={handleDocenteDatosCommit}
                        onClearFieldError={handleClearDocenteFieldError}
                        camposHabilitados={camposHabilitados}
                        erroresValidacion={erroresValidacion}
                        camposValidados={camposValidados}
                        emailVerificado={emailVerificado}
                        verificandoEmail={verificandoEmail}
                        mostrarPassword={mostrarPassword}
                        onTogglePassword={() => setMostrarPassword((prev) => !prev)}
                        onVerifyEmail={verificarEmailManual}
                        onGeneratePassword={generarPassword}
                        passwordEnabled={campoPasswordHabilitado()}
                        passwordButtonsEnabled={botonesPasswordHabilitados()}
                      />
                    )}
                  </div>

                  {/* Sección 2: Grados y Cursos */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('grados')}
                      disabled={!seccionesHabilitadas.grados}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        !seccionesHabilitadas.grados
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : seccionActiva === 'grados' 
                            ? 'bg-blue-50 text-blue-900' 
                            : seccionesCompletadas.grados 
                              ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.grados ? '🔒' : seccionesCompletadas.grados ? '✅' : seccionActiva === 'grados' ? '📚' : '⏳'}
                        </span>
                        <span className="font-medium">Grados y Cursos</span>
                        {seccionesCompletadas.grados && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.grados && (
                          <span className="text-sm text-gray-500">Completa datos personales primero</span>
                        )}
                        {seccionesHabilitadas.grados && !seccionesCompletadas.grados && gradosSeleccionados.length > 0 && (
                          <span className="text-sm text-yellow-600">Selecciona al menos un curso por grado</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'grados' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'grados' && seccionesHabilitadas.grados && (
                      <div className="p-4 border-t border-slate-200">

                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-green-900 mb-3">📚 Grados y Cursos</h5>
                          <p className="text-sm text-green-700 mb-4">
                            Selecciona las combinaciones grado-curso donde enseñará este docente
                          </p>
                  
                  {gradosCargados.length > 0 ? (
                    <div className="space-y-3">
                      {gradosCargados.map((grado) => (
                        <div key={grado.id} className="border border-green-200 rounded-lg p-3">
                          <div className="mb-3">
                            <span className="font-medium text-green-900">
                              {grado.nombre} - {grado.nivel}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-green-700">Cursos disponibles:</p>
                            {grado.cursos.map((curso: any) => {
                              const isSelected = asignacionesGradoCurso.some(a => a.gradoId === grado.id && a.cursoId === curso.id);
                              return (
                                <div key={curso.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 border border-green-100 rounded">
                                  <label className="flex items-center min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          agregarGradoCurso(grado.id, curso.id);
                                        } else {
                                          eliminarGradoCurso(grado.id, curso.id);
                                        }
                                      }}
                                      className="wizard-quiet-focus mr-3 h-4 w-4 rounded border-green-300 text-green-600"
                                    />
                                    <span className="text-sm text-green-800 break-words">
                                      {curso.nombre}
                                    </span>
                                  </label>
                                  {isSelected && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded self-start sm:self-auto">
                                      Seleccionado
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600">
                      Cargando grados disponibles...
                    </p>
                  )}
                          
                          {/* Resumen de selecciones */}
                          {asignacionesGradoCurso.length > 0 && (
                            <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
                              <h6 className="font-medium text-green-900 mb-2">✅ Asignaciones seleccionadas:</h6>
                              <div className="space-y-1">
                                {asignacionesGradoCurso.map((asignacion, index) => (
                                  <div key={index} className="text-sm text-green-700 flex items-center justify-between">
                                    <span>{asignacion.gradoNombre} - {asignacion.cursoNombre}</span>
                                    <button
                                      onClick={() => eliminarGradoCurso(asignacion.gradoId, asignacion.cursoId)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección 3: Áreas y Materias */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('materias')}
                      disabled={!seccionesHabilitadas.materias}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        !seccionesHabilitadas.materias
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : seccionActiva === 'materias' 
                            ? 'bg-blue-50 text-blue-900' 
                            : seccionesCompletadas.materias 
                              ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.materias ? '🔒' : seccionesCompletadas.materias ? '✅' : seccionActiva === 'materias' ? '🔬' : '⏳'}
                        </span>
                        <span className="font-medium">Áreas y Materias</span>
                        {seccionesCompletadas.materias && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.materias && (
                          <span className="text-sm text-gray-500">Completa grados y cursos primero</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'materias' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'materias' && seccionesHabilitadas.materias && (
                      <div className="p-4 border-t border-slate-200">
                        <div className="bg-purple-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-purple-900 mb-3">🔬 Materias por Grado-Curso</h5>
                          <p className="text-sm text-purple-700 mb-4">
                            Selecciona las materias específicas que enseñará este docente en cada grado-curso
                          </p>
                  
                          {cargandoAreasMaterias ? (
                            <WizardDataSkeleton label="Cargando materias disponibles…" sections={1} />
                          ) : asignacionesGradoCurso.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm text-yellow-700">
                                ⚠️ Primero selecciona los grados y cursos en la sección anterior
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {asignacionesGradoCurso.map((asignacion, index) => {
                                const grado = gradosCargados.find(g => g.id === asignacion.gradoId);
                                const materiasDelGrado = materiasPorGrado[asignacion.gradoId] || [];
                                
                                return (
                                  <div key={index} className="border border-purple-200 rounded-lg p-4">
                                    <h6 className="font-semibold text-purple-900 mb-3 flex items-center">
                                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                      🎯 {asignacion.gradoNombre} - {asignacion.cursoNombre}
                                    </h6>
                                    
                                    {materiasDelGrado.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {materiasDelGrado.map((materia) => (
                                          <label key={`${asignacion.gradoId}-${asignacion.cursoId}-${materia.id}`} className="flex items-center p-2 hover:bg-purple-50 rounded">
                                            <input
                                              type="checkbox"
                                              checked={asignacion.materiasSeleccionadas.includes(materia.id)}
                                              onChange={(e) => handleMateriaGradoCurso(asignacion.gradoId, asignacion.cursoId, materia.id, e.target.checked)}
                                              className="wizard-quiet-focus h-4 w-4 rounded border-purple-300 text-purple-600"
                                            />
                                            <span className="ml-2 text-sm text-purple-800">
                                              {materia.nombre}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-purple-600 italic">
                                        No hay materias asignadas a este grado
                                      </p>
                                    )}
                                    
                                    {/* Resumen de materias seleccionadas para este grado-curso */}
                                    {asignacion.materiasSeleccionadas.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-purple-100">
                                        <p className="text-xs text-purple-600 mb-2">Materias seleccionadas:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {asignacion.materiasSeleccionadas.map(materiaId => {
                                            const materia = materiasDelGrado.find(m => m.id === materiaId);
                                            return materia ? (
                                              <span key={materiaId} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                {materia.nombre}
                                              </span>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumen de Asignaciones */}
                  {(gradosSeleccionados.length > 0 || areasSeleccionadas.length > 0) && (
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-slate-900 mb-3">📋 Resumen de Asignaciones</h5>
                
                {gradosSeleccionados.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Grados y Cursos:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {gradosSeleccionados.map(gradoId => {
                        const grado = gradosCargados.find(g => g.id === gradoId);
                        const cursos = cursosPorGrado[gradoId] || [];
                        return (
                          <li key={gradoId} className="ml-4">
                            • {grado?.nombre}: {cursos.length > 0 ? cursos.map(cursoId => {
                              const curso = grado?.cursos.find((c: any) => c.id === cursoId);
                              return curso?.nombre;
                            }).join(', ') : 'Sin cursos seleccionados'}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {Object.keys(materiasPorArea).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Materias por Grado:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {Object.entries(materiasPorArea).map(([gradoId, materias]) => {
                        const grado = gradosCargados.find(g => g.id === parseInt(gradoId));
                        if (materias.length === 0) return null;
                        
                        return (
                          <li key={gradoId} className="ml-4">
                            • {grado?.nombre}: {materias.map(materiaId => {
                              const materia = materiasFiltradas.find(m => m.id === materiaId);
                              return materia?.nombre;
                            }).join(', ')}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
              <button
                onClick={limpiarFormularioDocente}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-left sm:text-center"
              >
                Limpiar formulario
              </button>
              <div className="flex flex-col items-stretch sm:items-end gap-2">
                {!docenteSubpasosCompletos && (
                  <p className="text-xs text-amber-700 text-right">
                    Completa:{' '}
                    {[
                      !seccionesCompletadas.datos && 'datos personales',
                      !seccionesCompletadas.grados && 'grados y cursos',
                      !seccionesCompletadas.materias && 'materias por grado-curso',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
                <button
                  onClick={handleAgregarDocente}
                  disabled={!docenteSubpasosCompletos}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    !docenteSubpasosCompletos
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar Docente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de docentes creados */}
        {docentes.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              👥 Docentes Creados ({docentes.length})
            </h4>
            <div className="space-y-3">
              {docentes.map((docente) => {
                const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                const isExpanded = asignacionesExpandidas[docente.id] || false;
                const totalAsignaciones = asignaciones.asignaciones.length;
                const totalMaterias = asignaciones.asignaciones.reduce((sum, a) => sum + a.materiasSeleccionadas.length, 0);
                
                return (
                  <div key={docente.id} className="bg-slate-50 rounded-lg border border-slate-200 relative">
                    {/* Información básica del docente */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 pr-12">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-slate-900 break-words">
                          {docente.nombres} {docente.apellidos}
                        </h5>
                        <p className="text-sm text-slate-600 break-words">{docente.email}</p>
                        {totalAsignaciones > 0 && (
                          <p className="text-xs text-slate-500 mt-1 break-words">
                            {totalAsignaciones} asignacion{totalAsignaciones !== 1 ? 'es' : ''} • {totalMaterias} materia{totalMaterias !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
                        {/* Botón Ver Asignaciones */}
                        {totalAsignaciones > 0 && (
                          <button
                            onClick={() => toggleAsignaciones(docente.id)}
                            className="w-full sm:w-auto flex items-center justify-center space-x-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                          >
                            <span>{isExpanded ? 'Ocultar' : 'Ver'} asignaciones</span>
                            <svg 
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Estado */}
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Activo
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => eliminarDocente(docente.id)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 transition-colors"
                      title="Eliminar docente"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    {/* Asignaciones expandibles */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 bg-white">
                        {totalAsignaciones > 0 ? (
                          <div className="space-y-3">
                            <h6 className="text-sm font-medium text-slate-700 mb-3">📚 Asignaciones detalladas:</h6>
                            {asignaciones.asignaciones.map((asignacion, index) => (
                              <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-slate-800">
                                    {asignacion.gradoNombre} - {asignacion.cursoNombre}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {asignacion.materiasSeleccionadas.length} materia{asignacion.materiasSeleccionadas.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                {/* Materias asignadas */}
                                {asignacion.materiasSeleccionadas.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {asignacion.materiasSeleccionadas.map((materiaId) => {
                                      const { materiaNombre, areaNombre } = obtenerDatosMateriaYArea(materiaId);
                                      return (
                                        <span key={materiaId} className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                          <span className="font-medium">{materiaNombre}</span>
                                          <span className="ml-1 text-purple-600">({areaNombre})</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic text-center py-4">
                            Sin asignaciones
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón para continuar */}
        {docentes.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-green-900">Listo para continuar</h4>
                <p className="text-sm text-green-700">
                  {docentes.length} docente{docentes.length !== 1 ? 's' : ''} creado{docentes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={mostrarConfirmacion}
                disabled={saving}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  saving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardar Docentes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 4: Creación de Estudiantes
                </h3>
                <p className="text-slate-600">
                  Crea los estudiantes y asígnalos a los grados y cursos correspondientes
                </p>
              </div>

              <EstudianteFormPanel
                value={estudianteActual}
                onFieldChange={handleEstudianteFieldChange}
                camposHabilitados={camposHabilitadosEstudiante}
                erroresValidacion={erroresValidacionEstudiante}
                camposValidados={camposValidadosEstudiante}
                gradosDisponibles={gradosDisponibles}
                cursosDisponibles={cursosDisponibles}
                cargandoCursos={cargandoCursos}
                onLimpiar={limpiarFormularioEstudiante}
                onAgregar={handleAgregarEstudiante}
              />

              {/* Lista de Estudiantes */}
              {estudiantes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Estudiantes Agregados ({estudiantes.length})
                  </h4>
                  <div className="space-y-3">
                    {estudiantes.map((estudiante) => (
                      <div key={estudiante.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 break-words">
                                {estudiante.nombres} {estudiante.apellidos}
                              </p>
                              <p className="text-sm text-slate-600 break-words">
                                Código: {estudiante.codigo_estudiantil} | 
                                Acudiente: {estudiante.nombre_acudiente} | 
                                Tel: {estudiante.telefono_acudiente}
                              </p>
                              <p className="text-sm text-slate-500 break-words">
                                Grado: {gradosDisponibles.find(g => g.id === estudiante.grado_id)?.nombre || 'N/A'} | 
                                Curso: {todosLosCursos.find(c => c.id === estudiante.curso_id)?.nombre || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start sm:justify-end">
                          <button
                            onClick={() => eliminarEstudiante(estudiante.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para guardar estudiantes */}
              {estudiantes.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={guardarEstudiantes}
                    disabled={saving}
                    className={`px-8 py-3 rounded-lg transition-colors flex items-center text-lg font-medium ${
                      saving
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar {estudiantes.length} Estudiante{estudiantes.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  🎉 ¡Configuración Completada!
                </h3>
                <p className="text-slate-600">
                  Revisa el resumen de toda la configuración realizada para tu institución
                </p>
              </div>

              {/* Cards de Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Docentes */}
                <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Docentes</p>
                      <p className="text-3xl font-bold">{docentes.length}</p>
                    </div>
                    <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Estudiantes */}
                <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Estudiantes</p>
                      <p className="text-3xl font-bold">{estudiantes.length}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Materias */}
                <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Materias</p>
                      <p className="text-3xl font-bold">{materias.length}</p>
                    </div>
                    <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Grados */}
                <div className="bg-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Total Grados</p>
                      <p className="text-3xl font-bold">{gradosDisponibles.length}</p>
                    </div>
                    <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen Detallado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Resumen de Docentes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Docentes Registrados
                  </h4>
                  {docentes.length > 0 ? (
                    <div className="space-y-3">
                      {docentes.slice(0, 3).map((docente) => (
                        <div key={docente.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{docente.nombres} {docente.apellidos}</p>
                            <p className="text-sm text-slate-600">{docente.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-600 font-medium">
                              {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0)} asignaciones
                            </p>
                          </div>
                        </div>
                      ))}
                      {docentes.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">
                          ... y {docentes.length - 3} docente(s) más
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay docentes registrados</p>
                  )}
                </div>

                {/* Resumen de Estudiantes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Estudiantes Matriculados
                  </h4>
                  {estudiantes.length > 0 ? (
                    <div className="space-y-3">
                      {estudiantes.slice(0, 3).map((estudiante) => (
                        <div key={estudiante.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{estudiante.nombres} {estudiante.apellidos}</p>
                            <p className="text-sm text-slate-600">Código: {estudiante.codigo_estudiantil}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-600 font-medium">
                              Grado {gradosDisponibles.find(g => g.id === estudiante.grado_id)?.nombre || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {estudiantes.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">
                          ... y {estudiantes.length - 3} estudiante(s) más
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay estudiantes matriculados</p>
                  )}
                </div>
              </div>

              {/* Estructura Académica */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Estructura Académica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradosDisponibles.slice(0, 6).map((grado) => (
                    <div key={grado.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-slate-900">{grado.nombre}</h5>
                      <p className="text-sm text-slate-600 mb-2">{grado.nivel}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Cursos: {grado.cursos?.length || 0}</span>
                        <span>Materias: {materiasGradosCargados.filter(mg => mg.grado_id === grado.id).length}</span>
                      </div>
                    </div>
                  ))}
                  {gradosDisponibles.length > 6 && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                      <p className="text-sm text-slate-500">
                        +{gradosDisponibles.length - 6} grados más
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Volver a Editar
                </button>
                
                <button
                  onClick={() => {
                    // Limpiar todos los datos en caché
                    limpiarDatosCompletos();
                    
                    showSuccess('Configuración completada', 'Tu institución está lista para enviar recordatorios.');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-base sm:text-lg font-medium"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Finalizar Configuración
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={saving}
                className="w-full rounded-lg bg-slate-200 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Anterior
              </button>
            ) : (
              <div className="w-full sm:w-auto sm:min-w-[100px]" aria-hidden="true" />
            )}

            <div className="text-center text-sm text-slate-600">
              {currentStep === 0 ? 'Introducción' : `Paso ${currentStep} de 5`}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                saving ||
                currentStep === 5 ||
                (currentStep === 1 && !tieneGradosYCursosGuardados) ||
                (currentStep === 2 && !tieneAreasYMateriasGuardadas)
              }
              className={`w-full rounded-lg px-6 py-2 font-medium transition-colors sm:w-auto ${
                saving ||
                currentStep === 5 ||
                (currentStep === 1 && !tieneGradosYCursosGuardados) ||
                (currentStep === 2 && !tieneAreasYMateriasGuardadas)
                  ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={
                saving
                  ? 'Espera a que termine el guardado'
                  : currentStep === 1 && !tieneGradosYCursosGuardados
                  ? 'Guarda al menos un grado con cursos para continuar'
                  : currentStep === 2 && !tieneAreasYMateriasGuardadas
                    ? 'Guarda áreas y materias para continuar'
                    : undefined
              }
            >
              {currentStep === 5 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
    </Modal>

      <Modal
        open={mostrarConfirmacionGuardado}
        onClose={() => !saving && setMostrarConfirmacionGuardado(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold leading-tight text-white sm:text-xl">Resumen de docentes</div>
              <div className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
                Revisa antes de confirmar el guardado
              </div>
            </div>
          </div>
        }
        size="full"
        className="max-w-3xl overflow-hidden"
        zIndex={120}
        closeOnOverlayClick={!saving}
        showCloseButton={!saving}
        contentClassName="overflow-y-auto flex-1 px-6 py-4 max-h-[70vh]"
        headerClassName="border-b-0 bg-slate-800 px-5 py-5 sm:px-6"
        titleClassName="min-w-0"
        closeButtonClassName="text-white/80 hover:bg-white/15 hover:text-white"
      >
        {(() => {
          const totalAsignaciones = Object.values(asignacionesPorDocente).reduce(
            (total, asign) => total + asign.asignaciones.length,
            0
          );
          const totalMaterias = Object.values(asignacionesPorDocente).reduce(
            (total, asign) =>
              total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0),
            0
          );

          return (
            <>
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-4.5A11.95 11.95 0 0112 2a11.95 11.95 0 01-8 3.5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Todo listo para guardar</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Verifica los docentes y sus asignaciones. Al confirmar se crearán las cuentas y se enviarán las credenciales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-2xl font-bold leading-none text-blue-700">{docentes.length}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700/80">Docentes</div>
                </div>
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                  <div className="text-2xl font-bold leading-none text-purple-700">{totalAsignaciones}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-purple-700/80">Asignaciones</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-2xl font-bold leading-none text-emerald-700">{totalMaterias}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700/80">Materias</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">1</span>
                  <h3 className="font-semibold text-slate-900">Docentes a crear</h3>
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
                  {docentes.map((docente) => {
                    const asignaciones = asignacionesPorDocente[docente.id]?.asignaciones ?? [];
                    const materiasCount = asignaciones.reduce(
                      (sum, a) => sum + a.materiasSeleccionadas.length,
                      0
                    );

                    return (
                      <div
                        key={docente.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 break-words">
                              {docente.nombres} {docente.apellidos}
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600 break-all">{docente.email}</div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                              {asignaciones.length} {asignaciones.length === 1 ? 'asignación' : 'asignaciones'}
                            </span>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              {materiasCount} {materiasCount === 1 ? 'materia' : 'materias'}
                            </span>
                          </div>
                        </div>
                        {asignaciones.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                            {asignaciones.map((asignacion, idx) => (
                              <span
                                key={`${docente.id}-${asignacion.gradoId}-${asignacion.cursoId}-${idx}`}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                              >
                                {asignacion.gradoNombre || 'Grado'} · {asignacion.cursoNombre || 'Curso'} ·{' '}
                                {asignacion.materiasSeleccionadas.length} mat.
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 sm:p-4">
                <strong>Importante:</strong> Una vez guardados, los docentes recibirán un email con sus credenciales de acceso.
              </p>

              <div className="flex flex-col gap-3 border-t border-[var(--color-border-light)] pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarConfirmacionGuardado(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="button" variant="primary" onClick={guardarDocentes} disabled={saving}>
                  {saving ? 'Guardando…' : 'Confirmar y guardar'}
                </Button>
              </div>
            </>
          );
        })()}
      </Modal>

      {/* Modal eliminado - ya no se necesita */}
      {false && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Resumen - Docentes</h2>
              <button
                onClick={() => {}}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Estadísticas */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-green-700">
                      {docentes.length} docente{docentes.length !== 1 ? 's' : ''} a crear
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-blue-700">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0)} asignacion{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0) !== 1 ? 'es' : ''} total{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0) !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-purple-700">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0)} materia{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0) !== 1 ? 's' : ''} asignada{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug: Estado completo de asignaciones */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>DEBUG - Estado de asignacionesPorDocente:</strong>
              <pre>{JSON.stringify(asignacionesPorDocente, null, 2)}</pre>
            </div>

            {/* Tabla de docentes */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Docentes a crear:</h3>
              
              {/* Vista de tabla para todos los casos */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Docente
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Grado
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Curso
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Materia
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Área
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {docentes.flatMap((docente, docenteIndex) => {
                          const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                          
                          // Debug: Log de datos del docente
                          console.log(`=== DOCENTE ${docente.nombres} ${docente.apellidos} (ID: ${docente.id}) ===`);
                          console.log('Asignaciones completas:', asignaciones);
                          console.log('Total asignaciones:', asignaciones.asignaciones.length);
                          
                          // Crear filas para cada asignación del docente
                          const filas: React.ReactElement[] = [];
                          let isFirstRowForDocente = true;
                          
                          asignaciones.asignaciones.forEach((asignacion, asignacionIndex) => {
                            console.log(`  Asignación ${asignacionIndex}: ${asignacion.gradoNombre} - ${asignacion.cursoNombre}`);
                            console.log('    Materias:', asignacion.materiasSeleccionadas);
                            
                            asignacion.materiasSeleccionadas.forEach((materiaId: number, materiaIndex: number) => {
                              console.log(`      Materia ID ${materiaIndex}:`, materiaId);
                              const { materiaNombre, areaNombre } = obtenerDatosMateriaYArea(materiaId);
                              console.log(`      Materia: ${materiaNombre}, Área: ${areaNombre}`);
                              
                              // Mostrar datos del docente solo en la primera fila del primer docente
                              // Mostrar datos del grado-curso en la primera fila de cada asignación
                              const isFirstRowForThisDocenteGradoCurso = isFirstRowForDocente && materiaIndex === 0;
                              
                              console.log(`    RENDERIZANDO FILA - Docente: ${isFirstRowForDocente}, MateriaIndex: ${materiaIndex}, Combinado: ${isFirstRowForThisDocenteGradoCurso}`);
                              
                              filas.push(
                                <tr key={`${docente.id}-${asignacion.gradoId}-${asignacion.cursoId}-${materiaId}-${materiaIndex}`} 
                                    className={docenteIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                  <td className="px-4 py-3 text-sm">
                                    {isFirstRowForThisDocenteGradoCurso ? (
                                      <div>
                                        <div className="font-medium text-slate-900">{docente.nombres} {docente.apellidos}</div>
                                        <div className="text-slate-500 text-xs">{docente.email}</div>
                                      </div>
                                    ) : (
                                      <div className="text-slate-400 text-xs">↳</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900">
                                    {isFirstRowForThisDocenteGradoCurso ? asignacion.gradoNombre : ''}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900">
                                    {isFirstRowForThisDocenteGradoCurso ? asignacion.cursoNombre : ''}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                      {materiaNombre}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">
                                    {areaNombre}
                                  </td>
                                </tr>
                              );
                              
                              // Solo cambiar isFirstRowForDocente después de la primera materia del primer docente
                              if (isFirstRowForDocente && asignacionIndex === 0 && materiaIndex === 0) {
                                isFirstRowForDocente = false;
                              }
                            });
                          });
                          
                          console.log(`Total filas generadas para ${docente.nombres}:`, filas.length);
                          return filas;
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Resumen de la tabla */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                      <span>
                        Total: {docentes.length} docente{docentes.length !== 1 ? 's' : ''} con asignaciones
                      </span>
                      <span>
                        {docentes.reduce((total, docente) => {
                          const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                          return total + asignaciones.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0);
                        }, 0)} asignaciones totales
                      </span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {}}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {}}
                disabled={saving}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                  saving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar y Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
