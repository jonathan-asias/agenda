'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LoaderPage } from '@/components/ui';

const REDIRECT_SECONDS = 20;

type ConfirmState = 'loading' | 'confirmed' | 'pending' | 'error';

export default function PagoExitosoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmState, setConfirmState] = useState<ConfirmState>('loading');
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [resolvedRef, setResolvedRef] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [wompiTransactionId, setWompiTransactionId] = useState('');

  const refFromUrl =
    searchParams.get('ref')?.trim() ||
    searchParams.get('external_reference')?.trim() ||
    '';
  const emailFromUrl = searchParams.get('email')?.trim().toLowerCase() || '';
  const gateway =
    searchParams.get('gateway')?.trim().toLowerCase() ||
    (searchParams.get('id') ? 'wompi' : 'mercadopago');
  const wompiIdFromUrl = searchParams.get('id')?.trim() || '';

  const ref = resolvedRef || refFromUrl;
  const email = resolvedEmail || emailFromUrl;
  const wompiId = wompiTransactionId || wompiIdFromUrl;

  const goHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  useEffect(() => {
    if (gateway !== 'wompi' || !wompiIdFromUrl) return;
    if (refFromUrl && emailFromUrl) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/wompi/resolve-return?id=${encodeURIComponent(wompiIdFromUrl)}`
        );
        const data = await res.json();
        if (!cancelled && res.ok) {
          if (data.ref) setResolvedRef(data.ref);
          if (data.email) setResolvedEmail(data.email);
          if (data.wompiTransactionId) setWompiTransactionId(data.wompiTransactionId);
        }
      } catch {
        // resolve en segundo plano
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gateway, wompiIdFromUrl, refFromUrl, emailFromUrl]);

  const confirmPayment = useCallback(async (): Promise<ConfirmState> => {
    if ((ref && email) || (gateway === 'wompi' && wompiId)) {
      try {
        const syncEndpoint =
          gateway === 'wompi' ? '/api/wompi/sync-status' : '/api/payments/sync-status';
        const syncRes = await fetch(syncEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref: ref || undefined,
            email: email || undefined,
            wompiTransactionId: gateway === 'wompi' ? wompiId || undefined : undefined,
          }),
        });
        if (syncRes.ok) {
          const data = await syncRes.json();
          if (data.canRegister) return 'confirmed';
          if (data.status === 'pending' || data.status === 'in_process') return 'pending';
        }
      } catch {
        // sync-status solo en sandbox
      }
    }

    if (email) {
      try {
        const canRes = await fetch(
          `/api/payments/can-register?email=${encodeURIComponent(email)}`
        );
        if (canRes.ok) {
          const data = await canRes.json();
          if (data.canRegister) return 'confirmed';
          if (data.paymentRequired) return 'pending';
        }
      } catch {
        return 'error';
      }
    }

    return ref || email || wompiId ? 'pending' : 'confirmed';
  }, [ref, email, gateway, wompiId]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    const run = async () => {
      const state = await confirmPayment();
      if (cancelled) return;
      setConfirmState(state);

      if (state === 'pending' && attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(run, 3000);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [confirmPayment]);

  useEffect(() => {
    const countdown = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    const redirect = window.setTimeout(goHome, REDIRECT_SECONDS * 1000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirect);
    };
  }, [goHome]);

  return (
    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {confirmState === 'loading' ? (
        <LoaderPage message="Confirmando su pago..." />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">¡Pago exitoso!</h1>
          <p className="text-sm text-slate-500 mb-6">
            Su transacción fue procesada correctamente
            {gateway === 'wompi' ? ' por Wompi' : ' por Mercado Pago'}.
          </p>

          {confirmState === 'pending' && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              Estamos confirmando el pago. Revise su correo en unos momentos.
            </p>
          )}

          {confirmState === 'error' && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              No pudimos verificar el pago en este momento. Revise su correo; si no llega, contacte
              soporte.
            </p>
          )}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-left mb-4">
            <p className="text-sm text-blue-900 leading-relaxed">
              {email ? (
                <>
                  Revise su correo electrónico <strong>{email}</strong>.
                </>
              ) : (
                <>Revise su correo electrónico.</>
              )}{' '}
              Le enviamos la confirmación del plan y un enlace seguro para completar el registro de
              su institución. El enlace tiene vigencia limitada por seguridad.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-nested)] p-4 text-left mb-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              ¿Qué sigue?
            </h2>
            <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 list-decimal list-inside">
              <li>Abra el correo y complete el registro de su institución.</li>
              <li>Configure grados, cursos y docentes con el asistente inicial.</li>
              <li>Importe el listado de estudiantes desde Excel.</li>
              <li>Invite a los docentes a iniciar sesión y enviar el primer recordatorio.</li>
            </ol>
          </div>

          <p className="text-xs text-slate-400 mb-5">
            Será redirigido al inicio en {secondsLeft} segundos...
          </p>

          <Link
            href="/"
            className="inline-block w-full sm:w-auto min-h-11 px-6 py-3 font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Ir al inicio ahora
          </Link>

          {ref && <p className="mt-4 text-xs text-slate-400">Referencia: {ref}</p>}
        </>
      )}
    </div>
  );
}
