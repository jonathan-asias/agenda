'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PhoneInput, { isValidPhoneNumber, getCountries } from 'react-phone-number-input';
import es from 'react-phone-number-input/locale/es.json';
import 'react-phone-number-input/style.css';

const COUNTRY_OPTIONS_ORDER: ReturnType<typeof getCountries> = [...getCountries()].sort(
  (a, b) => (es[a as keyof typeof es] as string || a).localeCompare((es[b as keyof typeof es] as string) || b, 'es')
);

const isPhoneValidDocente = (phone: string) => !!phone && isValidPhoneNumber(phone);

interface SetupWizardProps {
  institucionId: number;
  onClose: () => void;
}

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

interface Curso {
  id: string;
  nombre: string;
  gradoId: number;
}

interface Materia {
  id: string;
  nombre: string;
  areaId: number;
}

interface MateriaCurso {
  materiaId: string;
  gradoId: number;
}

interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  sede_id?: number;
  activo: boolean;
}

interface DocenteForm {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente: string;
  telefono_acudiente: string;
  grado_id: number;
  curso_id: number;
  institucion_id: number;
  activo: boolean;
}

interface EstudianteForm {
  nombres: string;
  apellidos: string;
  codigo_estudiantil: string;
  nombre_acudiente: string;
  correo_acudiente: string;
  telefono_acudiente: string;
  grado_id: number;
  curso_id: number;
}

interface AsignacionDocente {
  docenteId: number;
  materiaId: number;
  gradoId: number;
  cursoId: number;
}

export default function SetupWizard({ institucionId, onClose }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [brandingColors, setBrandingColors] = useState({
    primary: '#2563eb',
    secondary: '#0f172a'
  });
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoParaEliminar, setCursoParaEliminar] = useState<{
    cursoId: number;
    gradoId: number;
    nombre: string;
  } | null>(null);
  const [eliminandoCurso, setEliminandoCurso] = useState(false);
  const [duplicadosCursos, setDuplicadosCursos] = useState<string[] | null>(null);
  const [mostrarExitoGradosCursos, setMostrarExitoGradosCursos] = useState<{
    gradosCreados: number;
    cursosCreados: number;
  } | null>(null);
  const [mostrarExitoAreasMaterias, setMostrarExitoAreasMaterias] = useState<{
    areasCreadas: number;
    materiasCreadas: number;
  } | null>(null);
  const [modalEmailDocente, setModalEmailDocente] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [modalDocenteAccion, setModalDocenteAccion] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [modalEstudianteAccion, setModalEstudianteAccion] = useState<{
    tipo: 'success' | 'error' | 'info';
    titulo: string;
    mensaje: string;
  } | null>(null);
  const [estudianteParaEliminar, setEstudianteParaEliminar] = useState<{
    estudianteId: number;
    nombre: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Estados para áreas y materias
  const [areasActivas, setAreasActivas] = useState<number[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiasPorCurso, setMateriasPorCurso] = useState<MateriaCurso[]>([]);
  
  // Estados para docentes
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [docenteActual, setDocenteActual] = useState<DocenteForm>({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: ''
  });
  
  // Estados para estudiantes
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteActual, setEstudianteActual] = useState<EstudianteForm>({
    nombres: '',
    apellidos: '',
    codigo_estudiantil: '',
    nombre_acudiente: '',
    correo_acudiente: '',
    telefono_acudiente: '',
    grado_id: 0,
    curso_id: 0
  });
  
  // Estados para grados y cursos
  const [gradosDisponibles, setGradosDisponibles] = useState<any[]>([]);
  const [cursosDisponibles, setCursosDisponibles] = useState<any[]>([]);
  const [todosLosCursos, setTodosLosCursos] = useState<any[]>([]); // Para mantener todos los cursos cargados
  const [cargandoGrados, setCargandoGrados] = useState(false);
  const [cargandoCursos, setCargandoCursos] = useState(false);
  const [asignacionesDocente, setAsignacionesDocente] = useState<AsignacionDocente[]>([]);
  const [asignacionesPorDocente, setAsignacionesPorDocente] = useState<{[key: number]: {
    asignaciones: {
      gradoId: number;
      cursoId: number;
      gradoNombre: string;
      cursoNombre: string;
      materiasSeleccionadas: number[];
    }[]
  }}>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  // Estados para asignaciones del docente actual (nueva estructura)
  const [asignacionesGradoCurso, setAsignacionesGradoCurso] = useState<{
    gradoId: number;
    cursoId: number;
    gradoNombre: string;
    cursoNombre: string;
    materiasSeleccionadas: number[];
  }[]>([]);
  
  // Estado para controlar qué docentes tienen las asignaciones expandidas
  const [asignacionesExpandidas, setAsignacionesExpandidas] = useState<{[docenteId: number]: boolean}>({});
  
  // Estado para el modal de confirmación de guardado
  const [mostrarConfirmacionGuardado, setMostrarConfirmacionGuardado] = useState(false);
  
  // Estados legacy (se mantienen temporalmente para compatibilidad)
  const [gradosSeleccionados, setGradosSeleccionados] = useState<number[]>([]);
  const [cursosPorGrado, setCursosPorGrado] = useState<{[gradoId: number]: number[]}>({});
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<number[]>([]);
  const [materiasPorArea, setMateriasPorArea] = useState<{[areaId: number]: number[]}>({});
  
  // Estados para cargar datos desde la base de datos
  const [areasCargadas, setAreasCargadas] = useState<any[]>([]);
  const [materiasCargadas, setMateriasCargadas] = useState<any[]>([]);
  const [materiasGradosCargados, setMateriasGradosCargados] = useState<any[]>([]);
  const [cargandoAreasMaterias, setCargandoAreasMaterias] = useState(false);
  
  // Estados para filtrado inteligente
  const [materiasFiltradas, setMateriasFiltradas] = useState<any[]>([]);
  const [materiasPorGrado, setMateriasPorGrado] = useState<{[gradoId: number]: any[]}>({});
  
  // Estados para control del acordeón
  const [seccionActiva, setSeccionActiva] = useState<string>('datos');
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<{[key: string]: boolean}>({
    datos: false,
    grados: false,
    materias: false
  });
  const [seccionesHabilitadas, setSeccionesHabilitadas] = useState<{[key: string]: boolean}>({
    datos: true,
    grados: false,
    materias: false
  });
  const [erroresValidacion, setErroresValidacion] = useState<{[key: string]: string}>({});
  const [camposHabilitados, setCamposHabilitados] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });
  const [camposValidados, setCamposValidados] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    telefono: false,
    email: false,
    password: false
  });
  
  // Estados de validación para estudiantes
  const [erroresValidacionEstudiante, setErroresValidacionEstudiante] = useState<{[key: string]: string}>({});
  const [camposHabilitadosEstudiante, setCamposHabilitadosEstudiante] = useState<{[key: string]: boolean}>({
    nombres: true,
    apellidos: false,
    codigo_estudiantil: false,
    nombre_acudiente: false,
    correo_acudiente: false,
    telefono_acudiente: false,
    grado_id: false,
    curso_id: false
  });
  const [camposValidadosEstudiante, setCamposValidadosEstudiante] = useState<{[key: string]: boolean}>({
    nombres: false,
    apellidos: false,
    codigo_estudiantil: false,
    nombre_acudiente: false,
    correo_acudiente: false,
    telefono_acudiente: false,
    grado_id: false,
    curso_id: false
  });
  const [verificandoEmail, setVerificandoEmail] = useState(false);
  const [emailVerificado, setEmailVerificado] = useState(false);

  // Función para determinar si los botones de contraseña deben estar habilitados
  const botonesPasswordHabilitados = () => {
    return camposValidados.email && !erroresValidacion.email && !verificandoEmail && emailVerificado;
  };

  // Función para verificar si el campo de contraseña debe estar habilitado
  const campoPasswordHabilitado = () => {
    return camposValidados.email && !erroresValidacion.email && !verificandoEmail && emailVerificado;
  };
  
  // Estados para resumen y confirmación
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarResumenAreas, setMostrarResumenAreas] = useState(false);
  const [gradosGuardados, setGradosGuardados] = useState<any[]>([]);
  const [cursosGuardados, setCursosGuardados] = useState<any[]>([]);
  const [gradosCargados, setGradosCargados] = useState<any[]>([]);

  // Grados predeterminados
  const gradosPredeterminados = [
    { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
    { id: 2, nombre: 'PRE-JARDÍN', nivel: 'Educación Inicial', orden: 2 },
    { id: 3, nombre: 'JARDÍN', nivel: 'Educación Inicial', orden: 3 },
    { id: 4, nombre: 'TRANSICIÓN', nivel: 'Educación Inicial', orden: 4 },
    { id: 5, nombre: '1°', nivel: 'Primaria', orden: 5 },
    { id: 6, nombre: '2°', nivel: 'Primaria', orden: 6 },
    { id: 7, nombre: '3°', nivel: 'Primaria', orden: 7 },
    { id: 8, nombre: '4°', nivel: 'Primaria', orden: 8 },
    { id: 9, nombre: '5°', nivel: 'Primaria', orden: 9 },
    { id: 10, nombre: '6°', nivel: 'Secundaria', orden: 10 },
    { id: 11, nombre: '7°', nivel: 'Secundaria', orden: 11 },
    { id: 12, nombre: '8°', nivel: 'Secundaria', orden: 12 },
    { id: 13, nombre: '9°', nivel: 'Secundaria', orden: 13 },
    { id: 14, nombre: '10°', nivel: 'Media', orden: 14 },
    { id: 15, nombre: '11°', nivel: 'Media', orden: 15 }
  ];

  // Áreas predefinidas según Ley 115 de 1994
  const areasPredeterminadas = [
    { id: 1, nombre: 'Ciencias naturales y educación ambiental', es_opcional: false, orden: 1 },
    { id: 2, nombre: 'Ciencias sociales, historia, geografía, constitución política y democracia', es_opcional: false, orden: 2 },
    { id: 3, nombre: 'Educación artística y cultural', es_opcional: false, orden: 3 },
    { id: 4, nombre: 'Educación ética y en valores humanos', es_opcional: false, orden: 4 },
    { id: 5, nombre: 'Educación física, recreación y deportes', es_opcional: false, orden: 5 },
    { id: 6, nombre: 'Educación religiosa', es_opcional: false, orden: 6 },
    { id: 7, nombre: 'Humanidades, lengua castellana e idiomas extranjeros', es_opcional: false, orden: 7 },
    { id: 8, nombre: 'Matemáticas', es_opcional: false, orden: 8 },
    { id: 9, nombre: 'Tecnología e informática', es_opcional: false, orden: 9 },
    { id: 10, nombre: 'Filosofía', es_opcional: true, orden: 10 },
    { id: 11, nombre: 'Educación sexual', es_opcional: true, orden: 11 },
    { id: 12, nombre: 'Cátedras y emprendimiento', es_opcional: true, orden: 12 },
    { id: 13, nombre: 'Comportamiento y disciplina', es_opcional: true, orden: 13 },
  ];

  const ejemplosMateriasPorArea: Record<number, string[]> = {
    1: ['Biología', 'Física', 'Química', 'Ciencias ambientales'],
    2: ['Historia', 'Geografía', 'Ciencias sociales', 'Democracia'],
    3: ['Artes plásticas', 'Música', 'Teatro', 'Danza'],
    4: ['Ética', 'Valores', 'Convivencia', 'Ciudadanía'],
    5: ['Educación física', 'Deportes', 'Recreación', 'Psicomotricidad'],
    6: ['Religión', 'Ética religiosa', 'Cultura religiosa', 'Espiritualidad'],
    7: ['Lengua castellana', 'Inglés', 'Lectura crítica', 'Literatura'],
    8: ['Álgebra', 'Cálculo', 'Matemáticas básicas', 'Geometría'],
    9: ['Informática', 'Programación', 'Robótica', 'Tecnología'],
    10: ['Lógica', 'Filosofía', 'Pensamiento crítico', 'Ética filosófica'],
    11: ['Educación sexual', 'Salud sexual', 'Autocuidado', 'Afectividad'],
    12: ['Emprendimiento', 'Finanzas básicas', 'Proyectos', 'Innovación'],
    13: ['Disciplina', 'Convivencia', 'Normas', 'Comportamiento']
  };

  // Agrupar grados por nivel
  const gradosPorNivel = gradosPredeterminados.reduce((acc, grado) => {
    if (!acc[grado.nivel]) {
      acc[grado.nivel] = [];
    }
    acc[grado.nivel].push(grado);
    return acc;
  }, {} as Record<string, typeof gradosPredeterminados>);

  const agregarCurso = (gradoId: number) => {
    const nuevoCurso: Curso = {
      id: `temp-${Date.now()}`,
      nombre: '',
      gradoId,
    };

    setCursos([...cursos, nuevoCurso]);
  };

  const eliminarCurso = (cursoId: string) => {
    setCursos(cursos.filter(c => c.id !== cursoId));
  };

  const editarNombreCurso = (cursoId: string, nuevoNombre: string) => {
    setCursos(cursos.map(c => c.id === cursoId ? { ...c, nombre: nuevoNombre } : c));
  };

  const eliminarCursoGuardado = async (cursoId: number, gradoId: number) => {
    try {
      const response = await fetch(`/api/cursos/${cursoId}?institucionId=${institucionId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data?.error || 'No se pudo eliminar el curso'
        });
        return;
      }

      setGradosCargados(prev =>
        prev.map((grado: any) =>
          grado.id === gradoId
            ? { ...grado, cursos: grado.cursos.filter((c: any) => c.id !== cursoId) }
            : grado
        )
      );
      setCursosDisponibles(prev => prev.filter((curso: any) => curso.id !== cursoId));
      setTodosLosCursos(prev => prev.filter((curso: any) => curso.id !== cursoId));
      setAsignacionesGradoCurso(prev => prev.filter(asignacion => asignacion.cursoId !== cursoId));
      setEstudianteActual(prev => (prev.curso_id === cursoId ? { ...prev, curso_id: 0 } : prev));
    } catch (error) {
      console.error('Error eliminando curso:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Error de conexión al eliminar el curso'
      });
    }
  };

  // Función para cargar grados desde la BD
  const cargarGrados = async () => {
    setCargandoGrados(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGradosCargados(data.grados);
        console.log('Grados cargados:', data.grados);
      } else {
        console.error('Error cargando grados');
      }
    } catch (error) {
      console.error('Error cargando grados:', error);
    } finally {
      setCargandoGrados(false);
    }
  };

  // Función para cargar grados para estudiantes
  const cargarGradosEstudiantes = async () => {
    setCargandoGrados(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        setGradosDisponibles(data.grados);
        console.log('Grados disponibles para estudiantes:', data.grados);
      } else {
        console.error('Error cargando grados para estudiantes');
      }
    } catch (error) {
      console.error('Error cargando grados para estudiantes:', error);
    } finally {
      setCargandoGrados(false);
    }
  };

  // Función para cargar cursos según el grado seleccionado
  const cargarCursosPorGrado = async (gradoId: number) => {
    setCargandoCursos(true);
    try {
      const response = await fetch(`/api/setup/grados/${institucionId}`);
      if (response.ok) {
        const data = await response.json();
        const grados = data.grados;
        const gradoSeleccionado = grados.find((g: any) => g.id === gradoId);
        if (gradoSeleccionado && gradoSeleccionado.cursos) {
          setCursosDisponibles(gradoSeleccionado.cursos);
          // Agregar estos cursos a la lista de todos los cursos si no existen
          setTodosLosCursos(prev => {
            const cursosExistentes = prev.map(c => c.id);
            const nuevosCursos = gradoSeleccionado.cursos.filter((curso: any) => !cursosExistentes.includes(curso.id));
            return [...prev, ...nuevosCursos];
          });
          console.log('Cursos disponibles para grado', gradoId, ':', gradoSeleccionado.cursos);
        } else {
          setCursosDisponibles([]);
          console.log('No hay cursos disponibles para el grado seleccionado');
        }
      } else {
        console.error('Error cargando cursos');
        setCursosDisponibles([]);
      }
    } catch (error) {
      console.error('Error cargando cursos:', error);
      setCursosDisponibles([]);
    } finally {
      setCargandoCursos(false);
    }
  };

  // Función para cargar áreas y materias desde la base de datos
  const cargarAreasMaterias = async () => {
    setCargandoAreasMaterias(true);
    try {
      // Cargar áreas
      const responseAreas = await fetch(`/api/setup/areas/${institucionId}`);
      if (responseAreas.ok) {
        const dataAreas = await responseAreas.json();
        setAreasCargadas(dataAreas.areas || []);
        console.log('Áreas cargadas:', dataAreas.areas);
      }

      // Cargar materias
      const responseMaterias = await fetch(`/api/setup/materias/${institucionId}`);
      if (responseMaterias.ok) {
        const dataMaterias = await responseMaterias.json();
        setMateriasCargadas(dataMaterias.materias || []);
        console.log('Materias cargadas:', dataMaterias.materias);
      }

      // Cargar materias-grados
      const responseMateriasGrados = await fetch(`/api/setup/materias-grados/${institucionId}`);
      if (responseMateriasGrados.ok) {
        const dataMateriasGrados = await responseMateriasGrados.json();
        console.log('=== MATERIAS-GRADOS CARGADOS ===');
        console.log('Respuesta completa:', dataMateriasGrados);
        console.log('Materias-grados:', dataMateriasGrados.materiasGrados);
        setMateriasGradosCargados(dataMateriasGrados.materiasGrados || []);
      } else {
        console.error('Error cargando materias-grados:', responseMateriasGrados.status, responseMateriasGrados.statusText);
      }
    } catch (error) {
      console.error('Error cargando áreas y materias:', error);
    } finally {
      setCargandoAreasMaterias(false);
    }
  };

  // Función para guardar áreas y materias
  // Función para generar contraseña aleatoria
  const generarPassword = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setDocenteActual(prev => ({ ...prev, password }));
  };

  // Función para limpiar formulario de docente
  // Función helper para obtener datos de materia y área por ID
  const obtenerDatosMateriaYArea = (materiaId: number) => {
    console.log(`🔍 Buscando materia ID: ${materiaId}`);
    
    // Buscar materia en materiasCargadas
    const materia = materiasCargadas.find(m => m.id === materiaId);
    console.log(`📚 Materia encontrada:`, materia);
    
    if (!materia) {
      console.log(`❌ Materia no encontrada para ID: ${materiaId}`);
      return { materiaNombre: `Materia ID: ${materiaId}`, areaNombre: 'Sin área' };
    }
    
    // Usar area_id en lugar de areaId (snake_case vs camelCase)
    const areaId = materia.area_id || materia.areaId;
    console.log(`🏫 Área ID de la materia: ${areaId} (tipo: ${typeof areaId})`);
    console.log(`📋 Áreas disponibles:`, areasCargadas.map(a => ({ id: a.id, nombre: a.nombre })));
    
    // Validar que areaId existe
    if (!areaId) {
      console.log(`❌ area_id/areaId es undefined/null:`, { area_id: materia.area_id, areaId: materia.areaId });
      return {
        materiaNombre: materia.nombre || `Materia ID: ${materiaId}`,
        areaNombre: 'Sin área (area_id undefined)'
      };
    }
    
    // Buscar área en areasCargadas usando areaId (con comparación flexible)
    let area = areasCargadas.find(a => a.id === areaId);
    
    // Si no se encuentra, intentar con conversión de tipos
    if (!area) {
      console.log(`⚠️ No se encontró con comparación exacta, intentando conversión de tipos...`);
      area = areasCargadas.find(a => a.id == areaId); // Comparación flexible
    }
    
    // Si aún no se encuentra, intentar con toString() (solo si ambos valores existen)
    if (!area && areaId != null) {
      console.log(`⚠️ Intentando con toString()...`);
      area = areasCargadas.find(a => a && a.id != null && a.id.toString() === areaId.toString());
    }
    
    console.log(`🎯 Área encontrada:`, area);
    
    if (!area) {
      console.log(`❌ Área no encontrada para ID: ${areaId}`);
      console.log(`🔍 IDs de áreas disponibles:`, areasCargadas.map(a => a.id));
      console.log(`🔍 Tipos de IDs:`, areasCargadas.map(a => ({ id: a.id, tipo: typeof a.id })));
    }
    
    return {
      materiaNombre: materia.nombre || `Materia ID: ${materiaId}`,
      areaNombre: area?.nombre || 'Sin área'
    };
  };

  const limpiarFormularioDocente = () => {
    setDocenteActual({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setAsignacionesDocente([]);
    setErroresValidacion({});
    setCamposHabilitados({
      nombres: true,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setCamposValidados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setVerificandoEmail(false);
    setEmailVerificado(false);
    
    // Limpiar selecciones de asignación (nueva estructura)
    setAsignacionesGradoCurso([]);
    
    // Limpiar selecciones de asignación (estructura legacy)
    setGradosSeleccionados([]);
    setCursosPorGrado({});
    setAreasSeleccionadas([]);
    setMateriasPorArea({});
    setMateriasFiltradas([]);
    setMateriasPorGrado({});
    
    // Limpiar estado de expansión
    setAsignacionesExpandidas({});
    setSeccionActiva('datos');
    setSeccionesCompletadas({
      datos: false,
      grados: false,
      materias: false
    });
    setSeccionesHabilitadas({
      datos: true,
      grados: false,
      materias: false
    });
  };

  const limpiarFormularioEstudiante = () => {
    setEstudianteActual({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: 0,
      curso_id: 0
    });
    setErroresValidacionEstudiante({});
    setCamposHabilitadosEstudiante({
      nombres: true,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCamposValidadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCursosDisponibles([]);
    // No limpiar todosLosCursos para mantener la referencia a los cursos ya cargados
    
    console.log('🧹 Formulario de estudiante limpiado');
  };

  // Función para limpiar todos los datos en caché al finalizar la configuración
  const limpiarDatosCompletos = () => {
    console.log('🧹 Limpiando todos los datos en caché...');
    
    // Limpiar datos de docentes
    setDocentes([]);
    setDocenteActual({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setAsignacionesDocente([]);
    setAsignacionesPorDocente({});
    
    // Limpiar datos de estudiantes
    setEstudiantes([]);
    setEstudianteActual({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: 0,
      curso_id: 0
    });
    setGradosDisponibles([]);
    setCursosDisponibles([]);
    setTodosLosCursos([]);
    
    // Limpiar datos de materias y grados
    setMaterias([]);
    setMateriasGradosCargados([]);
    setGradosGuardados([]);
    setCursosGuardados([]);
    setGradosCargados([]);
    
    // Limpiar estados de validación
    setErroresValidacion({
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: ''
    });
    setCamposHabilitados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    setCamposValidados({
      nombres: false,
      apellidos: false,
      telefono: false,
      email: false,
      password: false
    });
    
    setErroresValidacionEstudiante({
      nombres: '',
      apellidos: '',
      codigo_estudiantil: '',
      nombre_acudiente: '',
      correo_acudiente: '',
      telefono_acudiente: '',
      grado_id: '',
      curso_id: ''
    });
    setCamposHabilitadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    setCamposValidadosEstudiante({
      nombres: false,
      apellidos: false,
      codigo_estudiantil: false,
      nombre_acudiente: false,
      correo_acudiente: false,
      telefono_acudiente: false,
      grado_id: false,
      curso_id: false
    });
    
    // Limpiar estados de carga
    setCargandoGrados(false);
    setCargandoCursos(false);
    setCargandoAreasMaterias(false);
    
    // Limpiar estados de resumen
    setMostrarResumen(false);
    setMostrarResumenAreas(false);
    
    // Resetear al paso inicial
    setCurrentStep(1);
    
    console.log('✅ Todos los datos en caché han sido limpiados');
  };

  // Función para verificar si el email ya existe en Supabase Auth
  const verificarEmailExistente = async (email: string) => {
    if (!email.trim() || !validarEmail(email.trim())) {
      return false;
    }

    setVerificandoEmail(true);
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para manejar selección de grados
  const handleGradoSeleccionado = (gradoId: number, seleccionado: boolean) => {
    if (seleccionado) {
      setGradosSeleccionados(prev => [...prev, gradoId]);
      // Inicializar cursos vacíos para este grado
      setCursosPorGrado(prev => ({ ...prev, [gradoId]: [] }));
    } else {
      setGradosSeleccionados(prev => prev.filter(id => id !== gradoId));
      // Limpiar cursos de este grado
      setCursosPorGrado(prev => {
        const nuevo = { ...prev };
        delete nuevo[gradoId];
        return nuevo;
      });
    }
  };

  // Función para manejar selección de cursos por grado
  const handleCursoSeleccionado = (gradoId: number, cursoId: number, seleccionado: boolean) => {
    setCursosPorGrado(prev => {
      const cursosActuales = prev[gradoId] || [];
      if (seleccionado) {
        return { ...prev, [gradoId]: [...cursosActuales, cursoId] };
      } else {
        return { ...prev, [gradoId]: cursosActuales.filter(id => id !== cursoId) };
      }
    });
  };

  // Función para manejar selección de áreas
  const handleAreaSeleccionada = (areaId: number, seleccionada: boolean) => {
    if (seleccionada) {
      setAreasSeleccionadas(prev => [...prev, areaId]);
      // Inicializar materias vacías para esta área
      setMateriasPorArea(prev => ({ ...prev, [areaId]: [] }));
    } else {
      setAreasSeleccionadas(prev => prev.filter(id => id !== areaId));
      // Limpiar materias de esta área
      setMateriasPorArea(prev => {
        const nuevo = { ...prev };
        delete nuevo[areaId];
        return nuevo;
      });
    }
  };

  // Funciones para el nuevo flujo de asignación grado-curso-materia
  
  // Agregar grado-curso a las asignaciones
  const agregarGradoCurso = (gradoId: number, cursoId: number) => {
    const grado = gradosCargados.find(g => g.id === gradoId);
    const curso = grado?.cursos?.find((c: any) => c.id === cursoId);
    
    if (grado && curso) {
      // Verificar si ya existe esta combinación
      const existe = asignacionesGradoCurso.some(a => a.gradoId === gradoId && a.cursoId === cursoId);
      
      if (!existe) {
        setAsignacionesGradoCurso(prev => [...prev, {
          gradoId,
          cursoId,
          gradoNombre: grado.nombre,
          cursoNombre: curso.nombre,
          materiasSeleccionadas: []
        }]);
      }
    }
  };
  
  // Eliminar grado-curso de las asignaciones
  const eliminarGradoCurso = (gradoId: number, cursoId: number) => {
    setAsignacionesGradoCurso(prev => 
      prev.filter(a => !(a.gradoId === gradoId && a.cursoId === cursoId))
    );
  };
  
  // Manejar selección de materias para un grado-curso específico
  const handleMateriaGradoCurso = (gradoId: number, cursoId: number, materiaId: number, seleccionada: boolean) => {
    setAsignacionesGradoCurso(prev => 
      prev.map(asignacion => {
        if (asignacion.gradoId === gradoId && asignacion.cursoId === cursoId) {
          return {
            ...asignacion,
            materiasSeleccionadas: seleccionada
              ? [...asignacion.materiasSeleccionadas, materiaId]
              : asignacion.materiasSeleccionadas.filter(id => id !== materiaId)
          };
        }
        return asignacion;
      })
    );
  };

  // Función legacy para manejar selección de materias por grado
  const handleMateriaSeleccionada = (gradoId: number, materiaId: number, seleccionada: boolean) => {
    setMateriasPorArea(prev => {
      const materiasActuales = prev[gradoId] || [];
      if (seleccionada) {
        return { ...prev, [gradoId]: [...materiasActuales, materiaId] };
      } else {
        return { ...prev, [gradoId]: materiasActuales.filter(id => id !== materiaId) };
      }
    });
  };

  // Función para validar si una sección está completa
  const validarSeccion = (seccion: string) => {
    switch (seccion) {
      case 'datos':
        return (
          docenteActual.nombres.trim() !== '' &&
          docenteActual.apellidos.trim() !== '' &&
          docenteActual.telefono.trim() !== '' &&
          docenteActual.email.trim() !== '' &&
          docenteActual.password.trim() !== '' &&
          emailVerificado &&
          Object.keys(erroresValidacion).length === 0
        );
      case 'grados':
        // Debe haber al menos una asignación grado-curso
        return asignacionesGradoCurso.length > 0;
      case 'materias':
        // Debe haber al menos una materia seleccionada en alguna asignación grado-curso
        return asignacionesGradoCurso.some(asignacion => asignacion.materiasSeleccionadas.length > 0);
      default:
        return false;
    }
  };

  // Función para actualizar el estado de las secciones
  const actualizarEstadoSecciones = () => {
    const nuevasCompletadas = { ...seccionesCompletadas };
    const nuevasHabilitadas = { ...seccionesHabilitadas };

    // Validar sección de datos
    nuevasCompletadas.datos = validarSeccion('datos');
    if (nuevasCompletadas.datos) {
      nuevasHabilitadas.grados = true;
    }

    // Validar sección de grados
    nuevasCompletadas.grados = validarSeccion('grados');
    if (nuevasCompletadas.grados) {
      nuevasHabilitadas.materias = true;
    }

    // Validar sección de materias
    nuevasCompletadas.materias = validarSeccion('materias');

    setSeccionesCompletadas(nuevasCompletadas);
    setSeccionesHabilitadas(nuevasHabilitadas);
  };

  // Función para cambiar de sección
  const cambiarSeccion = (seccion: string) => {
    if (seccionesHabilitadas[seccion]) {
      setSeccionActiva(seccion);
    }
  };

  // Función para filtrar materias por grados seleccionados usando tabla materiaGrados
  const filtrarMateriasPorGrados = () => {
    if (asignacionesGradoCurso.length === 0) {
      setMateriasFiltradas([]);
      setMateriasPorGrado({});
      return;
    }

    console.log('=== FILTRANDO MATERIAS POR GRADOS ===');
    console.log('Asignaciones grado-curso:', asignacionesGradoCurso);
    console.log('Materias-grados cargados:', materiasGradosCargados);

    // Paso 1: Obtener IDs únicos de grados de las asignaciones
    const gradoIds = [...new Set(asignacionesGradoCurso.map(a => a.gradoId))];
    console.log('IDs únicos de grados:', gradoIds);

    // Paso 2: Buscar en tabla materiaGrados donde grado_id IN (gradoIds)
    const relacionesRelevantes = materiasGradosCargados.filter(mg => 
      gradoIds.includes(mg.grado_id)
    );
    console.log('Relaciones encontradas:', relacionesRelevantes);

    // Paso 3: Obtener IDs únicos de materias
    const materiaIds = [...new Set(relacionesRelevantes.map(mg => mg.materia_id))];
    console.log('IDs de materias únicas:', materiaIds);

    // Paso 4: Buscar materias en la tabla materias por IDs
    const materiasEncontradas = materiasCargadas.filter(materia => 
      materiaIds.includes(materia.id)
    );
    console.log('Materias encontradas:', materiasEncontradas);

    // Paso 5: Agrupar materias por grado
    const materiasAgrupadas: {[gradoId: number]: any[]} = {};
    
    gradoIds.forEach(gradoId => {
      // Filtrar relaciones para este grado específico
      const relacionesDelGrado = relacionesRelevantes.filter(mg => mg.grado_id === gradoId);
      
      // Obtener IDs de materias para este grado
      const materiaIdsDelGrado = relacionesDelGrado.map(mg => mg.materia_id);
      
      // Buscar materias completas para este grado
      const materiasDelGrado = materiasCargadas.filter(materia => 
        materiaIdsDelGrado.includes(materia.id)
      ).map(materia => ({
        id: materia.id,
        nombre: materia.nombre,
        areaId: materia.area_id,
        gradoId: gradoId
      }));
      
      materiasAgrupadas[gradoId] = materiasDelGrado;
      console.log(`Materias para grado ${gradoId}:`, materiasDelGrado);
    });

    setMateriasPorGrado(materiasAgrupadas);
    setMateriasFiltradas(materiasEncontradas);
    
    console.log('Materias agrupadas por grado:', materiasAgrupadas);
    console.log('Materias filtradas totales:', materiasEncontradas);
  };

  // Función para verificar manualmente el email
  const verificarEmailManual = async () => {
    if (!docenteActual.email.trim() || !validarEmail(docenteActual.email.trim())) {
      setModalEmailDocente({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido primero.'
      });
      return;
    }

    setVerificandoEmail(true);
    setEmailVerificado(false);
    
    try {
      const emailExiste = await verificarEmailExistente(docenteActual.email.trim());
      
      if (emailExiste) {
        setErroresValidacion(prev => ({
          ...prev,
          email: 'Este email ya está registrado en el sistema'
        }));
        setEmailVerificado(false);
        // Deshabilitar el campo de contraseña cuando el email no esté disponible
        setCamposHabilitados(prev => ({ ...prev, password: false }));
        setModalEmailDocente({
          tipo: 'error',
          titulo: 'Email no disponible',
          mensaje: 'Este email ya está registrado. Por favor usa otro email.'
        });
      } else {
        setErroresValidacion(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
        setEmailVerificado(true);
        // Habilitar el campo de contraseña cuando el email esté verificado
        setCamposHabilitados(prev => ({ ...prev, password: true }));
        setModalEmailDocente({
          tipo: 'success',
          titulo: 'Email disponible',
          mensaje: 'Puedes continuar con la contraseña.'
        });
      }
    } catch (error) {
      console.error('Error verificando email:', error);
      setModalEmailDocente({
        tipo: 'error',
        titulo: 'Error verificando email',
        mensaje: 'Intenta nuevamente.'
      });
    } finally {
      setVerificandoEmail(false);
    }
  };

  // Función para validar campo en tiempo real
  const validarCampo = async (campo: string, valor: string) => {
    const errores = { ...erroresValidacion };
    const habilitados = { ...camposHabilitados };
    const validados = { ...camposValidados };
    
    switch (campo) {
      case 'nombres':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.apellidos = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'apellidos':
        if (valor.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor.trim() && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.telefono = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'telefono':
        if (valor && typeof valor === 'string' && valor.trim() && !isPhoneValidDocente(valor.trim())) {
          errores[campo] = 'Ingrese un número de teléfono válido con indicativo de país';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim() && isPhoneValidDocente(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.email = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'email':
        if (valor.trim() && !validarEmail(valor.trim())) {
          errores[campo] = 'Formato de email inválido';
          validados[campo] = false;
          setEmailVerificado(false);
          // Deshabilitar contraseña cuando email es inválido
          setCamposHabilitados(prev => ({ ...prev, password: false }));
        } else if (valor.trim() && validarEmail(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          // No habilitar password automáticamente, esperar verificación manual
          setEmailVerificado(false);
          // Deshabilitar contraseña hasta que email sea verificado
          setCamposHabilitados(prev => ({ ...prev, password: false }));
        } else {
          delete errores[campo];
          validados[campo] = false;
          setEmailVerificado(false);
          // Deshabilitar contraseña cuando email está vacío
          setCamposHabilitados(prev => ({ ...prev, password: false }));
        }
        break;
      case 'password': {
          const reqs = getPasswordRequirementsDocente(String(valor || ''));
          const allOk = Object.values(reqs).every(Boolean);
          if (valor && !allOk) {
            errores[campo] = 'La contraseña debe cumplir todos los requisitos';
            validados[campo] = false;
          } else if (valor && allOk) {
            delete errores[campo];
            validados[campo] = true;
          } else {
            delete errores[campo];
            validados[campo] = false;
          }
          break;
        }
    }
    
    setErroresValidacion(errores);
    setCamposHabilitados(habilitados);
    setCamposValidados(validados);
  };

  // Función para validar email
  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar teléfono celular colombiano
  const validarTelefonoColombiano = (telefono: string) => {
    // Remover espacios y caracteres especiales
    const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Validar que tenga 10 dígitos y empiece con 3
    if (telefonoLimpio.length === 10 && telefonoLimpio.startsWith('3')) {
      return true;
    }
    
    // También aceptar formato con código de país +57
    if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('573')) {
      return true;
    }
    
    return false;
  };

  const getPasswordRequirementsDocente = (password: string) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  });

  // Función para validar campos de estudiantes
  const validarCampoEstudiante = async (campo: string, valor: string | number) => {
    const errores = { ...erroresValidacionEstudiante };
    const habilitados = { ...camposHabilitadosEstudiante };
    const validados = { ...camposValidadosEstudiante };
    
    switch (campo) {
      case 'nombres':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.apellidos = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'apellidos':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.codigo_estudiantil = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'codigo_estudiantil':
        if (valor && typeof valor === 'string' && valor.trim().length < 3) {
          errores[campo] = 'Mínimo 3 caracteres';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim().length >= 3) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.nombre_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'nombre_acudiente':
        if (valor && typeof valor === 'string' && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          errores[campo] = 'Solo se permiten letras y espacios';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.correo_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'correo_acudiente':
        if (valor && typeof valor === 'string' && !validarEmail(valor.trim())) {
          errores[campo] = 'Formato de email inválido';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && validarEmail(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.telefono_acudiente = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'telefono_acudiente':
        if (valor && typeof valor === 'string' && valor.trim() && !isPhoneValidDocente(valor.trim())) {
          errores[campo] = 'Ingrese un número de teléfono válido con indicativo de país';
          validados[campo] = false;
        } else if (valor && typeof valor === 'string' && valor.trim() && isPhoneValidDocente(valor.trim())) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.grado_id = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'grado_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
          habilitados.curso_id = true;
          // Cargar cursos cuando se selecciona un grado
          cargarCursosPorGrado(valor);
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
      case 'curso_id':
        if (valor && typeof valor === 'number' && valor > 0) {
          delete errores[campo];
          validados[campo] = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
    }
    
    setErroresValidacionEstudiante(errores);
    setCamposHabilitadosEstudiante(habilitados);
    setCamposValidadosEstudiante(validados);
  };

  // Función para agregar docente
  const handleAgregarDocente = () => {
    // Validaciones básicas
    if (!docenteActual.nombres.trim() || !docenteActual.apellidos.trim() || !docenteActual.telefono.trim() || !docenteActual.email.trim() || !docenteActual.password.trim()) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Por favor completa todos los campos.'
      });
      return;
    }

    // Validar nombres y apellidos (solo letras y espacios)
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(docenteActual.nombres.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Nombre inválido',
        mensaje: 'Los nombres solo pueden contener letras y espacios.'
      });
      return;
    }
    if (!nombreRegex.test(docenteActual.apellidos.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Apellido inválido',
        mensaje: 'Los apellidos solo pueden contener letras y espacios.'
      });
      return;
    }

    // Validar email
    if (!validarEmail(docenteActual.email.trim())) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido.'
      });
      return;
    }

    // Validar teléfono celular colombiano
    if (!isPhoneValidDocente(docenteActual.telefono)) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Teléfono inválido',
        mensaje: 'Por favor ingresa un número de teléfono válido con indicativo de país.'
      });
      return;
    }

    const passwordReqs = getPasswordRequirementsDocente(docenteActual.password);
    const passwordOk = Object.values(passwordReqs).every(Boolean);
    if (!passwordOk) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Contraseña inválida',
        mensaje: 'La contraseña debe cumplir todos los requisitos: al menos 8 caracteres, mayúscula, minúscula, número y símbolo.'
      });
      return;
    }

    // Verificar si el email ya existe en la lista local
    const emailExiste = docentes.some(d => d.email.toLowerCase() === docenteActual.email.trim().toLowerCase());
    if (emailExiste) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Email duplicado',
        mensaje: 'Ya existe un docente con este email en la lista actual.'
      });
      return;
    }

    const nuevoDocente: Docente = {
      id: Date.now(), // ID temporal
      nombres: docenteActual.nombres.trim(),
      apellidos: docenteActual.apellidos.trim(),
      telefono: docenteActual.telefono.trim(),
      email: docenteActual.email.trim().toLowerCase(),
      sede_id: undefined, // Se asignará automáticamente
      activo: true
    };

    setDocentes([...docentes, nuevoDocente]);
    
    // Guardar asignaciones del docente (nueva estructura)
    console.log('=== GUARDANDO ASIGNACIONES PARA DOCENTE:', nuevoDocente.id, '===');
    console.log('Asignaciones grado-curso:', asignacionesGradoCurso);
    
    setAsignacionesPorDocente(prev => ({
      ...prev,
      [nuevoDocente.id]: {
        asignaciones: asignacionesGradoCurso
      }
    }));
    
    limpiarFormularioDocente();
    setModalDocenteAccion({
      tipo: 'success',
      titulo: 'Docente agregado',
      mensaje: 'Docente agregado correctamente.'
    });
  };

  // Función para eliminar un docente de la lista
  const eliminarDocente = (docenteId: number) => {
    // Confirmar eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este docente?')) {
      // Remover de la lista de docentes
      setDocentes(prev => prev.filter(d => d.id !== docenteId));
      
      // Remover sus asignaciones
      setAsignacionesPorDocente(prev => {
        const nuevasAsignaciones = { ...prev };
        delete nuevasAsignaciones[docenteId];
        return nuevasAsignaciones;
      });
      
      // Remover estado de expansión
      setAsignacionesExpandidas(prev => {
        const nuevasExpandidas = { ...prev };
        delete nuevasExpandidas[docenteId];
        return nuevasExpandidas;
      });
      
      console.log(`🗑️ Docente eliminado: ${docenteId}`);
      Swal.fire({
        icon: 'success',
        title: 'Docente eliminado',
        text: 'Docente eliminado correctamente'
      });
    }
  };

  // Función para agregar estudiante
  const handleAgregarEstudiante = () => {
    // Validaciones básicas
    if (!estudianteActual.nombres.trim() || !estudianteActual.apellidos.trim() || 
        !estudianteActual.codigo_estudiantil.trim() || !estudianteActual.nombre_acudiente.trim() ||
        !estudianteActual.correo_acudiente.trim() || !estudianteActual.telefono_acudiente.trim() ||
        estudianteActual.grado_id === 0 || estudianteActual.curso_id === 0) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Campos incompletos',
        mensaje: 'Por favor completa todos los campos.'
      });
      return;
    }

    // Validar email del acudiente
    if (!validarEmail(estudianteActual.correo_acudiente.trim())) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Email inválido',
        mensaje: 'Por favor ingresa un email válido para el acudiente.'
      });
      return;
    }

    // Validar teléfono del acudiente
    if (!isPhoneValidDocente(estudianteActual.telefono_acudiente)) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Teléfono inválido',
        mensaje: 'Por favor ingresa un número de teléfono válido con indicativo de país para el acudiente.'
      });
      return;
    }

    // Verificar que no haya errores de validación
    if (Object.keys(erroresValidacionEstudiante).length > 0) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Errores de validación',
        mensaje: 'Por favor corrige los errores antes de continuar.'
      });
      return;
    }

    // Verificar que no exista un estudiante con el mismo código
    const estudianteExistente = estudiantes.find(e => e.codigo_estudiantil === estudianteActual.codigo_estudiantil.trim());
    if (estudianteExistente) {
      setModalEstudianteAccion({
        tipo: 'error',
        titulo: 'Código duplicado',
        mensaje: 'Ya existe un estudiante con este código.'
      });
      return;
    }

    // Crear nuevo estudiante
    const nuevoEstudiante: Estudiante = {
      id: Date.now(), // ID temporal
      nombres: estudianteActual.nombres.trim(),
      apellidos: estudianteActual.apellidos.trim(),
      codigo_estudiantil: estudianteActual.codigo_estudiantil.trim(),
      nombre_acudiente: estudianteActual.nombre_acudiente.trim(),
      correo_acudiente: estudianteActual.correo_acudiente.trim().toLowerCase(),
      telefono_acudiente: estudianteActual.telefono_acudiente.trim(),
      grado_id: estudianteActual.grado_id,
      curso_id: estudianteActual.curso_id,
      institucion_id: institucionId,
      activo: true
    };

    // Agregar a la lista
    setEstudiantes([...estudiantes, nuevoEstudiante]);
    
    limpiarFormularioEstudiante();
    setModalEstudianteAccion({
      tipo: 'success',
      titulo: 'Estudiante agregado',
      mensaje: 'Estudiante agregado correctamente.'
    });
  };

  // Función para eliminar un estudiante de la lista
  const eliminarEstudiante = (estudianteId: number) => {
    const estudiante = estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;
    setEstudianteParaEliminar({
      estudianteId,
      nombre: `${estudiante.nombres} ${estudiante.apellidos}`
    });
  };

  // Función para alternar la expansión de asignaciones
  const toggleAsignaciones = (docenteId: number) => {
    setAsignacionesExpandidas(prev => ({
      ...prev,
      [docenteId]: !prev[docenteId]
    }));
  };

  // Función para guardar docentes en la base de datos
  const handleSaveDocentes = async () => {
    if (docentes.length === 0) {
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Sin docentes',
        mensaje: 'No hay docentes para guardar.'
      });
      return;
    }

    // Mostrar resumen antes de guardar
    // Ya no mostramos el modal de resumen, vamos directamente al paso 4
    setCurrentStep(4);
  };

  // Función para mostrar confirmación de guardado
  const mostrarConfirmacion = () => {
    setMostrarConfirmacionGuardado(true);
  };

  // Función para guardar docentes directamente
  const guardarDocentes = async () => {
    setMostrarConfirmacionGuardado(false);
    setSaving(true);
    try {
      console.log('=== GUARDANDO DOCENTES ===');
      console.log('Docentes a guardar:', docentes.length);
      console.log('Institución ID:', institucionId);
      console.log('Docentes completos:', docentes);

      // Procesar cada docente individualmente con sus asignaciones
      const resultados = [];
      const erroresDocentes: string[] = [];
      
      for (let i = 0; i < docentes.length; i++) {
        const docente = docentes[i];
        
        console.log(`=== PROCESANDO DOCENTE ${i + 1}/${docentes.length} ===`);
        console.log('Docente:', docente);
        
        // Generar contraseña aleatoria
        const password = generarPasswordAleatoria();
        
        // Obtener asignaciones del docente desde las asignaciones guardadas
        const asignacionesRaw = asignacionesPorDocente[docente.id] || { asignaciones: [] };
        
        console.log('Asignaciones raw para este docente:', asignacionesRaw);
        
        // Convertir asignacionesGradoCurso a la estructura esperada por el backend
        const asignaciones: {
          grados: number[];
          cursos: { [key: number]: number[] };
          materias: { [key: number]: number[] };
        } = {
          grados: [],
          cursos: {},
          materias: {}
        };
        
        // Procesar cada asignación grado-curso
        asignacionesRaw.asignaciones.forEach(asignacion => {
          const gradoId = asignacion.gradoId;
          const cursoId = asignacion.cursoId;
          const materiaIds = asignacion.materiasSeleccionadas;
          
          // Agregar grado si no existe
          if (!asignaciones.grados.includes(gradoId)) {
            asignaciones.grados.push(gradoId);
          }
          
          // Agregar curso al grado
          if (!asignaciones.cursos[gradoId]) {
            asignaciones.cursos[gradoId] = [];
          }
          if (!asignaciones.cursos[gradoId].includes(cursoId)) {
            asignaciones.cursos[gradoId].push(cursoId);
          }
          
          // Agregar materias al grado
          if (!asignaciones.materias[gradoId]) {
            asignaciones.materias[gradoId] = [];
          }
          materiaIds.forEach(materiaId => {
            if (!asignaciones.materias[gradoId].includes(materiaId)) {
              asignaciones.materias[gradoId].push(materiaId);
            }
          });
        });
        
        console.log('Asignaciones procesadas para este docente:', asignaciones);
        
        const datosAEnviar = {
          institucionId,
          docentes: [{
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            telefono: docente.telefono,
            email: docente.email,
            password: password
          }],
          asignaciones: asignaciones
        };

        console.log('Datos que se envían:', JSON.stringify(datosAEnviar, null, 2));

        const response = await fetch('/api/setup/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosAEnviar)
        });
        
        console.log('Status de respuesta:', response.status);
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        resultados.push({
          docente: docente.email,
          success: response.ok,
          data: responseData
        });
        
        if (!response.ok) {
          console.error(`Error guardando docente ${docente.email}:`, responseData);
          erroresDocentes.push(
            `Error guardando ${docente.nombres} ${docente.apellidos}: ${
              responseData.error || responseData.details || 'Error desconocido'
            }`
          );
        }
      }
      
      // Resumir resultados
      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;
      
      console.log('=== RESUMEN DE RESULTADOS ===');
      console.log('Exitosos:', exitosos);
      console.log('Fallidos:', fallidos);
      
      if (exitosos > 0) {
        setModalDocenteAccion({
          tipo: fallidos > 0 ? 'info' : 'success',
          titulo: fallidos > 0 ? 'Docentes creados con errores' : 'Docentes creados',
          mensaje: `Se crearon ${exitosos} docente(s) exitosamente${fallidos > 0 ? ` (${fallidos} con errores)` : ''}.`
        });
        if (erroresDocentes.length > 0) {
          console.error('Errores al guardar docentes:', erroresDocentes);
        }
        // Avanzar al siguiente paso solo si se crearon docentes exitosamente
        setCurrentStep(4);
      } else {
        setModalDocenteAccion({
          tipo: 'error',
          titulo: 'No se pudieron crear docentes',
          mensaje: 'No se pudo crear ningún docente. Revisa los errores.'
        });
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      setModalDocenteAccion({
        tipo: 'error',
        titulo: 'Error de conexión',
        mensaje: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSaving(false);
    }
  };

  // Función para guardar estudiantes
  const guardarEstudiantes = async () => {
    setSaving(true);
    try {
      console.log('=== GUARDANDO ESTUDIANTES ===');
      console.log('Estudiantes a guardar:', estudiantes.length);
      console.log('Institución ID:', institucionId);
      console.log('Estudiantes completos:', estudiantes);

      // Procesar cada estudiante individualmente
      const resultados = [];
      
      for (let i = 0; i < estudiantes.length; i++) {
        const estudiante = estudiantes[i];
        
        console.log(`=== PROCESANDO ESTUDIANTE ${i + 1}/${estudiantes.length} ===`);
        console.log('Estudiante:', estudiante);
        
        const datosAEnviar = {
          institucionId,
          estudiantes: [estudiante]
        };

        console.log('Datos que se envían:', JSON.stringify(datosAEnviar, null, 2));

        const response = await fetch('/api/setup/estudiantes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosAEnviar)
        });
        
        console.log('Status de respuesta:', response.status);
        
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        
        resultados.push({
          estudiante: estudiante.codigo_estudiantil,
          success: response.ok,
          data: responseData
        });
        
        if (!response.ok) {
          console.error(`Error guardando estudiante ${estudiante.codigo_estudiantil}:`, responseData);
          await Swal.fire({
            icon: 'error',
            title: 'Error guardando estudiante',
            text: `Error guardando ${estudiante.nombres} ${estudiante.apellidos}: ${
              responseData.error || responseData.details || 'Error desconocido'
            }`
          });
        }
      }
      
      // Resumir resultados
      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;
      
      console.log('=== RESUMEN DE RESULTADOS ===');
      console.log('Exitosos:', exitosos);
      console.log('Fallidos:', fallidos);
      
      if (exitosos > 0) {
        await Swal.fire({
          icon: 'success',
          title: 'Estudiantes creados',
          text: `Se crearon ${exitosos} estudiante(s) exitosamente${fallidos > 0 ? ` (${fallidos} con errores)` : ''}`
        });
        // Avanzar al siguiente paso solo si se crearon estudiantes exitosamente
        setCurrentStep(5);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'No se pudieron crear estudiantes',
          text: 'No se pudo crear ningún estudiante. Revisa los errores mostrados.'
        });
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSaving(false);
    }
  };

  // Función para generar contraseña aleatoria
  const generarPasswordAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  };

  const handleSaveAreasYMaterias = async () => {
    setSaving(true);
    try {
      const areasActivasData = areasPredeterminadas.filter(area => 
        areasActivas.includes(area.id)
      );
      
      console.log('=== GUARDANDO AREAS Y MATERIAS ===');
      console.log('Áreas activas:', areasActivasData.length);
      console.log('Materias:', materias.length);

      const response = await fetch('/api/setup/areas-materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucionId,
          areas: areasActivasData,
          materias
        })
      });
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (response.ok) {
        // Ahora guardar las asignaciones materia-grado
        if (materiasPorCurso.length > 0) {
          console.log('Guardando asignaciones materia-grado...');
          
          // Crear un mapa de IDs temporales a IDs reales de las materias
          const materiaIdMap = new Map();
          responseData.data.materiasCreadas.forEach((materia: any, index: number) => {
            // Usar el índice para mapear, ya que las materias se crean en el mismo orden
            if (index < materias.length) {
              const materiaOriginal = materias[index];
              materiaIdMap.set(materiaOriginal.id, materia.id);
            }
          });
          
          console.log('Mapa de IDs de materias:', Object.fromEntries(materiaIdMap));
          console.log('Materias originales:', materias);
          console.log('Materias creadas:', responseData.data.materiasCreadas);
          
          // Convertir asignaciones a usar IDs reales
          const asignacionesReales = materiasPorCurso.map(asignacion => {
            const materiaIdReal = materiaIdMap.get(asignacion.materiaId);
            if (!materiaIdReal) {
              console.error('No se encontró ID real para:', asignacion.materiaId);
              console.error('Mapa disponible:', Object.fromEntries(materiaIdMap));
              throw new Error(`No se encontró el ID real para la materia temporal ${asignacion.materiaId}`);
            }
            return {
              materiaId: materiaIdReal,
              gradoId: asignacion.gradoId
            };
          });
          
          console.log('Asignaciones con IDs reales:', asignacionesReales);
          
          const asignacionesResponse = await fetch('/api/setup/materia-grados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              institucionId,
              asignaciones: asignacionesReales
            })
          });
          
          const asignacionesData = await asignacionesResponse.json();
          console.log('Respuesta asignaciones:', asignacionesData);
          
          if (asignacionesResponse.ok) {
            setMostrarResumenAreas(false);
            setMostrarExitoAreasMaterias({
              areasCreadas: areasActivas.length,
              materiasCreadas: responseData?.materiasCreadas?.length || materias.length
            });
            console.log('Asignaciones guardadas:', asignacionesData);
            // Avanzar al siguiente paso
            setCurrentStep(3);
          } else {
            console.error('Error guardando asignaciones:', asignacionesData);
            await Swal.fire({
              icon: 'error',
              title: 'Error al guardar asignaciones',
              text: asignacionesData.details || asignacionesData.error || 'Error desconocido'
            });
          }
        } else {
          setMostrarResumenAreas(false);
          setMostrarExitoAreasMaterias({
            areasCreadas: areasActivas.length,
            materiasCreadas: responseData?.materiasCreadas?.length || materias.length
          });
          console.log('Datos guardados:', responseData);
          // Avanzar al siguiente paso
          setCurrentStep(3);
        }
      } else {
        console.error('Error del servidor:', responseData);
        console.error('Status del response:', response.status);
        console.error('Headers del response:', response.headers);
        
        const errorMessage = responseData.details || responseData.error || responseData.message || 'Error desconocido del servidor';
        await Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: errorMessage
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGradosYCursos = async () => {
    setSaving(true);
    try {
      const normalizarNombre = (nombre: string) => nombre.trim().toLowerCase();
      const cursosExistentesPorGrado = new Map<number, Set<string>>();
      gradosCargados.forEach((grado: any) => {
        cursosExistentesPorGrado.set(
          grado.id,
          new Set((grado.cursos || []).map((curso: any) => normalizarNombre(curso.nombre || '')))
        );
      });

      const cursosNuevos = cursos.filter((curso) => {
        const nombre = normalizarNombre(curso.nombre || '');
        if (!nombre) return false;
        const existentes = cursosExistentesPorGrado.get(curso.gradoId) || new Set<string>();
        return !existentes.has(nombre);
      });

      if (cursosNuevos.length === 0) {
        setMostrarResumen(false);
        setSaving(false);
        setMostrarExitoGradosCursos({ gradosCreados: 0, cursosCreados: 0 });
        return;
      }

      // Solo obtener los grados que tienen cursos
      const gradosConCursos = gradosPredeterminados.filter(grado => 
        cursosNuevos.some(curso => curso.gradoId === grado.id)
      );
      
      console.log('=== DATOS QUE SE ENVÍAN ===');
      console.log('Grados con cursos:', gradosConCursos.length);
      console.log('Cursos totales:', cursos.length);
      
      // Transformar los datos para que coincidan con la estructura esperada por la API
      const gradosCursos = gradosConCursos.map(grado => ({
        grado_id: grado.id,
        cursos: cursosNuevos
          .filter(curso => curso.gradoId === grado.id)
          .map(curso => ({
            nombre: curso.nombre
          }))
      }));

      const datosAEnviar = {
        institucionId,
        gradosCursos
      };
      
      console.log('institucionId:', institucionId);
      console.log('gradosCursos transformados:', gradosCursos);
      console.log('JSON completo:', JSON.stringify(datosAEnviar, null, 2));

      const response = await fetch('/api/setup/grados-cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (response.ok) {
        setMostrarResumen(false);
        setGradosGuardados(responseData.data.gradosCreados);
        setCursosGuardados(responseData.data.cursosCreados);
        setMostrarExitoGradosCursos({
          gradosCreados: responseData.data.gradosCreados?.length || 0,
          cursosCreados: responseData.data.cursosCreados?.length || 0
        });
        console.log('Datos guardados:', responseData);
        await cargarGrados();
        // Avanzar al siguiente paso
        setCurrentStep(2);
      } else if (response.status === 409) {
        const duplicateNames = responseData?.duplicateNames;
        setDuplicadosCursos(Array.isArray(duplicateNames) && duplicateNames.length > 0 ? duplicateNames : []);
      } else {
        console.error('Error del servidor:', responseData);
        await Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: responseData.details || responseData.error || 'Error desconocido'
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSaving(false);
    }
  };

  // Cargar grados cuando se llegue al Paso 1 o 2
  useEffect(() => {
    if ((currentStep === 1 || currentStep === 2) && gradosCargados.length === 0) {
      cargarGrados();
    }
  }, [currentStep]);

  // Cargar áreas y materias cuando se llegue al Paso 3
  useEffect(() => {
    if (currentStep === 3 && areasCargadas.length === 0) {
      cargarAreasMaterias();
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 4 && gradosDisponibles.length === 0) {
      cargarGradosEstudiantes();
    }
  }, [currentStep]);

  useEffect(() => {
    if (!institucionId) return;

    const cargarBranding = async () => {
      try {
        const response = await fetch(`/api/instituciones/${institucionId}/branding`);
        if (!response.ok) return;
        const data = await response.json();
        setBrandingColors({
          primary: data.color_primario || '#2563eb',
          secondary: data.color_secundario || '#0f172a'
        });
      } catch (error) {
        console.error('Error cargando branding:', error);
      }
    };

    cargarBranding();
  }, [institucionId]);

  useEffect(() => {
    const body = document.body;
    const count = Number(body.dataset.modalCount || '0');
    body.dataset.modalCount = String(count + 1);
    body.classList.add('modal-open');
    return () => {
      const next = Math.max(Number(body.dataset.modalCount || '1') - 1, 0);
      if (next === 0) {
        body.classList.remove('modal-open');
        delete body.dataset.modalCount;
      } else {
        body.dataset.modalCount = String(next);
      }
    };
  }, []);

  // Actualizar estado de secciones cuando cambien los datos
  useEffect(() => {
    actualizarEstadoSecciones();
  }, [docenteActual, emailVerificado, erroresValidacion, asignacionesGradoCurso]);

  // Filtrar materias cuando cambien las asignaciones grado-curso
  useEffect(() => {
    if (materiasGradosCargados.length > 0 && asignacionesGradoCurso.length > 0) {
      filtrarMateriasPorGrados();
    }
  }, [asignacionesGradoCurso, materiasGradosCargados]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {duplicadosCursos !== null && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Cursos duplicados</h3>
                  <button
                    type="button"
                    onClick={() => setDuplicadosCursos(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p className="text-slate-800 font-medium">
                    No se pueden crear cursos con nombres duplicados.
                  </p>
                  {duplicadosCursos.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {duplicadosCursos.map((nombre) => (
                        <div
                          key={nombre}
                          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                          <span className="font-medium">{nombre}</span>
                          <span className="text-xs font-semibold text-red-600">Duplicado</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2">Revisa los nombres de los cursos.</p>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDuplicadosCursos(null)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {mostrarExitoGradosCursos && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Configuración guardada</h3>
                  <button
                    type="button"
                    onClick={() => setMostrarExitoGradosCursos(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  {mostrarExitoGradosCursos.cursosCreados > 0 ? (
                    <>
                      <p className="text-slate-800 font-medium">
                        ✅ Grados y cursos guardados correctamente.
                      </p>
                      <div className="mt-2">
                        Grados creados: <span className="font-semibold">{mostrarExitoGradosCursos.gradosCreados}</span>
                      </div>
                      <div>
                        Cursos creados: <span className="font-semibold">{mostrarExitoGradosCursos.cursosCreados}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-800 font-medium">
                        No hay cursos nuevos para guardar.
                      </p>
                      <p className="mt-2">Agrega un curso nuevo y vuelve a intentar.</p>
                    </>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMostrarExitoGradosCursos(null)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {mostrarExitoAreasMaterias && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Configuración guardada</h3>
                  <button
                    type="button"
                    onClick={() => setMostrarExitoAreasMaterias(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p className="text-slate-800 font-medium">
                    ✅ Áreas y materias guardadas correctamente.
                  </p>
                  <div className="mt-2">
                    Áreas activas: <span className="font-semibold">{mostrarExitoAreasMaterias.areasCreadas}</span>
                  </div>
                  <div>
                    Materias creadas: <span className="font-semibold">{mostrarExitoAreasMaterias.materiasCreadas}</span>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMostrarExitoAreasMaterias(null)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalEmailDocente && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{modalEmailDocente.titulo}</h3>
                  <button
                    type="button"
                    onClick={() => setModalEmailDocente(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p
                    className={`font-medium ${
                      modalEmailDocente.tipo === 'success'
                        ? 'text-green-700'
                        : modalEmailDocente.tipo === 'error'
                        ? 'text-red-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {modalEmailDocente.mensaje}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalEmailDocente(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      modalEmailDocente.tipo === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : modalEmailDocente.tipo === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalDocenteAccion && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{modalDocenteAccion.titulo}</h3>
                  <button
                    type="button"
                    onClick={() => setModalDocenteAccion(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p
                    className={`font-medium ${
                      modalDocenteAccion.tipo === 'success'
                        ? 'text-green-700'
                        : modalDocenteAccion.tipo === 'error'
                        ? 'text-red-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {modalDocenteAccion.mensaje}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalDocenteAccion(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      modalDocenteAccion.tipo === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : modalDocenteAccion.tipo === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalEstudianteAccion && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{modalEstudianteAccion.titulo}</h3>
                  <button
                    type="button"
                    onClick={() => setModalEstudianteAccion(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p
                    className={`font-medium ${
                      modalEstudianteAccion.tipo === 'success'
                        ? 'text-green-700'
                        : modalEstudianteAccion.tipo === 'error'
                        ? 'text-red-700'
                        : 'text-slate-800'
                    }`}
                  >
                    {modalEstudianteAccion.mensaje}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalEstudianteAccion(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      modalEstudianteAccion.tipo === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : modalEstudianteAccion.tipo === 'error'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}
          {estudianteParaEliminar && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Eliminar estudiante</h3>
                  <button
                    type="button"
                    onClick={() => setEstudianteParaEliminar(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p className="text-slate-800 font-medium">
                    ¿Eliminar al estudiante &quot;{estudianteParaEliminar.nombre}&quot;?
                  </p>
                  <p className="mt-2">Esta acción lo removerá de la lista actual.</p>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEstudianteParaEliminar(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEstudiantes(prev =>
                        prev.filter(e => e.id !== estudianteParaEliminar.estudianteId)
                      );
                      console.log(`🗑️ Estudiante eliminado: ${estudianteParaEliminar.estudianteId}`);
                      setEstudianteParaEliminar(null);
                      setModalEstudianteAccion({
                        tipo: 'success',
                        titulo: 'Estudiante eliminado',
                        mensaje: 'Estudiante eliminado correctamente.'
                      });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
          {cursoParaEliminar && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Confirmar eliminación</h3>
                  <button
                    type="button"
                    onClick={() => !eliminandoCurso && setCursoParaEliminar(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 py-4 text-sm text-slate-600">
                  <p className="text-slate-800 font-medium">
                    ¿Eliminar el curso &quot;{cursoParaEliminar.nombre}&quot;?
                  </p>
                  <p className="mt-2">
                    Ten en cuenta que se eliminará toda la información relacionada: estudiantes,
                    asignaciones y recordatorios.
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setCursoParaEliminar(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={eliminandoCurso}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setEliminandoCurso(true);
                      await eliminarCursoGuardado(cursoParaEliminar.cursoId, cursoParaEliminar.gradoId);
                      setEliminandoCurso(false);
                      setCursoParaEliminar(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
                    disabled={eliminandoCurso}
                  >
                    {eliminandoCurso ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Eliminando...
                      </>
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        {/* Header: color fijo (no usa branding de la institución) */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 relative bg-slate-700 text-white">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Configuración Inicial</h2>
              <p className="text-xs sm:text-sm mt-1 text-white/90">
                {currentStep === 0 ? 'Introducción' : `Paso ${currentStep} de 5`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex gap-4 sm:gap-0 sm:justify-between overflow-x-auto sm:overflow-visible pb-1">
            {[
              { num: 0, label: 'Introducción' },
              { num: 1, label: 'Grados y Cursos' },
              { num: 2, label: 'Áreas y Materias' },
              { num: 3, label: 'Docentes' },
              { num: 4, label: 'Estudiantes' },
              { num: 5, label: 'Resumen' },
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center flex-shrink-0 sm:flex-shrink ${step.num < 5 ? 'sm:flex-1' : ''}`}
              >
                <div className="flex flex-col items-center min-w-[110px] sm:min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStep >= step.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 font-medium text-center ${
                      currentStep >= step.num ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.num < 5 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 mx-2 mt-[-20px] ${
                      currentStep > step.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Configuración inicial de la institución
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Este asistente te guía paso a paso para dejar lista la estructura de tu institución: grados, cursos, áreas, materias, docentes y estudiantes.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Objetivo
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Configurar de forma ordenada los datos que la plataforma necesita para que los docentes puedan crear recordatorios y los estudiantes ver la información correcta. Al finalizar tendrás definidos grados y cursos, áreas y materias, docentes con sus asignaciones y estudiantes por curso.
                </p>
                <h4 className="font-semibold text-slate-900 flex items-center pt-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                  Cómo usar esta configuración
                </h4>
                <ul className="text-slate-700 leading-relaxed space-y-2 list-disc list-inside">
                  <li>Completa cada paso en orden; podrás volver atrás si necesitas cambiar algo.</li>
                  <li>En <strong>Grados y Cursos</strong> defines la estructura académica (ej. 5° A, 5° B).</li>
                  <li>En <strong>Áreas y Materias</strong> defines las asignaturas y las vinculas a grados.</li>
                  <li>En <strong>Docentes</strong> das de alta a los profesores y los asignas a grados, cursos y materias.</li>
                  <li>En <strong>Estudiantes</strong> registras alumnos y los asignas a un grado y curso.</li>
                  <li>En <strong>Resumen</strong> revisas todo antes de finalizar.</li>
                </ul>
                <p className="text-slate-600 text-sm pt-2">
                  Usa los botones <strong>Anterior</strong> y <strong>Siguiente</strong> para moverte entre pasos. Al terminar el último paso podrás cerrar el asistente y seguir usando el panel de administración.
                </p>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 1: Grados y Cursos
                </h3>
                <p className="text-slate-600">
                  Los grados están predefinidos según el sistema educativo. Agrega los cursos que necesites para cada grado.
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(gradosPorNivel).map(([nivel, grados]) => (
                  <div key={nivel} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-lg text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {nivel}
                    </h4>
                    
                    <div className="space-y-4">
                      {grados.map((grado) => {
                        const cursosDelGrado = cursos.filter(c => c.gradoId === grado.id);
                        const ejemploCurso = `${grado.nombre} A`;
                        const gradoExistente = gradosCargados.find((g: any) => g.nombre === grado.nombre);
                        const cursosExistentes = gradoExistente?.cursos || [];
                        
                        return (
                          <div key={grado.id} className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                              <div className="flex flex-wrap items-center gap-2 min-w-0">
                                <span className="font-semibold text-slate-900 text-lg">
                                  {grado.nombre}
                                </span>
                                <div className="relative group ml-2">
                                  <button
                                    type="button"
                                    aria-label={`Ejemplo de curso para ${grado.nombre}`}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8a1 1 0 112 0v5a1 1 0 11-2 0V8zm1-4a1.25 1.25 0 110 2.5A1.25 1.25 0 0110 4z" />
                                    </svg>
                                  </button>
                                  <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    <div className="font-semibold text-slate-700">Ejemplos:</div>
                                    <div>{ejemploCurso}</div>
                                    <div>{grado.nombre} B</div>
                                    <div>{grado.nombre} C</div>
                                    <div className="mt-2 text-[11px] text-orange-600">
                                      Ten en cuenta que el nombre del curso debe seguir los estándares de la institución.
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm text-slate-500">
                                  ({cursosDelGrado.length} curso{cursosDelGrado.length !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <button
                                onClick={() => agregarCurso(grado.id)}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Curso
                              </button>
                            </div>

                            {cursosExistentes.length > 0 && (
                              <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                                <div className="text-xs font-semibold uppercase text-blue-700">
                                  Cursos ya creados
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {cursosExistentes.map((curso: any) => (
                                    <span
                                      key={curso.id}
                                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200"
                                    >
                                      {curso.nombre}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {cursosDelGrado.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {cursosDelGrado.map((curso) => {
                                  return (
                                  <div
                                    key={curso.id}
                                    className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
                                  >
                                    <input
                                      type="text"
                                      value={curso.nombre}
                                      onChange={(e) => editarNombreCurso(curso.id, e.target.value)}
                                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900"
                                      placeholder={ejemploCurso}
                                    />
                                    <button
                                      onClick={() => eliminarCurso(curso.id)}
                                      className="text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de guardar */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                    <p className="text-sm text-blue-700">
                      Guarda los grados predeterminados y los cursos creados en la base de datos
                    </p>
                  </div>
                  <button
                    onClick={() => setMostrarResumen(true)}
                    disabled={saving || cursos.length === 0}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ver Resumen y Guardar
                      </>
                    )}
                  </button>
                </div>
                {cursos.length === 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    💡 Agrega al menos un curso para poder guardar
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Modal de Resumen */}
          {mostrarResumen && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-green-600 text-white px-6 py-4">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold break-words">📋 Resumen - Grados y Cursos</h2>
                      <p className="text-green-100 text-sm mt-1">
                        Revisa los datos antes de guardar
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarResumen(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  {/* Resumen de Grados */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Grados que se guardarán
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gradosPredeterminados.filter(grado => 
                          cursos.some(curso => curso.gradoId === grado.id)
                        ).map((grado) => (
                          <div key={grado.id} className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <div>
                              <span className="font-medium text-slate-900">{grado.nombre}</span>
                              <span className="text-sm text-slate-600 ml-2">({grado.nivel})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Cursos */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Cursos que se guardarán
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="space-y-3">
                        {Object.entries(gradosPorNivel).map(([nivel, grados]) => {
                          const gradosConCursosNivel = grados.filter(g => 
                            cursos.some(curso => curso.gradoId === g.id)
                          );
                          if (gradosConCursosNivel.length === 0) return null;
                          
                          return (
                            <div key={nivel} className="border-b border-blue-200 pb-3 last:border-b-0 last:pb-0">
                              <h4 className="font-medium text-blue-900 mb-2">{nivel}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {gradosConCursosNivel.map((grado) => {
                                  const cursosDelGrado = cursos.filter(c => c.gradoId === grado.id);
                                  return (
                                    <div key={grado.id} className="text-sm">
                                      <span className="font-medium text-slate-700">{grado.nombre}:</span>
                                      <div className="ml-2 mt-1">
                                        {cursosDelGrado.map((curso, index) => (
                                          <div key={curso.id} className="text-slate-600">
                                            • {curso.nombre}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {gradosPredeterminados.filter(grado => 
                            cursos.some(curso => curso.gradoId === grado.id)
                          ).length}
                        </div>
                        <div className="text-sm text-slate-600">Grados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{cursos.length}</div>
                        <div className="text-sm text-slate-600">Cursos</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => setMostrarResumen(false)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveGradosYCursos}
                      disabled={saving}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          ✅ Confirmar y Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Resumen para Áreas y Materias */}
          {mostrarResumenAreas && (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-purple-600 text-white px-6 py-4">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold break-words">📚 Resumen - Áreas y Materias</h2>
                      <p className="text-purple-100 text-sm mt-1">
                        Revisa las áreas, materias y asignaciones antes de guardar
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarResumenAreas(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh]">
                  {/* Resumen de Áreas */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                      Áreas Activas ({areasActivas.length})
                    </h3>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {areasActivas.map((areaId) => {
                          const area = areasPredeterminadas.find(a => a.id === areaId);
                          return (
                            <div key={areaId} className="flex items-start gap-2 min-w-0">
                              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                              <div className="min-w-0">
                                <span className="font-medium text-slate-900 break-words">{area?.nombre}</span>
                                {area?.es_opcional && (
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded ml-2">
                                    Opcional
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Materias */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Materias Creadas ({materias.length})
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="space-y-3">
                        {areasActivas.map((areaId) => {
                          const area = areasPredeterminadas.find(a => a.id === areaId);
                          const materiasDelArea = materias.filter(m => m.areaId === areaId);
                          
                          if (materiasDelArea.length === 0) return null;
                          
                          return (
                            <div key={areaId} className="border-b border-blue-200 pb-3 last:border-b-0 last:pb-0">
                              <h4 className="font-medium text-blue-900 mb-2">{area?.nombre}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {materiasDelArea.map((materia) => (
                                  <div key={materia.id} className="text-sm text-slate-600">
                                    • {materia.nombre}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Asignaciones */}
                  {materiasPorCurso.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                        Asignaciones a Grados ({materiasPorCurso.length})
                      </h3>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="space-y-3">
                          {gradosCargados.map((grado) => {
                            const asignacionesDelGrado = materiasPorCurso.filter(mc => mc.gradoId === grado.id);
                            if (asignacionesDelGrado.length === 0) return null;
                            
                            return (
                              <div key={grado.id} className="border-b border-green-200 pb-3 last:border-b-0 last:pb-0">
                                <h4 className="font-medium text-green-900 mb-2">{grado.nombre}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {asignacionesDelGrado.map((asignacion) => {
                                    const materia = materias.find(m => m.id === asignacion.materiaId);
                                    return (
                                      <div key={asignacion.materiaId} className="text-sm text-slate-600">
                                        • {materia?.nombre}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Estadísticas */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{areasActivas.length}</div>
                        <div className="text-sm text-slate-600">Áreas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{materias.length}</div>
                        <div className="text-sm text-slate-600">Materias</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{materiasPorCurso.length}</div>
                        <div className="text-sm text-slate-600">Asignaciones</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-600">{gradosCargados.length}</div>
                        <div className="text-sm text-slate-600">Grados</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => setMostrarResumenAreas(false)}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveAreasYMaterias}
                      disabled={saving}
                      className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          ✅ Confirmar y Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 2: Áreas y Materias
              </h3>
              <p className="text-slate-600">
                  Activa las áreas que necesitas y crea las materias específicas para cada una.
                </p>
              </div>

              {/* Resumen de Grados Cargados */}
              {cargandoGrados ? (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <svg className="animate-spin w-5 h-5 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-700">Cargando grados desde la base de datos...</span>
                  </div>
                </div>
              ) : gradosCargados.length > 0 ? (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Grados Disponibles ({gradosCargados.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {gradosCargados.map((grado) => (
                      <div key={grado.id} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="font-medium text-slate-900">{grado.nombre}</div>
                        <div className="text-sm text-slate-600">
                          {grado.cursos.length} curso{grado.cursos.length !== 1 ? 's' : ''}
                        </div>
                        <div className="mt-2 space-y-1">
                          {grado.cursos.length === 0 ? (
                            <span className="text-xs text-slate-500">Sin cursos registrados</span>
                          ) : (
                            grado.cursos.map((curso: any) => (
                              <div
                                key={curso.id}
                                className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded border border-slate-200 px-2 py-1"
                              >
                                <span>{curso.nombre}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCursoParaEliminar({
                                      cursoId: curso.id,
                                      gradoId: grado.id,
                                      nombre: curso.nombre
                                    })
                                  }
                                  className="text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                  aria-label={`Eliminar curso ${curso.nombre}`}
                                  title="Eliminar curso"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-amber-700">No se encontraron grados. Asegúrate de completar el Paso 1 primero.</span>
                  </div>
                </div>
              )}

              {/* Sección 1: Activar/Desactivar Áreas */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  2.1 Seleccionar Áreas
                </h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {areasPredeterminadas.map((area) => (
                      <div
                        key={area.id}
                        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg border transition-colors ${
                          areasActivas.includes(area.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-slate-900 break-words">
                              {area.nombre}
                            </span>
                            {area.es_opcional && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded shrink-0">
                                Opcional
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (areasActivas.includes(area.id)) {
                              setAreasActivas(areasActivas.filter(id => id !== area.id));
                              // Eliminar materias de esta área
                              setMaterias(materias.filter(m => m.areaId !== area.id));
                            } else {
                              setAreasActivas([...areasActivas, area.id]);
                            }
                          }}
                          className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                            areasActivas.includes(area.id)
                              ? 'bg-blue-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              areasActivas.includes(area.id)
                                ? 'translate-x-6'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sección 2: Crear Materias */}
              {areasActivas.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    2.2 Crear Materias por Área
                  </h4>
                  <div className="space-y-4">
                    {areasActivas.map((areaId) => {
                      const area = areasPredeterminadas.find(a => a.id === areaId);
                      const materiasDelArea = materias.filter(m => m.areaId === areaId);
                      
                      return (
                        <div key={areaId} className="bg-white rounded-lg p-4 border border-slate-200">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <h5 className="font-semibold text-slate-900 break-words">
                                {area?.nombre}
                              </h5>
                              <div className="relative group ml-2">
                                <button
                                  type="button"
                                  aria-label={`Ejemplo de materias para ${area?.nombre}`}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 8a1 1 0 112 0v5a1 1 0 11-2 0V8zm1-4a1.25 1.25 0 110 2.5A1.25 1.25 0 0110 4z" />
                                  </svg>
                                </button>
                                <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <div className="font-semibold text-slate-700">Ejemplos:</div>
                                  {(ejemplosMateriasPorArea[area?.id || 0] || ['Materia A', 'Materia B', 'Materia C'])
                                    .slice(0, 3)
                                    .map((ejemplo) => (
                                      <div key={ejemplo}>{ejemplo}</div>
                                    ))}
                                  <div className="mt-2 text-[11px] text-orange-600">
                                    Ten en cuenta que el nombre de la materia debe seguir los estándares de la institución.
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const nuevaMateria: Materia = {
                                  id: `temp-${Date.now()}`,
                                  nombre: 'Nueva Materia',
                                  areaId: areaId
                                };
                                setMaterias([...materias, nuevaMateria]);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Agregar Materia
                            </button>
                          </div>
                          
                          {materiasDelArea.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {materiasDelArea.map((materia) => (
                                <div
                                  key={materia.id}
                                  className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
                                >
                                  <input
                                    type="text"
                                    value={materia.nombre}
                                    onChange={(e) => {
                                      setMaterias(materias.map(m => 
                                        m.id === materia.id 
                                          ? { ...m, nombre: e.target.value }
                                          : m
                                      ));
                                    }}
                                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900"
                                  />
                                  <button
                                    onClick={() => {
                                      setMaterias(materias.filter(m => m.id !== materia.id));
                                    }}
                                    className="text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección 3: Asignar Materias a Grados */}
              {areasActivas.length > 0 && materias.length > 0 && gradosCargados.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    2.3 Asignar Materias a Grados
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-4">
                      Selecciona qué materias se imparten en cada grado. Esto definirá el plan de estudios.
                    </p>
                    
                    <div className="space-y-4">
                      {gradosCargados.map((grado) => (
                        <div key={grado.id} className="bg-white rounded-lg p-4 border border-slate-200">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h5 className="font-semibold text-slate-900 break-words">
                              {grado.nombre}
                            </h5>
                            <span className="text-sm text-slate-500">
                              {grado.cursos.length} curso{grado.cursos.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {materias.map((materia) => {
                              const isAsignada = materiasPorCurso.some(mc => 
                                mc.materiaId === materia.id && mc.gradoId === grado.id
                              );
                              
                              return (
                                <label
                                  key={materia.id}
                                  className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                    isAsignada
                                      ? 'bg-blue-50 border-blue-200'
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isAsignada}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        // Agregar asignación
                                        const nuevaAsignacion = {
                                          materiaId: materia.id,
                                          gradoId: grado.id
                                        };
                                        setMateriasPorCurso([...materiasPorCurso, nuevaAsignacion]);
                                      } else {
                                        // Eliminar asignación
                                        setMateriasPorCurso(materiasPorCurso.filter(mc => 
                                          !(mc.materiaId === materia.id && mc.gradoId === grado.id)
                                        ));
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm font-medium text-slate-900">
                                    {materia.nombre}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de guardar */}
              {areasActivas.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                      <p className="text-sm text-blue-700">
                        Guarda las áreas activas, materias y asignaciones a grados
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarResumenAreas(true)}
                      disabled={saving || materias.length === 0}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ver Resumen y Guardar
                    </button>
                  </div>
                  {materias.length === 0 && (
                    <p className="text-sm text-blue-600 mt-2">
                      💡 Crea al menos una materia para poder guardar
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 3: Creación de Docentes
              </h3>
              <p className="text-slate-600">
                  Crea los docentes y asígnalos a las materias correspondientes
              </p>
            </div>

              {/* Formulario de creación de docente con acordeón */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  📝 Información del Docente
                </h4>

                {/* Acordeón de secciones */}
                <div className="space-y-4">
                  {/* Sección 1: Datos Personales */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('datos')}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        seccionActiva === 'datos' 
                          ? 'bg-blue-50 text-blue-900' 
                          : seccionesCompletadas.datos 
                            ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {seccionesCompletadas.datos ? '✅' : seccionActiva === 'datos' ? '📋' : '⏳'}
                        </span>
                        <span className="font-medium">Datos Personales</span>
                        {seccionesCompletadas.datos && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'datos' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'datos' && (
                      <div className="p-4 border-t border-slate-200">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      value={docenteActual.nombres}
                      onChange={(e) => {
                        setDocenteActual(prev => ({ ...prev, nombres: e.target.value }));
                        validarCampo('nombres', e.target.value);
                      }}
                      disabled={!camposHabilitados.nombres}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacion.nombres ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.nombres ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Ingresa los nombres"
                    />
                    {erroresValidacion.nombres && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.nombres}</p>
                    )}
                    {camposValidados.nombres && !erroresValidacion.nombres && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Nombres válidos
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={docenteActual.apellidos}
                      onChange={(e) => {
                        setDocenteActual(prev => ({ ...prev, apellidos: e.target.value }));
                        validarCampo('apellidos', e.target.value);
                      }}
                      disabled={!camposHabilitados.apellidos}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacion.apellidos ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.apellidos ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Ingresa los apellidos"
                    />
                    {erroresValidacion.apellidos && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.apellidos}</p>
                    )}
                    {camposValidados.apellidos && !erroresValidacion.apellidos && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Apellidos válidos
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono Celular * (con indicativo de país)
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="CO"
                      countries={COUNTRY_OPTIONS_ORDER}
                      labels={es}
                      placeholder="Ej: 300 123 4567"
                      value={docenteActual.telefono || undefined}
                      onChange={(value) => {
                        const val = value || '';
                        setDocenteActual(prev => ({ ...prev, telefono: val }));
                        validarCampo('telefono', val);
                      }}
                      disabled={!camposHabilitados.telefono}
                      className={`w-full ${!camposHabilitados.telefono ? 'PhoneInput--disabled' : ''} ${
                        docenteActual.telefono && !isPhoneValidDocente(docenteActual.telefono) ? 'PhoneInput--error' : ''
                      }`}
                      numberInputProps={{
                        className: `flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 min-w-0 ${
                          !camposHabilitados.telefono
                            ? 'border-slate-200 bg-gray-100 cursor-not-allowed'
                            : docenteActual.telefono && !isPhoneValidDocente(docenteActual.telefono)
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : camposValidados.telefono
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-slate-300'
                        }`,
                        disabled: !camposHabilitados.telefono,
                        'aria-label': 'Teléfono celular',
                      }}
                    />
                    {erroresValidacion.telefono && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.telefono}</p>
                    )}
                    {camposValidados.telefono && !erroresValidacion.telefono && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Teléfono válido
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="email"
                        value={docenteActual.email}
                        onChange={(e) => {
                          setDocenteActual(prev => ({ ...prev, email: e.target.value }));
                          validarCampo('email', e.target.value);
                        }}
                        disabled={!camposHabilitados.email}
                        className={`flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                          erroresValidacion.email ? 'border-red-500' : 'border-slate-300'
                        } ${!camposHabilitados.email ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="correo@ejemplo.com"
                      />
                      <button
                        type="button"
                        onClick={verificarEmailManual}
                        disabled={!camposValidados.email || verificandoEmail}
                        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          camposValidados.email && !verificandoEmail
                            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {verificandoEmail ? (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verificando...
                          </div>
                        ) : (
                          'Verificar'
                        )}
                      </button>
                    </div>
                    {erroresValidacion.email && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacion.email}</p>
                    )}
                    {verificandoEmail && (
                      <p className="text-blue-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Comprobando email...
                      </p>
                    )}
                    {emailVerificado && !erroresValidacion.email && !verificandoEmail && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Email verificado y disponible
                      </p>
                    )}
                    {camposValidados.email && !emailVerificado && !erroresValidacion.email && !verificandoEmail && (
                      <p className="text-amber-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Email válido. Haz clic en &quot;Verificar&quot; para comprobar disponibilidad
                      </p>
                    )}
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        value={docenteActual.password}
                        onChange={(e) => {
                          setDocenteActual(prev => ({ ...prev, password: e.target.value }));
                          validarCampo('password', e.target.value);
                        }}
                        disabled={!campoPasswordHabilitado()}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                          erroresValidacion.password ? 'border-red-500' : 'border-slate-300'
                        } ${!campoPasswordHabilitado() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        disabled={!botonesPasswordHabilitados()}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed"
                      >
                        {mostrarPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generarPassword}
                      disabled={!botonesPasswordHabilitados()}
                      className={`w-full sm:w-auto px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                        botonesPasswordHabilitados()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      🎲 Generar
                    </button>
                  </div>
                  {erroresValidacion.password && (
                    <p className="text-red-500 text-xs mt-1">{erroresValidacion.password}</p>
                  )}
                  {camposValidados.password && !erroresValidacion.password && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Contraseña válida
                    </p>
                  )}
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    {(() => {
                      const reqs = getPasswordRequirementsDocente(docenteActual.password);
                      const item = (ok: boolean, label: string) => (
                        <p key={label} className={ok ? 'text-green-600' : 'text-slate-500'}>
                          {ok ? '✓' : '•'} {label}
                        </p>
                      );
                      return (
                        <>
                          {item(reqs.length, 'Al menos 8 caracteres')}
                          {item(reqs.upper, 'Una letra mayúscula')}
                          {item(reqs.lower, 'Una letra minúscula')}
                          {item(reqs.number, 'Un número')}
                          {item(reqs.symbol, 'Un símbolo (@$!%*?&)')}
                        </>
                      );
                    })()}
                  </div>
                </div>

                        {/* Información de sede */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-blue-900 mb-2">🏢 Asignación Institucional</h5>
                          <p className="text-sm text-blue-700">
                            El docente será asignado automáticamente a la misma sede del administrador
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección 2: Grados y Cursos */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('grados')}
                      disabled={!seccionesHabilitadas.grados}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        !seccionesHabilitadas.grados
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : seccionActiva === 'grados' 
                            ? 'bg-blue-50 text-blue-900' 
                            : seccionesCompletadas.grados 
                              ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.grados ? '🔒' : seccionesCompletadas.grados ? '✅' : seccionActiva === 'grados' ? '📚' : '⏳'}
                        </span>
                        <span className="font-medium">Grados y Cursos</span>
                        {seccionesCompletadas.grados && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.grados && (
                          <span className="text-sm text-gray-500">Completa datos personales primero</span>
                        )}
                        {seccionesHabilitadas.grados && !seccionesCompletadas.grados && gradosSeleccionados.length > 0 && (
                          <span className="text-sm text-yellow-600">Selecciona al menos un curso por grado</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'grados' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'grados' && seccionesHabilitadas.grados && (
                      <div className="p-4 border-t border-slate-200">

                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-green-900 mb-3">📚 Grados y Cursos</h5>
                          <p className="text-sm text-green-700 mb-4">
                            Selecciona las combinaciones grado-curso donde enseñará este docente
                          </p>
                  
                  {gradosCargados.length > 0 ? (
                    <div className="space-y-3">
                      {gradosCargados.map((grado) => (
                        <div key={grado.id} className="border border-green-200 rounded-lg p-3">
                          <div className="mb-3">
                            <span className="font-medium text-green-900">
                              {grado.nombre} - {grado.nivel}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-green-700">Cursos disponibles:</p>
                            {grado.cursos.map((curso: any) => {
                              const isSelected = asignacionesGradoCurso.some(a => a.gradoId === grado.id && a.cursoId === curso.id);
                              return (
                                <div key={curso.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2 border border-green-100 rounded">
                                  <label className="flex items-center min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          agregarGradoCurso(grado.id, curso.id);
                                        } else {
                                          eliminarGradoCurso(grado.id, curso.id);
                                        }
                                      }}
                                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded mr-3"
                                    />
                                    <span className="text-sm text-green-800 break-words">
                                      {curso.nombre}
                                    </span>
                                  </label>
                                  {isSelected && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded self-start sm:self-auto">
                                      Seleccionado
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600">
                      Cargando grados disponibles...
                    </p>
                  )}
                          
                          {/* Resumen de selecciones */}
                          {asignacionesGradoCurso.length > 0 && (
                            <div className="mt-4 bg-white border border-green-200 rounded-lg p-4">
                              <h6 className="font-medium text-green-900 mb-2">✅ Asignaciones seleccionadas:</h6>
                              <div className="space-y-1">
                                {asignacionesGradoCurso.map((asignacion, index) => (
                                  <div key={index} className="text-sm text-green-700 flex items-center justify-between">
                                    <span>{asignacion.gradoNombre} - {asignacion.cursoNombre}</span>
                                    <button
                                      onClick={() => eliminarGradoCurso(asignacion.gradoId, asignacion.cursoId)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección 3: Áreas y Materias */}
                  <div className="border border-slate-200 rounded-lg">
                    <button
                      onClick={() => cambiarSeccion('materias')}
                      disabled={!seccionesHabilitadas.materias}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                        !seccionesHabilitadas.materias
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : seccionActiva === 'materias' 
                            ? 'bg-blue-50 text-blue-900' 
                            : seccionesCompletadas.materias 
                              ? 'bg-green-50 text-green-900 hover:bg-green-100' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.materias ? '🔒' : seccionesCompletadas.materias ? '✅' : seccionActiva === 'materias' ? '🔬' : '⏳'}
                        </span>
                        <span className="font-medium">Áreas y Materias</span>
                        {seccionesCompletadas.materias && (
                          <span className="text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.materias && (
                          <span className="text-sm text-gray-500">Completa grados y cursos primero</span>
                        )}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform ${seccionActiva === 'materias' ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {seccionActiva === 'materias' && seccionesHabilitadas.materias && (
                      <div className="p-4 border-t border-slate-200">
                        <div className="bg-purple-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-purple-900 mb-3">🔬 Materias por Grado-Curso</h5>
                          <p className="text-sm text-purple-700 mb-4">
                            Selecciona las materias específicas que enseñará este docente en cada grado-curso
                          </p>
                  
                          {cargandoAreasMaterias ? (
                            <p className="text-sm text-purple-600">
                              Cargando materias disponibles...
                            </p>
                          ) : asignacionesGradoCurso.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm text-yellow-700">
                                ⚠️ Primero selecciona los grados y cursos en la sección anterior
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {asignacionesGradoCurso.map((asignacion, index) => {
                                const grado = gradosCargados.find(g => g.id === asignacion.gradoId);
                                const materiasDelGrado = materiasPorGrado[asignacion.gradoId] || [];
                                
                                return (
                                  <div key={index} className="border border-purple-200 rounded-lg p-4">
                                    <h6 className="font-semibold text-purple-900 mb-3 flex items-center">
                                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                                      🎯 {asignacion.gradoNombre} - {asignacion.cursoNombre}
                                    </h6>
                                    
                                    {materiasDelGrado.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {materiasDelGrado.map((materia) => (
                                          <label key={`${asignacion.gradoId}-${asignacion.cursoId}-${materia.id}`} className="flex items-center p-2 hover:bg-purple-50 rounded">
                                            <input
                                              type="checkbox"
                                              checked={asignacion.materiasSeleccionadas.includes(materia.id)}
                                              onChange={(e) => handleMateriaGradoCurso(asignacion.gradoId, asignacion.cursoId, materia.id, e.target.checked)}
                                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-purple-800">
                                              {materia.nombre}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-purple-600 italic">
                                        No hay materias asignadas a este grado
                                      </p>
                                    )}
                                    
                                    {/* Resumen de materias seleccionadas para este grado-curso */}
                                    {asignacion.materiasSeleccionadas.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-purple-100">
                                        <p className="text-xs text-purple-600 mb-2">Materias seleccionadas:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {asignacion.materiasSeleccionadas.map(materiaId => {
                                            const materia = materiasDelGrado.find(m => m.id === materiaId);
                                            return materia ? (
                                              <span key={materiaId} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                {materia.nombre}
                                              </span>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resumen de Asignaciones */}
                  {(gradosSeleccionados.length > 0 || areasSeleccionadas.length > 0) && (
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-slate-900 mb-3">📋 Resumen de Asignaciones</h5>
                
                {gradosSeleccionados.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Grados y Cursos:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {gradosSeleccionados.map(gradoId => {
                        const grado = gradosCargados.find(g => g.id === gradoId);
                        const cursos = cursosPorGrado[gradoId] || [];
                        return (
                          <li key={gradoId} className="ml-4">
                            • {grado?.nombre}: {cursos.length > 0 ? cursos.map(cursoId => {
                              const curso = grado?.cursos.find((c: any) => c.id === cursoId);
                              return curso?.nombre;
                            }).join(', ') : 'Sin cursos seleccionados'}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {Object.keys(materiasPorArea).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Materias por Grado:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {Object.entries(materiasPorArea).map(([gradoId, materias]) => {
                        const grado = gradosCargados.find(g => g.id === parseInt(gradoId));
                        if (materias.length === 0) return null;
                        
                        return (
                          <li key={gradoId} className="ml-4">
                            • {grado?.nombre}: {materias.map(materiaId => {
                              const materia = materiasFiltradas.find(m => m.id === materiaId);
                              return materia?.nombre;
                            }).join(', ')}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
              <button
                onClick={limpiarFormularioDocente}
                className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-left sm:text-center"
              >
                Limpiar formulario
              </button>
              <button
                onClick={handleAgregarDocente}
                disabled={Object.keys(erroresValidacion).length > 0}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  Object.keys(erroresValidacion).length > 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Docente
              </button>
            </div>
          </div>
        </div>

        {/* Lista de docentes creados */}
        {docentes.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">
              👥 Docentes Creados ({docentes.length})
            </h4>
            <div className="space-y-3">
              {docentes.map((docente) => {
                const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                const isExpanded = asignacionesExpandidas[docente.id] || false;
                const totalAsignaciones = asignaciones.asignaciones.length;
                const totalMaterias = asignaciones.asignaciones.reduce((sum, a) => sum + a.materiasSeleccionadas.length, 0);
                
                return (
                  <div key={docente.id} className="bg-slate-50 rounded-lg border border-slate-200 relative">
                    {/* Información básica del docente */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 pr-12">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-slate-900 break-words">
                          {docente.nombres} {docente.apellidos}
                        </h5>
                        <p className="text-sm text-slate-600 break-words">{docente.email}</p>
                        {totalAsignaciones > 0 && (
                          <p className="text-xs text-slate-500 mt-1 break-words">
                            {totalAsignaciones} asignacion{totalAsignaciones !== 1 ? 'es' : ''} • {totalMaterias} materia{totalMaterias !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
                        {/* Botón Ver Asignaciones */}
                        {totalAsignaciones > 0 && (
                          <button
                            onClick={() => toggleAsignaciones(docente.id)}
                            className="w-full sm:w-auto flex items-center justify-center space-x-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                          >
                            <span>{isExpanded ? 'Ocultar' : 'Ver'} asignaciones</span>
                            <svg 
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Estado */}
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Activo
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => eliminarDocente(docente.id)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 transition-colors"
                      title="Eliminar docente"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    {/* Asignaciones expandibles */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 bg-white">
                        {totalAsignaciones > 0 ? (
                          <div className="space-y-3">
                            <h6 className="text-sm font-medium text-slate-700 mb-3">📚 Asignaciones detalladas:</h6>
                            {asignaciones.asignaciones.map((asignacion, index) => (
                              <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-slate-800">
                                    {asignacion.gradoNombre} - {asignacion.cursoNombre}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {asignacion.materiasSeleccionadas.length} materia{asignacion.materiasSeleccionadas.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                {/* Materias asignadas */}
                                {asignacion.materiasSeleccionadas.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {asignacion.materiasSeleccionadas.map((materiaId) => {
                                      const { materiaNombre, areaNombre } = obtenerDatosMateriaYArea(materiaId);
                                      return (
                                        <span key={materiaId} className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                          <span className="font-medium">{materiaNombre}</span>
                                          <span className="ml-1 text-purple-600">({areaNombre})</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic text-center py-4">
                            Sin asignaciones
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón para continuar */}
        {docentes.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-green-900">Listo para continuar</h4>
                <p className="text-sm text-green-700">
                  {docentes.length} docente{docentes.length !== 1 ? 's' : ''} creado{docentes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={mostrarConfirmacion}
                disabled={saving}
                className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
                  saving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardar Docentes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Paso 4: Creación de Estudiantes
                </h3>
                <p className="text-slate-600">
                  Crea los estudiantes y asígnalos a los grados y cursos correspondientes
                </p>
              </div>

              {/* Formulario de Estudiante */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Agregar Estudiante
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombres del Estudiante *
                    </label>
                    <input
                      type="text"
                      value={estudianteActual.nombres}
                      onChange={(e) => {
                        setEstudianteActual(prev => ({ ...prev, nombres: e.target.value }));
                        validarCampoEstudiante('nombres', e.target.value);
                      }}
                      disabled={!camposHabilitadosEstudiante.nombres}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.nombres ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.nombres ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Ingresa los nombres"
                    />
                    {erroresValidacionEstudiante.nombres && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.nombres}</p>
                    )}
                    {camposValidadosEstudiante.nombres && !erroresValidacionEstudiante.nombres && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Apellidos del Estudiante *
                    </label>
                    <input
                      type="text"
                      value={estudianteActual.apellidos}
                      onChange={(e) => {
                        setEstudianteActual(prev => ({ ...prev, apellidos: e.target.value }));
                        validarCampoEstudiante('apellidos', e.target.value);
                      }}
                      disabled={!camposHabilitadosEstudiante.apellidos}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.apellidos ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.apellidos ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Ingresa los apellidos"
                    />
                    {erroresValidacionEstudiante.apellidos && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.apellidos}</p>
                    )}
                    {camposValidadosEstudiante.apellidos && !erroresValidacionEstudiante.apellidos && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Código del Estudiante */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Código del Estudiante *
                    </label>
                    <input
                      type="text"
                      value={estudianteActual.codigo_estudiantil}
                      onChange={(e) => {
                        setEstudianteActual(prev => ({ ...prev, codigo_estudiantil: e.target.value }));
                        validarCampoEstudiante('codigo_estudiantil', e.target.value);
                      }}
                      disabled={!camposHabilitadosEstudiante.codigo_estudiantil}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.codigo_estudiantil ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.codigo_estudiantil ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Ej: EST001"
                    />
                    {erroresValidacionEstudiante.codigo_estudiantil && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.codigo_estudiantil}</p>
                    )}
                    {camposValidadosEstudiante.codigo_estudiantil && !erroresValidacionEstudiante.codigo_estudiantil && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Nombre del Acudiente */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre del Acudiente *
                    </label>
                    <input
                      type="text"
                      value={estudianteActual.nombre_acudiente}
                      onChange={(e) => {
                        setEstudianteActual(prev => ({ ...prev, nombre_acudiente: e.target.value }));
                        validarCampoEstudiante('nombre_acudiente', e.target.value);
                      }}
                      disabled={!camposHabilitadosEstudiante.nombre_acudiente}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.nombre_acudiente ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.nombre_acudiente ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Nombre completo del acudiente"
                    />
                    {erroresValidacionEstudiante.nombre_acudiente && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.nombre_acudiente}</p>
                    )}
                    {camposValidadosEstudiante.nombre_acudiente && !erroresValidacionEstudiante.nombre_acudiente && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Correo del Acudiente */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correo del Acudiente *
                    </label>
                    <input
                      type="email"
                      value={estudianteActual.correo_acudiente}
                      onChange={(e) => {
                        setEstudianteActual(prev => ({ ...prev, correo_acudiente: e.target.value }));
                        validarCampoEstudiante('correo_acudiente', e.target.value);
                      }}
                      disabled={!camposHabilitadosEstudiante.correo_acudiente}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.correo_acudiente ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.correo_acudiente ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="correo@ejemplo.com"
                    />
                    {erroresValidacionEstudiante.correo_acudiente && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.correo_acudiente}</p>
                    )}
                    {camposValidadosEstudiante.correo_acudiente && !erroresValidacionEstudiante.correo_acudiente && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Teléfono del Acudiente */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono del Acudiente * (con indicativo de país)
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="CO"
                      countries={COUNTRY_OPTIONS_ORDER}
                      labels={es}
                      placeholder="Ej: 300 123 4567"
                      value={estudianteActual.telefono_acudiente || undefined}
                      onChange={(value) => {
                        const val = value || '';
                        setEstudianteActual(prev => ({ ...prev, telefono_acudiente: val }));
                        validarCampoEstudiante('telefono_acudiente', val);
                      }}
                      disabled={!camposHabilitadosEstudiante.telefono_acudiente}
                      className={`w-full ${!camposHabilitadosEstudiante.telefono_acudiente ? 'PhoneInput--disabled' : ''} ${
                        estudianteActual.telefono_acudiente && !isPhoneValidDocente(estudianteActual.telefono_acudiente) ? 'PhoneInput--error' : ''
                      }`}
                      numberInputProps={{
                        className: `flex-1 px-4 py-2.5 text-sm border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 min-w-0 ${
                          !camposHabilitadosEstudiante.telefono_acudiente
                            ? 'border-slate-200 bg-gray-100 cursor-not-allowed'
                            : estudianteActual.telefono_acudiente && !isPhoneValidDocente(estudianteActual.telefono_acudiente)
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : camposValidadosEstudiante.telefono_acudiente
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-slate-300'
                        }`,
                        disabled: !camposHabilitadosEstudiante.telefono_acudiente,
                        'aria-label': 'Teléfono del acudiente',
                      }}
                    />
                    {erroresValidacionEstudiante.telefono_acudiente && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.telefono_acudiente}</p>
                    )}
                    {camposValidadosEstudiante.telefono_acudiente && !erroresValidacionEstudiante.telefono_acudiente && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Grado */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Grado *
                    </label>
                    <select
                      value={estudianteActual.grado_id}
                      onChange={(e) => {
                        const gradoId = parseInt(e.target.value);
                        setEstudianteActual(prev => ({ ...prev, grado_id: gradoId, curso_id: 0 }));
                        validarCampoEstudiante('grado_id', gradoId);
                      }}
                      disabled={!camposHabilitadosEstudiante.grado_id}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.grado_id ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.grado_id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value={0}>Selecciona un grado</option>
                      {gradosDisponibles.map((grado) => (
                        <option key={grado.id} value={grado.id}>
                          {grado.nombre} - {grado.nivel}
                        </option>
                      ))}
                    </select>
                    {erroresValidacionEstudiante.grado_id && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.grado_id}</p>
                    )}
                    {camposValidadosEstudiante.grado_id && !erroresValidacionEstudiante.grado_id && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>

                  {/* Curso */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Curso *
                    </label>
                    <select
                      value={estudianteActual.curso_id}
                      onChange={(e) => {
                        const cursoId = parseInt(e.target.value);
                        setEstudianteActual(prev => ({ ...prev, curso_id: cursoId }));
                        validarCampoEstudiante('curso_id', cursoId);
                      }}
                      disabled={!camposHabilitadosEstudiante.curso_id || cursosDisponibles.length === 0}
                      className={`w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-400 ${
                        erroresValidacionEstudiante.curso_id ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitadosEstudiante.curso_id || cursosDisponibles.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value={0}>
                        {cursosDisponibles.length === 0 ? 'Selecciona un grado primero' : 'Selecciona un curso'}
                      </option>
                      {cursosDisponibles.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nombre}
                        </option>
                      ))}
                    </select>
                    {erroresValidacionEstudiante.curso_id && (
                      <p className="text-red-500 text-xs mt-1">{erroresValidacionEstudiante.curso_id}</p>
                    )}
                    {camposValidadosEstudiante.curso_id && !erroresValidacionEstudiante.curso_id && (
                      <p className="text-green-600 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ✓ Válido
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-6">
                  <button
                    onClick={limpiarFormularioEstudiante}
                    className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-left sm:text-center"
                  >
                    Limpiar formulario
                  </button>
                  <button
                    onClick={handleAgregarEstudiante}
                    disabled={Object.keys(erroresValidacionEstudiante).length > 0}
                    className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors flex items-center justify-center ${
                      Object.keys(erroresValidacionEstudiante).length > 0
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Estudiante
                  </button>
                </div>
              </div>

              {/* Lista de Estudiantes */}
              {estudiantes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Estudiantes Agregados ({estudiantes.length})
                  </h4>
                  <div className="space-y-3">
                    {estudiantes.map((estudiante) => (
                      <div key={estudiante.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 break-words">
                                {estudiante.nombres} {estudiante.apellidos}
                              </p>
                              <p className="text-sm text-slate-600 break-words">
                                Código: {estudiante.codigo_estudiantil} | 
                                Acudiente: {estudiante.nombre_acudiente} | 
                                Tel: {estudiante.telefono_acudiente}
                              </p>
                              <p className="text-sm text-slate-500 break-words">
                                Grado: {gradosDisponibles.find(g => g.id === estudiante.grado_id)?.nombre || 'N/A'} | 
                                Curso: {todosLosCursos.find(c => c.id === estudiante.curso_id)?.nombre || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start sm:justify-end">
                          <button
                            onClick={() => eliminarEstudiante(estudiante.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para guardar estudiantes */}
              {estudiantes.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={guardarEstudiantes}
                    disabled={saving}
                    className={`px-8 py-3 rounded-lg transition-colors flex items-center text-lg font-medium ${
                      saving
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar {estudiantes.length} Estudiante{estudiantes.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  🎉 ¡Configuración Completada!
                </h3>
                <p className="text-slate-600">
                  Revisa el resumen de toda la configuración realizada para tu institución
                </p>
              </div>

              {/* Cards de Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Docentes */}
                <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Docentes</p>
                      <p className="text-3xl font-bold">{docentes.length}</p>
                    </div>
                    <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Estudiantes */}
                <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Estudiantes</p>
                      <p className="text-3xl font-bold">{estudiantes.length}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Materias */}
                <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Materias</p>
                      <p className="text-3xl font-bold">{materias.length}</p>
                    </div>
                    <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Total Grados */}
                <div className="bg-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Total Grados</p>
                      <p className="text-3xl font-bold">{gradosDisponibles.length}</p>
                    </div>
                    <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen Detallado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Resumen de Docentes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Docentes Registrados
                  </h4>
                  {docentes.length > 0 ? (
                    <div className="space-y-3">
                      {docentes.slice(0, 3).map((docente) => (
                        <div key={docente.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{docente.nombres} {docente.apellidos}</p>
                            <p className="text-sm text-slate-600">{docente.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-600 font-medium">
                              {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0)} asignaciones
                            </p>
                          </div>
                        </div>
                      ))}
                      {docentes.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">
                          ... y {docentes.length - 3} docente(s) más
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay docentes registrados</p>
                  )}
                </div>

                {/* Resumen de Estudiantes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Estudiantes Matriculados
                  </h4>
                  {estudiantes.length > 0 ? (
                    <div className="space-y-3">
                      {estudiantes.slice(0, 3).map((estudiante) => (
                        <div key={estudiante.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{estudiante.nombres} {estudiante.apellidos}</p>
                            <p className="text-sm text-slate-600">Código: {estudiante.codigo_estudiantil}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-600 font-medium">
                              Grado {gradosDisponibles.find(g => g.id === estudiante.grado_id)?.nombre || 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {estudiantes.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">
                          ... y {estudiantes.length - 3} estudiante(s) más
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No hay estudiantes matriculados</p>
                  )}
                </div>
              </div>

              {/* Estructura Académica */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Estructura Académica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradosDisponibles.slice(0, 6).map((grado) => (
                    <div key={grado.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-slate-900">{grado.nombre}</h5>
                      <p className="text-sm text-slate-600 mb-2">{grado.nivel}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Cursos: {grado.cursos?.length || 0}</span>
                        <span>Materias: {materiasGradosCargados.filter(mg => mg.grado_id === grado.id).length}</span>
                      </div>
                    </div>
                  ))}
                  {gradosDisponibles.length > 6 && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
                      <p className="text-sm text-slate-500">
                        +{gradosDisponibles.length - 6} grados más
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Volver a Editar
                </button>
                
                <button
                  onClick={() => {
                    // Limpiar todos los datos en caché
                    limpiarDatosCompletos();
                    
                    Swal.fire({
                      icon: 'success',
                      title: '¡Configuración completada!',
                      text: 'Tu institución está lista para comenzar a usar el sistema de agenda virtual.'
                    });
                    onClose();
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-base sm:text-lg font-medium"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Finalizar Configuración
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Anterior
              </button>
            ) : (
              <div className="w-full sm:w-auto sm:min-w-[100px]" aria-hidden="true" />
            )}

            <div className="text-sm text-slate-600 text-center">
              {currentStep === 0 ? 'Introducción' : `Paso ${currentStep} de 5`}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === 5}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 5
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === 5 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Guardado */}
      {mostrarConfirmacionGuardado && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold">Confirmar Guardado</h2>
                  <p className="text-blue-100 text-sm">¿Estás seguro de guardar los docentes?</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">📋 Resumen a guardar:</h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Docentes:</span>
                    <span className="font-medium">{docentes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asignaciones totales:</span>
                    <span className="font-medium">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Materias asignadas:</span>
                    <span className="font-medium">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Una vez guardados, los docentes recibirán un email con sus credenciales de acceso.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMostrarConfirmacionGuardado(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarDocentes}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                    saving
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar y Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminado - ya no se necesita */}
      {false && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Resumen - Docentes</h2>
              <button
                onClick={() => {}}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Estadísticas */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-green-700">
                      {docentes.length} docente{docentes.length !== 1 ? 's' : ''} a crear
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-blue-700">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0)} asignacion{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0) !== 1 ? 'es' : ''} total{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.length, 0) !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-purple-700">
                      {Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0)} materia{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0) !== 1 ? 's' : ''} asignada{Object.values(asignacionesPorDocente).reduce((total, asign) => total + asign.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0), 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug: Estado completo de asignaciones */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>DEBUG - Estado de asignacionesPorDocente:</strong>
              <pre>{JSON.stringify(asignacionesPorDocente, null, 2)}</pre>
            </div>

            {/* Tabla de docentes */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Docentes a crear:</h3>
              
              {/* Vista de tabla para todos los casos */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Docente
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Grado
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Curso
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Materia
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Área
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {docentes.flatMap((docente, docenteIndex) => {
                          const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                          
                          // Debug: Log de datos del docente
                          console.log(`=== DOCENTE ${docente.nombres} ${docente.apellidos} (ID: ${docente.id}) ===`);
                          console.log('Asignaciones completas:', asignaciones);
                          console.log('Total asignaciones:', asignaciones.asignaciones.length);
                          
                          // Crear filas para cada asignación del docente
                          const filas: React.ReactElement[] = [];
                          let isFirstRowForDocente = true;
                          
                          asignaciones.asignaciones.forEach((asignacion, asignacionIndex) => {
                            console.log(`  Asignación ${asignacionIndex}: ${asignacion.gradoNombre} - ${asignacion.cursoNombre}`);
                            console.log('    Materias:', asignacion.materiasSeleccionadas);
                            
                            asignacion.materiasSeleccionadas.forEach((materiaId: number, materiaIndex: number) => {
                              console.log(`      Materia ID ${materiaIndex}:`, materiaId);
                              const { materiaNombre, areaNombre } = obtenerDatosMateriaYArea(materiaId);
                              console.log(`      Materia: ${materiaNombre}, Área: ${areaNombre}`);
                              
                              // Mostrar datos del docente solo en la primera fila del primer docente
                              // Mostrar datos del grado-curso en la primera fila de cada asignación
                              const isFirstRowForThisDocenteGradoCurso = isFirstRowForDocente && materiaIndex === 0;
                              
                              console.log(`    RENDERIZANDO FILA - Docente: ${isFirstRowForDocente}, MateriaIndex: ${materiaIndex}, Combinado: ${isFirstRowForThisDocenteGradoCurso}`);
                              
                              filas.push(
                                <tr key={`${docente.id}-${asignacion.gradoId}-${asignacion.cursoId}-${materiaId}-${materiaIndex}`} 
                                    className={docenteIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                  <td className="px-4 py-3 text-sm">
                                    {isFirstRowForThisDocenteGradoCurso ? (
                                      <div>
                                        <div className="font-medium text-slate-900">{docente.nombres} {docente.apellidos}</div>
                                        <div className="text-slate-500 text-xs">{docente.email}</div>
                                      </div>
                                    ) : (
                                      <div className="text-slate-400 text-xs">↳</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900">
                                    {isFirstRowForThisDocenteGradoCurso ? asignacion.gradoNombre : ''}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-900">
                                    {isFirstRowForThisDocenteGradoCurso ? asignacion.cursoNombre : ''}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                      {materiaNombre}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-600">
                                    {areaNombre}
                                  </td>
                                </tr>
                              );
                              
                              // Solo cambiar isFirstRowForDocente después de la primera materia del primer docente
                              if (isFirstRowForDocente && asignacionIndex === 0 && materiaIndex === 0) {
                                isFirstRowForDocente = false;
                              }
                            });
                          });
                          
                          console.log(`Total filas generadas para ${docente.nombres}:`, filas.length);
                          return filas;
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Resumen de la tabla */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                      <span>
                        Total: {docentes.length} docente{docentes.length !== 1 ? 's' : ''} con asignaciones
                      </span>
                      <span>
                        {docentes.reduce((total, docente) => {
                          const asignaciones = asignacionesPorDocente[docente.id] || { asignaciones: [] };
                          return total + asignaciones.asignaciones.reduce((subtotal, a) => subtotal + a.materiasSeleccionadas.length, 0);
                        }, 0)} asignaciones totales
                      </span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {}}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {}}
                disabled={saving}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                  saving
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar y Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
