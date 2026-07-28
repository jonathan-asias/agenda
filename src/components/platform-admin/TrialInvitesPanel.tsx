'use client';

import { useCallback, useEffect, useState } from 'react';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';
import { TableRowsSkeleton } from '@/components/ui/PageSkeletons';
import InfoTooltip from '@/components/ui/InfoTooltip';
import {
  isValidColombianNit,
  isValidEmailAddress,
  normalizeEmailAddress,
  sanitizeColombianNitInput,
} from '@/lib/validation/institucion-fields';

interface PlanOption {
  id: number;
  nombre: string;
}

interface TrialInvite {
  id: number;
  referencia: string;
  institucion_nombre: string;
  nit: string;
  email: string;
  estado: string;
  link_expires_at: string;
  trial_days: number;
  created_by: string;
  used_at: string | null;
  created_at: string;
  plan: { id: number; nombre: string };
}

export default function TrialInvitesPanel() {
  const [invites, setInvites] = useState<TrialInvite[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);
  const [lastUrl, setLastUrl] = useState('');
  const [lastUrlLocalhost, setLastUrlLocalhost] = useState('');
  const [form, setForm] = useState({
    institucionNombre: '',
    nit: '',
    email: '',
    planId: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invitesRes, plansRes] = await Promise.all([
        fetch('/api/gestion-vortico/trial-invites'),
        fetch('/api/planes'),
      ]);
      if (invitesRes.ok) {
        const data = await invitesRes.json();
        setInvites(data.invites ?? []);
      }
      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans((data.planes ?? []).map((p: PlanOption) => ({ id: p.id, nombre: p.nombre })));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setMessageIsError(false);
    setLastUrl('');
    setLastUrlLocalhost('');

    const nit = form.nit.trim();
    const email = normalizeEmailAddress(form.email);

    if (!isValidColombianNit(nit)) {
      setMessage('El NIT debe contener exactamente 9 dígitos (sin dígito de verificación).');
      setMessageIsError(true);
      setSubmitting(false);
      return;
    }

    if (!isValidEmailAddress(email)) {
      setMessage('Ingrese un correo electrónico válido.');
      setMessageIsError(true);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/gestion-vortico/trial-invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucionNombre: form.institucionNombre.trim(),
          nit,
          email,
          planId: Number(form.planId),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? 'No se pudo crear la invitación.');
        setMessageIsError(true);
        return;
      }
      setMessage(
        data.emailSent
          ? 'Invitación creada y correo enviado al cliente.'
          : 'Invitación creada. No se pudo enviar el correo; copie el enlace manualmente.'
      );
      setMessageIsError(false);
      setLastUrl(data.registroUrl ?? '');
      setLastUrlLocalhost(data.registroUrlLocalhost ?? '');
      setForm({ institucionNombre: '', nit: '', email: '', planId: '' });
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (inviteId: number) => {
    const res = await fetch(`/api/gestion-vortico/trial-invites/${inviteId}/resend`, {
      method: 'POST',
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.emailSent ? 'Enlace reenviado por correo.' : 'Enlace regenerado.');
      setMessageIsError(false);
      setLastUrl(data.registroUrl ?? '');
      setLastUrlLocalhost(data.registroUrlLocalhost ?? '');
      await load();
    } else {
      setMessage(data.error ?? 'No se pudo reenviar.');
      setMessageIsError(true);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Invitaciones de prueba</h1>
        <p className="mt-2 text-slate-400 text-sm">
          Genere enlaces únicos de registro con vigencia de 24 horas y prueba de 30 días.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-white">Nueva invitación</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-300">Nombre de la institución</span>
            <input
              required
              value={form.institucionNombre}
              onChange={(e) => setForm((prev) => ({ ...prev, institucionNombre: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              NIT (9 dígitos)
              <InfoTooltip
                label="Información sobre el NIT"
                placement="left"
                size="sm"
                panelVariant="dark"
                triggerVariant="muted"
              >
                Sin dígito de verificación. Solo los 9 primeros dígitos.
              </InfoTooltip>
            </span>
            <input
              required
              inputMode="numeric"
              autoComplete="off"
              minLength={9}
              maxLength={9}
              pattern="\d{9}"
              title="El NIT debe tener exactamente 9 dígitos numéricos"
              value={form.nit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nit: sanitizeColombianNitInput(e.target.value) }))
              }
              className={`mt-1 w-full rounded-lg border bg-slate-950 px-3 py-2 text-white ${
                form.nit && !isValidColombianNit(form.nit)
                  ? 'border-red-500'
                  : 'border-slate-700'
              }`}
              placeholder="123456789"
            />
            {form.nit && !isValidColombianNit(form.nit) && (
              <p className="mt-1 text-xs text-red-400">
                El NIT debe contener exactamente 9 dígitos numéricos.
              </p>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Correo del responsable</span>
            <input
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              onBlur={(e) =>
                setForm((prev) => ({ ...prev, email: normalizeEmailAddress(e.target.value) }))
              }
              className={`mt-1 w-full rounded-lg border bg-slate-950 px-3 py-2 text-white ${
                form.email && !isValidEmailAddress(form.email)
                  ? 'border-red-500'
                  : 'border-slate-700'
              }`}
              placeholder="correo@ejemplo.com"
            />
            {form.email && !isValidEmailAddress(form.email) && (
              <p className="mt-1 text-xs text-red-400">Ingrese un correo electrónico válido.</p>
            )}
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Plan de prueba</span>
            <select
              required
              value={form.planId}
              onChange={(e) => setForm((prev) => ({ ...prev, planId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            >
              <option value="">Seleccionar plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={
            submitting ||
            !isValidColombianNit(form.nit) ||
            !isValidEmailAddress(form.email) ||
            !form.institucionNombre.trim() ||
            !form.planId
          }
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {submitting ? 'Generando…' : 'Generar enlace y enviar correo'}
        </button>
        {message && (
          <p className={`text-sm ${messageIsError ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        )}
        {lastUrl && (
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 break-all space-y-3">
            <div>
              <p className="font-medium text-white mb-1">Enlace público (APP_URL)</p>
              {lastUrl}
            </div>
            {lastUrlLocalhost && (
              <div>
                <p className="font-medium text-emerald-300 mb-1">
                  Enlace localhost (recomendado en desarrollo)
                </p>
                <p className="text-xs text-slate-400 mb-1">
                  Use este si el enlace del túnel devtunnels devuelve 404.
                </p>
                {lastUrlLocalhost}
              </div>
            )}
          </div>
        )}
      </form>

      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="font-semibold text-white">Invitaciones recientes</h2>
        </div>
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Institución</th>
                  <th className="px-4 py-3 text-left">Correo</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Vence enlace</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <TableRowsSkeleton rows={5} cols={6} dark />
              </tbody>
            </table>
          </div>
        ) : invites.length === 0 ? (
          <p className="p-4 text-slate-400 text-sm">No hay invitaciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Institución</th>
                  <th className="px-4 py-3 text-left">Correo</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Vence enlace</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id} className="border-t border-slate-800 text-slate-300">
                    <td className="px-4 py-3">{invite.institucion_nombre}</td>
                    <td className="px-4 py-3">{invite.email}</td>
                    <td className="px-4 py-3">{invite.plan.nombre}</td>
                    <td className="px-4 py-3">{invite.estado}</td>
                    <td className="px-4 py-3">
                      {new Date(invite.link_expires_at).toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3">
                      {invite.estado === 'PENDIENTE' && (
                        <button
                          type="button"
                          onClick={() => handleResend(invite.id)}
                          className="text-violet-400 hover:text-violet-300"
                        >
                          Reenviar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Panel interno ·{' '}
        <a href={PLATFORM_ADMIN_BASE} className="text-violet-400 hover:underline">
          Volver al resumen
        </a>
      </p>
    </div>
  );
}
