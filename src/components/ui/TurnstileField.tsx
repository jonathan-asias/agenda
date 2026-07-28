'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  getTurnstileSiteKey,
  isTurnstileClientEnabled,
} from '@/lib/security/turnstile-client';

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  'timeout-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'flexible' | 'compact';
  appearance?: 'always' | 'execute' | 'interaction-only';
  execution?: 'render' | 'execute';
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        parameters: TurnstileRenderOptions
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      execute: (container?: HTMLElement | string, parameters?: TurnstileRenderOptions) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

const SCRIPT_ID = 'cloudflare-turnstile-script';
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile?.render) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      const wait = () => {
        if (window.turnstile?.render) {
          resolve();
        } else {
          setTimeout(wait, 40);
        }
      };
      wait();
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.turnstile) {
        reject(new Error('turnstile no disponible'));
        return;
      }
      resolve();
    };
    script.onerror = () => reject(new Error('No se pudo cargar Cloudflare Turnstile'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export type TurnstileFieldProps = {
  onChange: (token: string | null) => void;
  className?: string;
  /** Reinicia el widget cuando cambia (p. ej. al abrir/cerrar modal). */
  resetKey?: string | number | boolean;
};

/**
 * Checkbox "No soy un robot" + Cloudflare Turnstile.
 * El challenge solo corre cuando el usuario marca el recuadro (execution: execute),
 * para que el login no quede habilitado de forma automática.
 */
export default function TurnstileField({
  onChange,
  className = '',
  resetKey,
}: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  const reactId = useId().replace(/:/g, '');
  const [checked, setChecked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setChecked(false);
    setVerifying(false);
    setVerifyError('');
    onChangeRef.current(null);
  }, [resetKey]);

  useEffect(() => {
    if (!isTurnstileClientEnabled()) {
      onChangeRef.current(null);
      return;
    }

    let cancelled = false;
    const siteKey = getTurnstileSiteKey();

    const mount = async () => {
      try {
        await loadTurnstileScript();
        if (cancelled || !containerRef.current || !window.turnstile) return;

        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
          widgetIdRef.current = null;
        }

        containerRef.current.innerHTML = '';
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          // No genera token hasta turnstile.execute()
          execution: 'execute',
          appearance: 'always',
          callback: (token: string) => {
            setVerifying(false);
            setVerifyError('');
            onChangeRef.current(token);
          },
          'expired-callback': () => {
            setVerifying(false);
            setChecked(false);
            onChangeRef.current(null);
          },
          'error-callback': () => {
            setVerifying(false);
            setChecked(false);
            setVerifyError('No se pudo completar la verificación. Intenta de nuevo.');
            onChangeRef.current(null);
          },
          'timeout-callback': () => {
            setVerifying(false);
            setChecked(false);
            setVerifyError('La verificación expiró. Marca el recuadro otra vez.');
            onChangeRef.current(null);
          },
          theme: 'light',
          size: 'flexible',
        });
        onChangeRef.current(null);
      } catch (err) {
        console.error('[turnstile] Error al montar widget:', err);
        setVerifyError('No se pudo cargar la verificación de seguridad.');
        onChangeRef.current(null);
      }
    };

    void mount();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
      widgetIdRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      onChangeRef.current(null);
    };
  }, [resetKey]);

  const handleCheckboxChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    setVerifyError('');

    if (!nextChecked) {
      setVerifying(false);
      onChangeRef.current(null);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (!widgetIdRef.current || !window.turnstile || !containerRef.current) {
      setChecked(false);
      setVerifyError('La verificación aún no está lista. Espera un momento.');
      return;
    }

    setVerifying(true);
    onChangeRef.current(null);
    try {
      window.turnstile.execute(containerRef.current);
    } catch (err) {
      console.error('[turnstile] Error al ejecutar challenge:', err);
      setVerifying(false);
      setChecked(false);
      setVerifyError('No se pudo iniciar la verificación. Intenta de nuevo.');
      onChangeRef.current(null);
    }
  };

  if (!isTurnstileClientEnabled()) {
    return null;
  }

  return (
    <div className={className || undefined}>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 select-none hover:bg-slate-100/80">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          checked={checked}
          disabled={verifying}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          aria-describedby={`turnstile-help-${reactId}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-slate-800">No soy un robot</span>
          <span id={`turnstile-help-${reactId}`} className="mt-0.5 block text-xs text-slate-500">
            {verifying
              ? 'Verificando… marca el desafío de Cloudflare si aparece.'
              : 'Marca esta casilla para activar la verificación de seguridad.'}
          </span>
        </span>
      </label>

      <div
        ref={containerRef}
        id={`turnstile-${reactId}`}
        className={`cf-turnstile mt-3 ${checked ? '' : 'hidden'}`}
        aria-label="Verificación Cloudflare Turnstile"
      />

      {verifyError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {verifyError}
        </p>
      )}
    </div>
  );
}

export {
  isTurnstileClientEnabled,
  isTurnstileVerified,
} from '@/lib/security/turnstile-client';
