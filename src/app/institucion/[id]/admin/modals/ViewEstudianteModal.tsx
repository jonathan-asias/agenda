'use client';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente?: string;
  telefono_acudiente: string;
  grado: { nombre: string; nivel: string };
  curso: { nombre: string; jornada: string | null };
  activo: boolean;
  grado_id?: number | null;
  curso_id?: number | null;
}

interface ViewEstudianteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estudiante: Estudiante | null;
}

export default function ViewEstudianteModal({ 
  isOpen, 
  onClose, 
  estudiante 
}: ViewEstudianteModalProps) {
  if (!isOpen || !estudiante) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Información del Estudiante</h2>
                <p className="text-sm text-slate-600">Detalles completos del estudiante</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombres</label>
                  <p className="text-slate-900 font-medium">{estudiante.nombres}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Apellidos</label>
                  <p className="text-slate-900 font-medium">{estudiante.apellidos}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Código Estudiantil</label>
                  <p className="text-slate-900 font-medium">{estudiante.codigo_estudiantil}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Estado</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    estudiante.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {estudiante.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Información Académica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Grado</label>
                  <p className="text-slate-900 font-medium">{estudiante.grado?.nombre || 'N/A'}</p>
                  {estudiante.grado && (
                    <p className="text-xs text-slate-500">{estudiante.grado.nivel}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Curso</label>
                  <p className="text-slate-900 font-medium">{estudiante.curso?.nombre || 'N/A'}</p>
                  {estudiante.curso?.jornada && (
                    <p className="text-xs text-slate-500">Jornada: {estudiante.curso.jornada}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del Acudiente */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Información del Acudiente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre del Acudiente</label>
                  <p className="text-slate-900 font-medium">{estudiante.nombre_acudiente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Teléfono</label>
                  <p className="text-slate-900 font-medium">{estudiante.telefono_acudiente}</p>
                </div>
                {estudiante.correo_acudiente && estudiante.correo_acudiente.trim() !== '' && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Correo Electrónico</label>
                    <p className="text-slate-900 font-medium">{estudiante.correo_acudiente}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
