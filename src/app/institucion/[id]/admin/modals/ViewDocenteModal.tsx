'use client';

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  sede: { nombre: string } | null;
  docenteAsignaciones: {
    grado: { nombre: string; nivel: string };
    curso: { nombre: string };
    materia: { nombre: string };
  }[];
}

interface ViewDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  docente: Docente | null;
}

export default function ViewDocenteModal({ isOpen, onClose, docente }: ViewDocenteModalProps) {
  if (!isOpen || !docente) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Información del Docente
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{docente.nombres}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{docente.apellidos}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{docente.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{docente.telefono}</p>
              </div>
              {docente.sede && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sede</label>
                  <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{docente.sede.nombre}</p>
                </div>
              )}
            </div>
          </div>

          {/* Asignaciones */}
          {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Asignaciones ({docente.docenteAsignaciones.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {docente.docenteAsignaciones.map((asignacion, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Grado</label>
                        <p className="text-sm text-slate-900 font-medium">
                          {asignacion.grado.nombre} - {asignacion.grado.nivel}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Curso</label>
                        <p className="text-sm text-slate-900 font-medium">{asignacion.curso.nombre}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Materia</label>
                        <p className="text-sm text-slate-900 font-medium">{asignacion.materia.nombre}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin asignaciones */}
          {(!docente.docenteAsignaciones || docente.docenteAsignaciones.length === 0) && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-slate-500">No hay asignaciones registradas</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
