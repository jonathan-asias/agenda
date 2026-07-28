'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PLATFORM_ADMIN_BASE } from '@/lib/platform-admin/constants';
import { TableRowsSkeleton } from '@/components/ui/PageSkeletons';

interface InstitucionRow {
  id: number;
  nombre: string;
  email: string;
  nit: string;
  plan: { nombre: string } | null;
  suscripcion: { estado: string } | null;
  counts: { administradores: number; docentes: number; estudiantes: number };
  created_at: string;
}

export default function InstitucionesListPage() {
  const [items, setItems] = useState<InstitucionRow[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    try {
      const params = search ? `?q=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/gestion-vortico/instituciones${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.instituciones ?? []);
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
      <h1 className="text-2xl font-bold text-white mb-2">Instituciones</h1>
      <p className="text-slate-400 text-sm mb-6">{items.length} registro(s)</p>

      <input
        type="search"
        placeholder="Buscar por nombre, correo o NIT…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
      />

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Institución</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Usuarios</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <TableRowsSkeleton rows={6} cols={6} dark />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Sin resultados
                </td>
              </tr>
            ) : (
              items.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 text-slate-500">{inst.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{inst.nombre}</p>
                    <p className="text-xs text-slate-500">{inst.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{inst.plan?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {inst.counts.administradores} adm · {inst.counts.docentes} doc ·{' '}
                    {inst.counts.estudiantes} est
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        inst.suscripcion?.estado === 'ACTIVA'
                          ? 'bg-emerald-900/40 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inst.suscripcion?.estado ?? 'Sin suscripción'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${PLATFORM_ADMIN_BASE}/instituciones/${inst.id}`}
                      className="text-violet-400 hover:text-violet-300 font-medium text-xs"
                    >
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
