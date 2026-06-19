'use client';

import { useState } from 'react';
import { showError, showSuccess } from '@/lib/notifications';

interface ResetPasswordFormProps {
  email: string;
  userType: 'institucion' | 'administrador' | 'docente';
  label: string;
}

export default function ResetPasswordForm({ email, userType, label }: ResetPasswordFormProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/gestion-vortico/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        await showError('Error', data.error ?? 'No se pudo restablecer');
        return;
      }
      await showSuccess('Contraseña actualizada', data.message);
      setPassword('');
      setOpen(false);
    } catch {
      await showError('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-violet-400 hover:text-violet-300"
      >
        Restablecer contraseña
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2">
      <p className="text-xs text-slate-400">{label}: {email}</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        required
        minLength={8}
        className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
      />
      <p className="text-[10px] text-slate-500">
        Mín. 8 caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? 'Guardando…' : 'Confirmar'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
