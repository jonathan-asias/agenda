'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';

function AccesoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('error') === 'no_access') {
      setError('Su cuenta no tiene permisos para este panel.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase no está configurado.');
        return;
      }

      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError('Correo o contraseña incorrectos');
        return;
      }

      const meRes = await fetch('/api/gestion-vortico/me');
      const meData = await meRes.json();

      if (!meRes.ok || !meData.authorized) {
        await signOut();
        setError(meData.error ?? 'No tiene acceso al panel de gestión interna');
        return;
      }

      router.replace(PLATFORM_ADMIN_BASE);
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Acceso restringido
        </p>
        <h1 className="text-2xl font-bold text-white mt-2">Gestión interna</h1>
        <p className="text-sm text-slate-400 mt-2 mb-8">
          Panel de operaciones Agenda Virtual. No use el login público de instituciones.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-950/50 border border-red-800 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verificando…' : 'Ingresar al panel'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GestionVorticoAccesoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          Cargando…
        </div>
      }
    >
      <AccesoContent />
    </Suspense>
  );
}
