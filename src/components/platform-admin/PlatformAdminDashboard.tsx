'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';

interface Stats {
  instituciones: number;
  administradores: number;
  docentes: number;
  estudiantes: number;
  suscripcionesActivas: number;
  pagosAprobados: number;
}

export default function PlatformAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/gestion-vortico/stats');
      if (!res.ok) throw new Error('No se pudieron cargar estadísticas');
      setStats(await res.json());
    } catch {
      setError('Error al cargar el resumen');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = stats
    ? [
        { label: 'Instituciones', value: stats.instituciones, href: `${PLATFORM_ADMIN_BASE}/instituciones` },
        { label: 'Administradores', value: stats.administradores, href: `${PLATFORM_ADMIN_BASE}/administradores` },
        { label: 'Docentes', value: stats.docentes, href: `${PLATFORM_ADMIN_BASE}/docentes` },
        { label: 'Estudiantes', value: stats.estudiantes, href: null },
        { label: 'Suscripciones activas', value: stats.suscripcionesActivas, href: null },
        { label: 'Pagos aprobados', value: stats.pagosAprobados, href: null },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Panel de gestión</h1>
      <p className="text-slate-400 text-sm mb-8">
        Vista global de la plataforma Agenda Virtual. Acceso restringido a operadores autorizados.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) =>
          card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-violet-500/40 transition-colors"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
            </Link>
          ) : (
            <div
              key={card.label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
