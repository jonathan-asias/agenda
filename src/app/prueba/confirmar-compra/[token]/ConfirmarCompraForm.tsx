'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const formInputClassName =
  'w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

export default function ConfirmarCompraForm({ token }: { token: string }) {
  const router = useRouter();
  const [referencia, setReferencia] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/payments/dev-confirm-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: referencia.trim(),
          email: email.trim().toLowerCase(),
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? 'No se pudo confirmar el pago.');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        gateway: 'wompi',
        ref: data.ref ?? referencia.trim(),
        email: data.email ?? email.trim().toLowerCase(),
      });
      router.push(`/pago-exitoso?${params.toString()}`);
    } catch {
      setError('Error de conexión. Intente de nuevo.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="dev-ref" className="block text-sm font-medium text-slate-700 mb-1">
          Referencia del comprobante *
        </label>
        <input
          id="dev-ref"
          type="text"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          placeholder="Ej: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          className={formInputClassName}
          required
          autoComplete="off"
          spellCheck={false}
        />
        <p className="mt-1 text-xs text-slate-500">
          Copie la referencia que aparece en el comprobante o en la URL de retorno de pago.
        </p>
      </div>

      <div>
        <label htmlFor="dev-email" className="block text-sm font-medium text-slate-700 mb-1">
          Correo electrónico del pago *
        </label>
        <input
          id="dev-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@institucion.edu.co"
          className={formInputClassName}
          required
          autoComplete="email"
          maxLength={254}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Confirmando...' : 'Confirmar compra'}
      </button>
    </form>
  );
}
