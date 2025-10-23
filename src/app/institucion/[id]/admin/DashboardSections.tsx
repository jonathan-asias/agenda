'use client';

import { useState } from 'react';
import ViewDocenteModal from './modals/ViewDocenteModal';
import EditDocenteModal from './modals/EditDocenteModal';
import DeleteDocenteModal from './modals/DeleteDocenteModal';
import ViewEstudianteModal from './modals/ViewEstudianteModal';
import EditEstudianteModal from './modals/EditEstudianteModal';
import DeleteEstudianteModal from './modals/DeleteEstudianteModal';

interface Area {
  id: number;
  nombre: string;
  es_opcional: boolean;
  activa: boolean;
  materias: { id: number; nombre: string }[];
}

interface Materia {
  id: number;
  nombre: string;
  area: { nombre: string };
  materiaGrados: {
    grado: { nombre: string; nivel: string };
  }[];
}

interface Grado {
  id: number;
  nombre: string;
  nivel: string;
  cursos: { id: number; nombre: string; jornada: string | null }[];
  _count: { estudiantes: number };
}

interface Curso {
  id: number;
  nombre: string;
  jornada: string | null;
  grado: { nombre: string; nivel: string };
  _count: { estudiantes: number };
}

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  sede: { nombre: string } | null;
  docenteAsignaciones: {
    grado: { nombre: string };
    curso: { nombre: string };
    materia: { nombre: string };
  }[];
}

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
}

interface DashboardSectionsProps {
  areas: Area[];
  materias: Materia[];
  grados: Grado[];
  cursos: Curso[];
  docentes: Docente[];
  estudiantes: Estudiante[];
  institucionId: number;
}

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

export default function DashboardSections({
  areas,
  materias,
  grados,
  cursos,
  docentes,
  estudiantes,
  institucionId
}: DashboardSectionsProps) {
  // Estados para el modal de visualización
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null);
  
  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingDocente, setDeletingDocente] = useState<Docente | null>(null);

  // Estados para modales de estudiantes
  const [showViewEstudianteModal, setShowViewEstudianteModal] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const [showEditEstudianteModal, setShowEditEstudianteModal] = useState(false);
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
  const [showDeleteEstudianteModal, setShowDeleteEstudianteModal] = useState(false);
  const [deletingEstudiante, setDeletingEstudiante] = useState<Estudiante | null>(null);

  const handleViewDocente = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedDocente(null);
  };

  const handleEditDocente = (docente: Docente) => {
    setEditingDocente(docente);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingDocente(null);
  };

  const handleEditSuccess = () => {
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  const handleDeleteDocente = (docente: Docente) => {
    setDeletingDocente(docente);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingDocente(null);
  };

  const handleDeleteSuccess = () => {
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  // Funciones para manejar modales de estudiantes
  const handleViewEstudiante = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setShowViewEstudianteModal(true);
  };

  const handleCloseViewEstudianteModal = () => {
    setShowViewEstudianteModal(false);
    setSelectedEstudiante(null);
  };

  const handleEditEstudiante = (estudiante: Estudiante) => {
    setEditingEstudiante(estudiante);
    setShowEditEstudianteModal(true);
  };

  const handleCloseEditEstudianteModal = () => {
    setShowEditEstudianteModal(false);
    setEditingEstudiante(null);
  };

  const handleEditEstudianteSuccess = () => {
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  const handleDeleteEstudiante = (estudiante: Estudiante) => {
    setDeletingEstudiante(estudiante);
    setShowDeleteEstudianteModal(true);
  };

  const handleCloseDeleteEstudianteModal = () => {
    setShowDeleteEstudianteModal(false);
    setDeletingEstudiante(null);
  };

  const handleDeleteEstudianteSuccess = () => {
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Áreas y Materias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Áreas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Áreas ({areas.length})
            </h3>
          </div>
          <div className="p-6">
            {areas.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay áreas configuradas</p>
            ) : (
              <div className="space-y-3">
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-medium text-slate-900">{area.nombre}</span>
                      {area.es_opcional && (
                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Opcional
                        </span>
                      )}
                      {!area.activa && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-600">
                      {area.materias.length} materia{area.materias.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Materias */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Materias ({materias.length})
              {materias.some(m => !m._count?.materiaGrados || m._count.materiaGrados === 0) && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {materias.filter(m => !m._count?.materiaGrados || m._count.materiaGrados === 0).length} sin asignar
                </span>
              )}
            </h3>
          </div>
          <div className="p-6">
            {materias.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay materias configuradas</p>
            ) : (
              <>
                {materias.some(m => !m._count?.materiaGrados || m._count.materiaGrados === 0) && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <span className="font-medium">ℹ️ Nota:</span> Algunas materias no tienen grados asignados. 
                      Las materias deben ser asignadas manualmente a grados desde el Setup Wizard o el modal correspondiente.
                    </p>
                  </div>
                )}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                {materias.map((materia) => (
                  <div key={materia.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{materia.nombre}</span>
                      <span className="text-sm text-slate-600">{materia.area?.nombre || 'Sin área'}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Grados:</span> {materia._count?.materiaGrados || 0}
                      {(!materia._count?.materiaGrados || materia._count.materiaGrados === 0) && (
                        <span className="text-xs text-amber-600 ml-2">
                          (Sin asignar)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grados y Cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grados */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Grados ({grados.length})
            </h3>
          </div>
          <div className="p-6">
            {grados.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay grados configurados</p>
            ) : (
              <div className="space-y-3">
                {grados.map((grado) => (
                  <div key={grado.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{grado.nombre}</span>
                      <span className="text-sm text-slate-600">{grado.nivel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{grado.cursos?.length || 0} curso{(grado.cursos?.length || 0) !== 1 ? 's' : ''}</span>
                      <span>{grado._count?.estudiantes || 0} estudiante{(grado._count?.estudiantes || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cursos ({cursos.length})
            </h3>
          </div>
          <div className="p-6">
            {cursos.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay cursos configurados</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cursos.map((curso) => (
                  <div key={curso.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{curso.nombre}</span>
                      <span className="text-sm text-slate-600">{curso.grado?.nombre || 'Sin grado'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{curso.jornada || 'Sin jornada'}</span>
                      <span>{curso._count?.estudiantes || 0} estudiante{(curso._count?.estudiantes || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Docentes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Docentes ({docentes.length})
          </h3>
        </div>
        <div className="p-6">
          {docentes.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No hay docentes registrados</p>
          ) : (
            <>
              {docentes.some(d => !d.docenteAsignaciones || d.docenteAsignaciones.length === 0) && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <span className="font-medium">⚠️ Nota:</span> Algunos docentes no tienen asignaciones. 
                    Los docentes deben ser asignados a grados, cursos y materias desde el Setup Wizard o el modal correspondiente.
                  </p>
                </div>
              )}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {docentes.map((docente) => (
                <div key={docente.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {docente.nombres} {docente.apellidos}
                      </h4>
                      <p className="text-sm text-slate-600">{docente.email}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{docente.telefono}</p>
                      {docente.sede && <p>{docente.sede.nombre}</p>}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 mb-3">
                    <span className="font-medium">Asignaciones:</span> 
                    {docente.docenteAsignaciones && docente.docenteAsignaciones.length > 0 ? (
                      <span className="ml-1 text-green-600 font-medium">
                        {docente.docenteAsignaciones.length}
                      </span>
                    ) : (
                      <span className="ml-1 text-red-600 font-medium">
                        0 (Sin asignar)
                      </span>
                    )}
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleViewDocente(docente)}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditDocente(docente)}
                      className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteDocente(docente)}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Estudiantes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Estudiantes ({estudiantes.length})
          </h3>
        </div>
        <div className="p-6">
          {estudiantes.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No hay estudiantes registrados</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {estudiantes.map((estudiante) => (
                <div key={estudiante.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {estudiante.nombres} {estudiante.apellidos}
                      </h4>
                      <p className="text-sm text-slate-600">Código: {estudiante.codigo_estudiantil}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{estudiante.grado?.nombre || 'Sin grado'} - {estudiante.curso?.nombre || 'Sin curso'}</p>
                      {estudiante.curso?.jornada && <p>{estudiante.curso.jornada}</p>}
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleViewEstudiante(estudiante)}
                      className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditEstudiante(estudiante)}
                      className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEstudiante(estudiante)}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualización de docente */}
      <ViewDocenteModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        docente={selectedDocente}
      />

      {/* Modal de edición de docente */}
      <EditDocenteModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        docente={editingDocente}
        institucionId={institucionId}
        onSuccess={handleEditSuccess}
      />

      {/* Modal de eliminación de docente */}
      <DeleteDocenteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        docente={deletingDocente}
        onSuccess={handleDeleteSuccess}
      />

      {/* Modales de Estudiantes */}
      <ViewEstudianteModal
        isOpen={showViewEstudianteModal}
        onClose={handleCloseViewEstudianteModal}
        estudiante={selectedEstudiante}
      />

      <EditEstudianteModal
        isOpen={showEditEstudianteModal}
        onClose={handleCloseEditEstudianteModal}
        estudiante={editingEstudiante}
        institucionId={institucionId}
        onSuccess={handleEditEstudianteSuccess}
      />

      <DeleteEstudianteModal
        isOpen={showDeleteEstudianteModal}
        onClose={handleCloseDeleteEstudianteModal}
        estudiante={deletingEstudiante}
        onSuccess={handleDeleteEstudianteSuccess}
      />
    </div>
  );
}
