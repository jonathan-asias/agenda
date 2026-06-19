'use client';

import type { Recordatorio } from '@/types/recordatorio';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ViewRecordatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordatorio: Recordatorio | null;
}

export default function ViewRecordatorioModal({
  isOpen,
  onClose,
  recordatorio
}: ViewRecordatorioModalProps) {
  if (!recordatorio) return null;

  const fechaRecordatorio = new Date(recordatorio.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const esPasado = fechaRecordatorio < hoy;
  const esHoy = fechaRecordatorio.toDateString() === hoy.toDateString();

  const tipoColors = {
    tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    examen: 'bg-red-100 text-red-800 border-red-200',
    evento: 'bg-blue-100 text-blue-800 border-blue-200',
    otro: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const tipoLabels = {
    tarea: 'Tarea',
    examen: 'Examen',
    evento: 'Evento',
    otro: 'Otro'
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Información del recordatorio" size="xl" className="max-w-3xl">
      <div className="space-y-6">
          {/* Nombre y Tipo */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">
                {recordatorio.nombre}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  tipoColors[recordatorio.tipo as keyof typeof tipoColors] || tipoColors.otro
                }`}
              >
                {tipoLabels[recordatorio.tipo as keyof typeof tipoLabels] || 'Otro'}
              </span>
              {esPasado && (
                <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-medium">
                  Pasado
                </span>
              )}
              {esHoy && (
                <span className="px-2 py-1 bg-blue-200 text-blue-700 rounded text-xs font-medium">
                  Hoy
                </span>
              )}
            </div>
          </div>

          {recordatorio.docente && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Docente</label>
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <p className="font-medium text-slate-900">
                  {recordatorio.docente.nombres} {recordatorio.docente.apellidos}
                </p>
                <p className="text-sm text-slate-600 mt-1">{recordatorio.docente.email}</p>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descripción
            </label>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
              <p className="text-slate-800 whitespace-pre-wrap">{recordatorio.descripcion}</p>
            </div>
          </div>

          {/* Modo de envío */}
          {(recordatorio.modo_envio && recordatorio.modo_envio.trim() !== '') && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Modo de envío
              </label>
              <div className="flex flex-wrap gap-2">
                {recordatorio.modo_envio.split(',').map((modo) => {
                  const m = modo.trim().toLowerCase();
                  const labels: Record<string, string> = { sms: 'SMS', whatsapp: 'WhatsApp', email: 'Email' };
                  const label = labels[m] || m;
                  const colors: Record<string, string> = {
                    sms: 'bg-slate-100 text-slate-800 border-slate-200',
                    whatsapp: 'bg-green-100 text-green-800 border-green-200',
                    email: 'bg-blue-100 text-blue-800 border-blue-200'
                  };
                  return (
                    <span
                      key={modo}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${colors[m] || 'bg-slate-100 text-slate-800 border-slate-200'}`}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fecha */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Fecha del Recordatorio
            </label>
            <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {fechaRecordatorio.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Información Académica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Área */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Área
              </label>
              <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium">{recordatorio.area.nombre}</span>
              </div>
            </div>

            {/* Materia */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Materia
              </label>
              <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-medium">{recordatorio.materia.nombre}</span>
              </div>
            </div>

            {/* Grado */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Grado
              </label>
              <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">
                  {recordatorio.grado.nombre} ({recordatorio.grado.nivel})
                </span>
              </div>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Curso
              </label>
              <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">
                  {recordatorio.curso.nombre}
                  {recordatorio.curso.jornada && ` (${recordatorio.curso.jornada})`}
                </span>
              </div>
            </div>
          </div>

          {/* Fechas de creación y modificación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordatorio.created_at && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Fecha de Creación
                </label>
                <div className="flex items-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                  <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">
                    {new Date(recordatorio.created_at).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
            {recordatorio.updated_at && recordatorio.updated_at !== recordatorio.created_at && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Última Modificación
                </label>
                <div className="flex items-center text-slate-800 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="font-medium text-green-900">
                    {new Date(recordatorio.updated_at).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Estudiantes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Estudiantes Asignados ({recordatorio.estudiantes?.length ?? 0})
            </label>
            {recordatorio.estudiantes && recordatorio.estudiantes.length > 0 ? (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {recordatorio.estudiantes.map((est, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="font-medium text-slate-900">
                            {est.estudiante.nombres} {est.estudiante.apellidos}
                          </p>
                          {est.estudiante.codigo_estudiantil && (
                            <p className="text-sm text-slate-500">
                              Código: {est.estudiante.codigo_estudiantil}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-center">
                <p className="text-slate-600">No hay estudiantes asignados a este recordatorio</p>
              </div>
            )}
          </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="primary" fullWidth onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}

