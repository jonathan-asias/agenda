'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ResetPasswordForm from '@/components/platform-admin/ResetPasswordForm';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';
import { CardListSkeleton } from '@/components/ui/PageSkeletons';

interface AdminRow {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  cargo: string;
  telefono: string;
  institucion: { id: number; nombre: string };
  sede: { id: number; nombre: string } | null;
}

export default function AdministradoresListPage() {
  const [items, setItems] = useState<AdminRow[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const params = search ? `?q=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/gestion-vortico/administradores${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.administradores ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Administradores</h1>
      <p className="text-slate-400 text-sm mb-6">{items.length} registro(s)</p>

      <input
        type="search"
        placeholder="Buscar por nombre, correo o institución…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
      />

      <div className="space-y-4">
        {loading ? (
          <CardListSkeleton count={4} dark />
        ) : items.length === 0 ? (
          <p className="text-slate-500">Sin resultados</p>
        ) : (
          items.map((admin) => (
            <div
              key={admin.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">
                    {admin.nombre} {admin.apellido}
                  </p>
                  <p className="text-sm text-slate-400">{admin.correo}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {admin.cargo} · {admin.telefono}
                  </p>
                  <Link
                    href={`${PLATFORM_ADMIN_BASE}/instituciones/${admin.institucion.id}`}
                    className="text-xs text-violet-400 hover:text-violet-300 mt-2 inline-block"
                  >
                    {admin.institucion.nombre}
                    {admin.sede ? ` · ${admin.sede.nombre}` : ''}
                  </Link>
                </div>
              </div>
              <ResetPasswordForm
                email={admin.correo}
                userType="administrador"
                label="Administrador"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
