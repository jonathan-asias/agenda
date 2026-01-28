'use client';

import { useState, useEffect, useCallback } from 'react';
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
  _count?: {
    materiaGrados: number;
  };
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
    grado: { id: number; nombre: string; nivel: string };
    curso: { id: number; nombre: string };
    materia: { id: number; nombre: string; area: { id: number; nombre: string } };
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
  const [docentesState, setDocentesState] = useState<Docente[]>(docentes);
  const [estudiantesState, setEstudiantesState] = useState<Estudiante[]>(estudiantes);
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

  // Estados para filtros de estudiantes
  const [filtrosEstudiantes, setFiltrosEstudiantes] = useState({
    grado: '',
    curso: '',
    estado: '',
    acudiente: '',
    codigo: ''
  });
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);

  // Estados para filtros de docentes
  const [filtrosDocentes, setFiltrosDocentes] = useState({
    grado: '',
    curso: '',
    nombre: '',
    area: '',
    materia: ''
  });
  const [docentesFiltrados, setDocentesFiltrados] = useState<Docente[]>([]);

  useEffect(() => {
    setDocentesState(docentes);
  }, [docentes]);

  useEffect(() => {
    setEstudiantesState(estudiantes);
  }, [estudiantes]);

  const refetchDocentes = async () => {
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        console.error('Error recargando docentes');
        return;
      }
      const data = await response.json();
      setDocentesState(data?.datos?.docentes || []);
    } catch (error) {
      console.error('Error recargando docentes:', error);
    }
  };

  const refetchEstudiantes = async () => {
    try {
      const response = await fetch(`/api/instituciones/${institucionId}/dashboard`);
      if (!response.ok) {
        console.error('Error recargando estudiantes');
        return;
      }
      const data = await response.json();
      setEstudiantesState(data?.datos?.estudiantes || []);
    } catch (error) {
      console.error('Error recargando estudiantes:', error);
    }
  };

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

  const handleEditSuccess = async () => {
    await refetchDocentes();
  };

  const handleDeleteDocente = (docente: Docente) => {
    setDeletingDocente(docente);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingDocente(null);
  };

  const handleDeleteSuccess = async () => {
    await refetchDocentes();
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

  const handleEditEstudianteSuccess = async () => {
    await refetchEstudiantes();
  };

  const handleDeleteEstudiante = (estudiante: Estudiante) => {
    setDeletingEstudiante(estudiante);
    setShowDeleteEstudianteModal(true);
  };

  const handleCloseDeleteEstudianteModal = () => {
    setShowDeleteEstudianteModal(false);
    setDeletingEstudiante(null);
  };

  const handleDeleteEstudianteSuccess = async () => {
    await refetchEstudiantes();
  };

  // Función para aplicar filtros a estudiantes
  const aplicarFiltrosEstudiantes = useCallback(() => {
    let estudiantesFiltrados = [...estudiantesState];

    // Debug: Mostrar información de estudiantes y filtros
    console.log('🔍 Debug Filtros Estudiantes:');
    console.log('Filtros aplicados:', filtrosEstudiantes);
    console.log('Total estudiantes:', estudiantesState.length);
    console.log('Primer estudiante:', estudiantesState[0]);

    // Filtro por grado
    if (filtrosEstudiantes.grado) {
      console.log('🎯 Aplicando filtro por grado:', filtrosEstudiantes.grado);
      const antes = estudiantesFiltrados.length;
      estudiantesFiltrados = estudiantesFiltrados.filter(
        estudiante => {
          const gradoId = estudiante.grado_id;
          const coincide = typeof gradoId === 'number' && gradoId.toString() === filtrosEstudiantes.grado;
          console.log(`Estudiante ${estudiante.nombres}: grado_id=${gradoId}, coincide=${coincide}`);
          return coincide;
        }
      );
      console.log(`Filtro grado: ${antes} -> ${estudiantesFiltrados.length}`);
    }

    // Filtro por curso
    if (filtrosEstudiantes.curso) {
      console.log('🎯 Aplicando filtro por curso:', filtrosEstudiantes.curso);
      const antes = estudiantesFiltrados.length;
      estudiantesFiltrados = estudiantesFiltrados.filter(
        estudiante => {
          const cursoId = estudiante.curso_id;
          const coincide = typeof cursoId === 'number' && cursoId.toString() === filtrosEstudiantes.curso;
          console.log(`Estudiante ${estudiante.nombres}: curso_id=${cursoId}, coincide=${coincide}`);
          return coincide;
        }
      );
      console.log(`Filtro curso: ${antes} -> ${estudiantesFiltrados.length}`);
    }

    // Filtro por estado
    if (filtrosEstudiantes.estado) {
      const esActivo = filtrosEstudiantes.estado === 'activo';
      estudiantesFiltrados = estudiantesFiltrados.filter(
        estudiante => estudiante.activo === esActivo
      );
    }

    // Filtro por acudiente
    if (filtrosEstudiantes.acudiente) {
      estudiantesFiltrados = estudiantesFiltrados.filter(
        estudiante => 
          estudiante.nombre_acudiente.toLowerCase().includes(filtrosEstudiantes.acudiente.toLowerCase())
      );
    }

    // Filtro por código
    if (filtrosEstudiantes.codigo) {
      estudiantesFiltrados = estudiantesFiltrados.filter(
        estudiante => 
          estudiante.codigo_estudiantil.toLowerCase().includes(filtrosEstudiantes.codigo.toLowerCase())
      );
    }

    console.log('📊 Resultado final:', estudiantesFiltrados.length, 'estudiantes filtrados');
    console.log('Estudiantes filtrados:', estudiantesFiltrados);
    setEstudiantesFiltrados(estudiantesFiltrados);
  }, [estudiantesState, filtrosEstudiantes]);

  // Función para limpiar filtros
  const limpiarFiltrosEstudiantes = () => {
    setFiltrosEstudiantes({
      grado: '',
      curso: '',
      estado: '',
      acudiente: '',
      codigo: ''
    });
    setEstudiantesFiltrados([]);
  };

  // Función para aplicar filtros a docentes
  const aplicarFiltrosDocentes = useCallback(() => {
    let docentesFiltrados = [...docentesState];

    // Debug: Mostrar información de docentes y filtros
    console.log('🔍 Debug Filtros Docentes:');
    console.log('Filtros aplicados:', filtrosDocentes);
    console.log('Total docentes:', docentesState.length);

    // Filtro por grado
    if (filtrosDocentes.grado) {
      docentesFiltrados = docentesFiltrados.filter(docente => 
        docente.docenteAsignaciones.some(asignacion => 
          asignacion.grado.id.toString() === filtrosDocentes.grado
        )
      );
    }

    // Filtro por curso
    if (filtrosDocentes.curso) {
      docentesFiltrados = docentesFiltrados.filter(docente => 
        docente.docenteAsignaciones.some(asignacion => 
          asignacion.curso.id.toString() === filtrosDocentes.curso
        )
      );
    }

    // Filtro por nombre del docente
    if (filtrosDocentes.nombre) {
      docentesFiltrados = docentesFiltrados.filter(docente => 
        `${docente.nombres} ${docente.apellidos}`.toLowerCase().includes(filtrosDocentes.nombre.toLowerCase())
      );
    }

    // Filtro por área
    if (filtrosDocentes.area) {
      docentesFiltrados = docentesFiltrados.filter(docente => 
        docente.docenteAsignaciones.some(asignacion => 
          asignacion.materia.area.id.toString() === filtrosDocentes.area
        )
      );
    }

    // Filtro por materia
    if (filtrosDocentes.materia) {
      docentesFiltrados = docentesFiltrados.filter(docente => 
        docente.docenteAsignaciones.some(asignacion => 
          asignacion.materia.id.toString() === filtrosDocentes.materia
        )
      );
    }

    console.log('📊 Resultado final:', docentesFiltrados.length, 'docentes filtrados');
    setDocentesFiltrados(docentesFiltrados);
  }, [docentesState, filtrosDocentes]);

  // Función para limpiar filtros de docentes
  const limpiarFiltrosDocentes = () => {
    setFiltrosDocentes({
      grado: '',
      curso: '',
      nombre: '',
      area: '',
      materia: ''
    });
    setDocentesFiltrados([]);
  };

  // Función para manejar cambios en filtros de estudiantes
  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltrosEstudiantes(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Función para manejar cambios en filtros de docentes
  const handleFiltroDocenteChange = (campo: string, valor: string) => {
    setFiltrosDocentes(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Aplicar filtros automáticamente cuando cambien
  useEffect(() => {
    aplicarFiltrosEstudiantes();
  }, [aplicarFiltrosEstudiantes]);

  useEffect(() => {
    aplicarFiltrosDocentes();
  }, [aplicarFiltrosDocentes]);

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
          <div className="p-6 h-96 overflow-y-auto">
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
          <div className="p-6 h-96 overflow-y-auto">
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
                <div className="space-y-3">
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
          <div className="p-6 h-96 overflow-y-auto">
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
          <div className="p-6 h-96 overflow-y-auto">
            {cursos.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay cursos configurados</p>
            ) : (
              <div className="space-y-3">
                {cursos.map((curso) => (
                  <div key={curso.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{curso.nombre}</span>
                      <span className="text-sm text-slate-600">{curso.grado?.nombre || 'Sin grado'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{curso.jornada || 'Jornada única'}</span>
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
            Docentes ({docentesState.length})
          </h3>
        </div>
        
        {/* Filtros de Docentes */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Grado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grado</label>
              <select
                value={filtrosDocentes.grado}
                onChange={(e) => handleFiltroDocenteChange('grado', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todos los grados</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.id.toString()}>
                    {grado.nombre} - {grado.nivel}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Curso */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
              <select
                value={filtrosDocentes.curso}
                onChange={(e) => handleFiltroDocenteChange('curso', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todos los cursos</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id.toString()}>
                    {curso.nombre} {curso.jornada ? `(${curso.jornada})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Nombre del Docente */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={filtrosDocentes.nombre}
                onChange={(e) => handleFiltroDocenteChange('nombre', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            {/* Filtro por Área */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Área</label>
              <select
                value={filtrosDocentes.area}
                onChange={(e) => handleFiltroDocenteChange('area', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todas las áreas</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id.toString()}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Materia */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Materia</label>
              <select
                value={filtrosDocentes.materia}
                onChange={(e) => handleFiltroDocenteChange('materia', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todas las materias</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id.toString()}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={limpiarFiltrosDocentes}
              className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
        <div className="p-6 h-96 overflow-y-auto">
          {docentesState.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No hay docentes registrados</p>
          ) : (
            <>
              {/* Mensaje cuando hay filtros pero no hay resultados */}
              {docentesFiltrados.length === 0 && (filtrosDocentes.grado || filtrosDocentes.curso || filtrosDocentes.nombre || filtrosDocentes.area || filtrosDocentes.materia) ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No se encontraron docentes</h3>
                  <p className="mt-1 text-sm text-slate-500">Intenta ajustar los filtros de búsqueda</p>
                  <div className="mt-4">
                    <button
                      onClick={limpiarFiltrosDocentes}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {docentesState.some(d => !d.docenteAsignaciones || d.docenteAsignaciones.length === 0) && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        <span className="font-medium">⚠️ Nota:</span> Algunos docentes no tienen asignaciones. 
                        Los docentes deben ser asignados a grados, cursos y materias desde el Setup Wizard o el modal correspondiente.
                      </p>
                    </div>
                  )}
                  <div className="space-y-4">
                    {(docentesFiltrados.length > 0 ? docentesFiltrados : docentesState).map((docente) => (
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
            Estudiantes ({estudiantesState.length})
          </h3>
        </div>
        
        {/* Filtros de Estudiantes */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Grado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grado</label>
              <select
                value={filtrosEstudiantes.grado}
                onChange={(e) => handleFiltroChange('grado', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todos los grados</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.id.toString()}>
                    {grado.nombre} - {grado.nivel}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Curso */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
              <select
                value={filtrosEstudiantes.curso}
                onChange={(e) => handleFiltroChange('curso', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todos los cursos</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id.toString()}>
                    {curso.nombre} {curso.jornada ? `(${curso.jornada})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                value={filtrosEstudiantes.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder:text-slate-400"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>

            {/* Filtro por Acudiente */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acudiente</label>
              <input
                type="text"
                placeholder="Buscar por acudiente..."
                value={filtrosEstudiantes.acudiente}
                onChange={(e) => handleFiltroChange('acudiente', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            {/* Filtro por Código */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
              <input
                type="text"
                placeholder="Buscar por código..."
                value={filtrosEstudiantes.codigo}
                onChange={(e) => handleFiltroChange('codigo', e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={limpiarFiltrosEstudiantes}
              className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        <div className="p-6 h-96 overflow-y-auto">
          {estudiantesState.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No hay estudiantes registrados</p>
          ) : (
            <>
              {/* Mensaje cuando hay filtros pero no hay resultados */}
              {estudiantesFiltrados.length === 0 && (filtrosEstudiantes.grado || filtrosEstudiantes.curso || filtrosEstudiantes.estado || filtrosEstudiantes.acudiente || filtrosEstudiantes.codigo) ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No se encontraron estudiantes</h3>
                  <p className="mt-1 text-sm text-slate-500">Intenta ajustar los filtros de búsqueda</p>
                  <div className="mt-4">
                    <button
                      onClick={limpiarFiltrosEstudiantes}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-600 bg-pink-100 hover:bg-pink-200"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(estudiantesFiltrados.length > 0 ? estudiantesFiltrados : estudiantesState).map((estudiante) => (
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
            </>
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
