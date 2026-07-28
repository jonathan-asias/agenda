'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResetPasswordForm from '@/components/platform-admin/ResetPasswordForm';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';
import { showError, showSuccess } from '@/lib/notifications';
import { DetailSectionsSkeleton } from '@/components/ui/PageSkeletons';

export default function InstitucionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{
    institucion: Record<string, unknown>;
    pagos: Array<Record<string, unknown>>;
    counts: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendingVerification, setResendingVerification] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gestion-vortico/instituciones/${id}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const res = await fetch(
        `/api/gestion-vortico/instituciones/${id}/resend-verification`,
        { method: 'POST' }
      );
      const payload = await res.json();
      if (!res.ok) {
        await showError('No se pudo reenviar', payload.error ?? 'Error desconocido');
        return;
      }
      await showSuccess(
        payload.alreadyConfirmed ? 'Correo ya verificado' : 'Correo reenviado',
        payload.message
      );
    } catch {
      await showError('Error', 'Error de conexión al reenviar la verificación');
    } finally {
      setResendingVerification(false);
    }
  };

  if (loading) {
    return <DetailSectionsSkeleton dark />;
  }

  if (!data?.institucion) {
    return <p className="text-red-400">Institución no encontrada</p>;
  }

  const inst = data.institucion as {
    id: number;
    nombre: string;
    email: string;
    nit: string;
    direccion_principal: string;
    nombre_contacto: string;
    telefono_contacto: string;
    push_enabled: boolean;
    created_at: string;
    plan?: { nombre: string; precio: number } | null;
    suscripcion?: {
      estado: string;
      fecha_inicio?: string | null;
      fecha_fin?: string | null;
      plan?: { nombre: string };
    } | null;
    sedes?: Array<{ id: number; nombre: string }>;
    administradores?: Array<{
      id: number;
      nombre: string;
      apellido: string;
      correo: string;
      cargo: string;
    }>;
    docentes?: Array<{
      id: number;
      nombres: string;
      apellidos: string;
      email: string;
      activo: boolean;
    }>;
  };

  return (
    <div>
      <Link href={`${PLATFORM_ADMIN_BASE}/instituciones`} className="text-sm text-violet-400 hover:text-violet-300">
        ← Instituciones
      </Link>

      <h1 className="text-2xl font-bold text-white mt-4 mb-1">{inst.nombre}</h1>
      <p className="text-slate-400 text-sm mb-8">ID {inst.id} · NIT {inst.nit}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Datos generales</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Correo" value={inst.email} />
            <Row label="Dirección" value={inst.direccion_principal} />
            <Row label="Contacto" value={`${inst.nombre_contacto} · ${inst.telefono_contacto}`} />
            <Row label="Push" value={inst.push_enabled ? 'Activo' : 'Inactivo'} />
            <Row label="Registro" value={new Date(inst.created_at).toLocaleDateString('es-CO')} />
          </dl>
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={() => void handleResendVerification()}
              disabled={resendingVerification}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-600/15 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-600/25 disabled:opacity-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {resendingVerification
                ? 'Reenviando…'
                : 'Reenviar comprobación de correo'}
            </button>
            <p className="text-[11px] text-slate-500">
              Úselo si el responsable no recibió el correo de confirmación de Supabase Auth.
            </p>
            <ResetPasswordForm
              email={inst.email}
              userType="institucion"
              label="Institución (owner)"
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Plan y suscripción</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Plan" value={inst.plan?.nombre ?? '—'} />
            <Row
              label="Precio"
              value={inst.plan?.precio != null ? `$${inst.plan.precio.toLocaleString('es-CO')}/mes` : '—'}
            />
            <Row label="Estado suscripción" value={inst.suscripcion?.estado ?? '—'} />
            <Row
              label="Vigencia"
              value={
                inst.suscripcion?.fecha_fin
                  ? new Date(inst.suscripcion.fecha_fin).toLocaleDateString('es-CO')
                  : '—'
              }
            />
          </dl>
          <h3 className="text-xs font-semibold text-slate-500 mt-4 mb-2">Conteos</h3>
          <p className="text-xs text-slate-400">
            {data.counts.estudiantes} estudiantes · {data.counts.grados} grados ·{' '}
            {data.counts.cursos} cursos · {data.counts.areas} áreas · {data.counts.materias}{' '}
            materias
          </p>
        </section>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">
          Administradores ({inst.administradores?.length ?? 0})
        </h2>
        <div className="space-y-4">
          {(inst.administradores ?? []).map((admin) => (
            <div key={admin.id} className="border-b border-slate-800 pb-4 last:border-0">
              <p className="text-white font-medium">
                {admin.nombre} {admin.apellido}
              </p>
              <p className="text-xs text-slate-500">
                {admin.correo} · {admin.cargo}
              </p>
              <ResetPasswordForm email={admin.correo} userType="administrador" label="Administrador" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">
          Docentes ({inst.docentes?.length ?? 0})
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {(inst.docentes ?? []).map((doc) => (
            <div key={doc.id} className="border-b border-slate-800 pb-4 last:border-0">
              <p className="text-white font-medium">
                {doc.nombres} {doc.apellidos}
                {!doc.activo && (
                  <span className="ml-2 text-xs text-amber-500">(inactivo)</span>
                )}
              </p>
              <p className="text-xs text-slate-500">{doc.email}</p>
              <ResetPasswordForm email={doc.email} userType="docente" label="Docente" />
            </div>
          ))}
        </div>
      </section>

      {data.pagos.length > 0 && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Últimos pagos</h2>
          <ul className="text-xs text-slate-400 space-y-2">
            {data.pagos.map((p) => (
              <li key={String(p.id)}>
                {String(p.estado)} · ${String(p.monto)} ·{' '}
                {(p.plan as { nombre?: string })?.nombre ?? 'Plan'}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-slate-500 w-32 shrink-0">{label}</dt>
      <dd className="text-slate-200">{value}</dd>
    </div>
  );
}
