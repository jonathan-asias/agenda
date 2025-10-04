'use client';

import { useState, useEffect } from 'react';

interface SetupWizardProps {
  institucionId: number;
  onClose: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

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

interface AsignacionDocente {
  docenteId: number;
  materiaId: number;
  gradoId: number;
  cursoId: number;
}

export default function SetupWizard({ institucionId, onClose }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [cursos, setCursos] = useState<Curso[]>([]);
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
  const [cargandoGrados, setCargandoGrados] = useState(false);

  // Grados predeterminados
  const gradosPredeterminados = [
    { id: 1, nombre: 'PÁRVULOS', nivel: 'Educación Inicial', orden: 1 },
    { id: 2, nombre: 'PREKINDER', nivel: 'Educación Inicial', orden: 2 },
    { id: 3, nombre: 'KINDER', nivel: 'Educación Inicial', orden: 3 },
    { id: 4, nombre: '1°', nivel: 'Primaria', orden: 4 },
    { id: 5, nombre: '2°', nivel: 'Primaria', orden: 5 },
    { id: 6, nombre: '3°', nivel: 'Primaria', orden: 6 },
    { id: 7, nombre: '4°', nivel: 'Primaria', orden: 7 },
    { id: 8, nombre: '5°', nivel: 'Primaria', orden: 8 },
    { id: 9, nombre: '6°', nivel: 'Secundaria', orden: 9 },
    { id: 10, nombre: '7°', nivel: 'Secundaria', orden: 10 },
    { id: 11, nombre: '8°', nivel: 'Secundaria', orden: 11 },
    { id: 12, nombre: '9°', nivel: 'Secundaria', orden: 12 },
    { id: 13, nombre: '10°', nivel: 'Media', orden: 13 },
    { id: 14, nombre: '11°', nivel: 'Media', orden: 14 },
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

  // Agrupar grados por nivel
  const gradosPorNivel = gradosPredeterminados.reduce((acc, grado) => {
    if (!acc[grado.nivel]) {
      acc[grado.nivel] = [];
    }
    acc[grado.nivel].push(grado);
    return acc;
  }, {} as Record<string, typeof gradosPredeterminados>);

  const agregarCurso = (gradoId: number) => {
    const cursosDelGrado = cursos.filter(c => c.gradoId === gradoId);
    const siguienteLetra = String.fromCharCode(65 + cursosDelGrado.length); // A, B, C...
    
    const nuevoCurso: Curso = {
      id: `temp-${Date.now()}`,
      nombre: `Curso ${siguienteLetra}`,
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
      alert('Por favor ingresa un email válido primero');
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
        alert('❌ Este email ya está registrado. Por favor usa otro email.');
      } else {
        setErroresValidacion(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
        setEmailVerificado(true);
        // Habilitar el campo de contraseña cuando el email esté verificado
        setCamposHabilitados(prev => ({ ...prev, password: true }));
        alert('✅ Email disponible. Puedes continuar con la contraseña.');
      }
    } catch (error) {
      console.error('Error verificando email:', error);
      alert('❌ Error verificando email. Intenta nuevamente.');
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
        if (valor.trim() && !validarTelefonoColombiano(valor.trim())) {
          errores[campo] = 'Número de celular colombiano inválido';
          validados[campo] = false;
        } else if (valor.trim() && validarTelefonoColombiano(valor.trim())) {
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
      case 'password':
        if (valor && valor.length < 8) {
          errores[campo] = 'Mínimo 8 caracteres';
          validados[campo] = false;
        } else if (valor && valor.length >= 8) {
          delete errores[campo];
          validados[campo] = true;
        } else {
          delete errores[campo];
          validados[campo] = false;
        }
        break;
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

  // Función para agregar docente
  const handleAgregarDocente = () => {
    // Validaciones básicas
    if (!docenteActual.nombres.trim() || !docenteActual.apellidos.trim() || !docenteActual.telefono.trim() || !docenteActual.email.trim() || !docenteActual.password.trim()) {
      alert('❌ Por favor completa todos los campos');
      return;
    }

    // Validar nombres y apellidos (solo letras y espacios)
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nombreRegex.test(docenteActual.nombres.trim())) {
      alert('❌ Los nombres solo pueden contener letras y espacios');
      return;
    }
    if (!nombreRegex.test(docenteActual.apellidos.trim())) {
      alert('❌ Los apellidos solo pueden contener letras y espacios');
      return;
    }

    // Validar email
    if (!validarEmail(docenteActual.email.trim())) {
      alert('❌ Por favor ingresa un email válido');
      return;
    }

    // Validar teléfono celular colombiano
    if (!validarTelefonoColombiano(docenteActual.telefono.trim())) {
      alert('❌ Por favor ingresa un número de celular colombiano válido (10 dígitos empezando por 3)');
      return;
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (docenteActual.password.length < 8) {
      alert('❌ La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Verificar si el email ya existe en la lista local
    const emailExiste = docentes.some(d => d.email.toLowerCase() === docenteActual.email.trim().toLowerCase());
    if (emailExiste) {
      alert('❌ Ya existe un docente con este email en la lista actual');
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
    alert('✅ Docente agregado correctamente');
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
      alert('✅ Docente eliminado correctamente');
    }
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
      alert('❌ No hay docentes para guardar');
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
      
      for (let i = 0; i < docentes.length; i++) {
        const docente = docentes[i];
        
        console.log(`=== PROCESANDO DOCENTE ${i + 1}/${docentes.length} ===`);
        console.log('Docente:', docente);
        
        // Generar contraseña aleatoria
        const password = generarPasswordAleatoria();
        
        // Obtener asignaciones del docente desde las asignaciones guardadas
        const asignaciones = asignacionesPorDocente[docente.id] || {
          grados: [],
          cursos: {},
          materias: {}
        };
        
        console.log('Asignaciones para este docente:', asignaciones);
        
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
          alert(`❌ Error guardando ${docente.nombres} ${docente.apellidos}: ${responseData.error || responseData.details || 'Error desconocido'}`);
        }
      }
      
      // Resumir resultados
      const exitosos = resultados.filter(r => r.success).length;
      const fallidos = resultados.filter(r => !r.success).length;
      
      console.log('=== RESUMEN DE RESULTADOS ===');
      console.log('Exitosos:', exitosos);
      console.log('Fallidos:', fallidos);
      
      if (exitosos > 0) {
        alert(`✅ Se crearon ${exitosos} docente(s) exitosamente${fallidos > 0 ? ` (${fallidos} con errores)` : ''}`);
        // Avanzar al siguiente paso solo si se crearon docentes exitosamente
        setCurrentStep(4);
      } else {
        alert('❌ No se pudo crear ningún docente. Revisa los errores mostrados.');
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
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
            alert('✅ Áreas, materias y asignaciones guardadas correctamente!');
            console.log('Asignaciones guardadas:', asignacionesData);
            // Avanzar al siguiente paso
            setCurrentStep(3);
          } else {
            console.error('Error guardando asignaciones:', asignacionesData);
            alert(`❌ Error al guardar asignaciones: ${asignacionesData.details || asignacionesData.error || 'Error desconocido'}`);
          }
        } else {
          setMostrarResumenAreas(false);
          alert('✅ Áreas y materias guardadas correctamente!');
          console.log('Datos guardados:', responseData);
          // Avanzar al siguiente paso
          setCurrentStep(3);
        }
      } else {
        console.error('Error del servidor:', responseData);
        console.error('Status del response:', response.status);
        console.error('Headers del response:', response.headers);
        
        const errorMessage = responseData.details || responseData.error || responseData.message || 'Error desconocido del servidor';
        alert(`❌ Error al guardar: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGradosYCursos = async () => {
    setSaving(true);
    try {
      // Solo obtener los grados que tienen cursos
      const gradosConCursos = gradosPredeterminados.filter(grado => 
        cursos.some(curso => curso.gradoId === grado.id)
      );
      
      console.log('=== DATOS QUE SE ENVÍAN ===');
      console.log('Grados con cursos:', gradosConCursos.length);
      console.log('Cursos totales:', cursos.length);
      
      const datosAEnviar = {
        institucionId,
        grados: gradosConCursos,
        cursos
      };
      
      console.log('institucionId:', institucionId);
      console.log('grados (solo con cursos):', gradosConCursos);
      console.log('cursos:', cursos);
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
        alert('✅ Grados y cursos guardados correctamente!');
        console.log('Datos guardados:', responseData);
        // Avanzar al siguiente paso
        setCurrentStep(2);
      } else {
        console.error('Error del servidor:', responseData);
        alert(`❌ Error al guardar: ${responseData.details || responseData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('❌ Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  // Cargar grados cuando se llegue al Paso 2
  useEffect(() => {
    if (currentStep === 2 && gradosCargados.length === 0) {
      cargarGrados();
    }
  }, [currentStep]);

  // Cargar áreas y materias cuando se llegue al Paso 3
  useEffect(() => {
    if (currentStep === 3 && areasCargadas.length === 0) {
      cargarAreasMaterias();
    }
  }, [currentStep]);

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
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Configuración Inicial</h2>
              <p className="text-blue-100 text-sm mt-1">
                Paso {currentStep} de 5
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex justify-between">
            {[
              { num: 1, label: 'Grados y Cursos' },
              { num: 2, label: 'Áreas y Materias' },
              { num: 3, label: 'Docentes' },
              { num: 4, label: 'Estudiantes' },
              { num: 5, label: 'Resumen' },
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center ${step.num < 5 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
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
                    className={`text-xs mt-1 font-medium ${
                      currentStep >= step.num ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.num < 5 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                      currentStep > step.num ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                        
                        return (
                          <div key={grado.id} className="bg-white rounded-lg p-4 border border-slate-200">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center">
                                <span className="font-semibold text-slate-900 text-lg">
                                  {grado.nombre}
                                </span>
                                <span className="ml-3 text-sm text-slate-500">
                                  ({cursosDelGrado.length} curso{cursosDelGrado.length !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <button
                                onClick={() => agregarCurso(grado.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar Curso
                              </button>
                            </div>

                            {cursosDelGrado.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {cursosDelGrado.map((curso) => (
                                  <div
                                    key={curso.id}
                                    className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2 border border-slate-200"
                                  >
                                    <input
                                      type="text"
                                      value={curso.nombre}
                                      onChange={(e) => editarNombreCurso(curso.id, e.target.value)}
                                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-slate-900"
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
                                ))}
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
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                    <p className="text-sm text-blue-700">
                      Guarda los grados predeterminados y los cursos creados en la base de datos
                    </p>
                  </div>
                  <button
                    onClick={() => setMostrarResumen(true)}
                    disabled={saving || cursos.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
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
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">📋 Resumen - Grados y Cursos</h2>
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
                    <div className="grid grid-cols-2 gap-4 text-center">
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
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setMostrarResumen(false)}
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveGradosYCursos}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center"
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
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">📚 Resumen - Áreas y Materias</h2>
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
                            <div key={areaId} className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                              <div>
                                <span className="font-medium text-slate-900">{area?.nombre}</span>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setMostrarResumenAreas(false)}
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-slate-200 text-slate-700 hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveAreasYMaterias}
                      disabled={saving}
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center"
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
                        <div className="text-xs text-slate-500 mt-1">
                          {grado.cursos.map((c: any) => c.nombre).join(', ')}
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
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          areasActivas.includes(area.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-slate-900">
                              {area.nombre}
                            </span>
                            {area.es_opcional && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
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
                          className={`ml-3 w-12 h-6 rounded-full transition-colors ${
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
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-slate-900">
                              {area?.nombre}
                            </h5>
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
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-slate-900">
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-blue-900">Guardar configuración</h4>
                      <p className="text-sm text-blue-700">
                        Guarda las áreas activas, materias y asignaciones a grados
                      </p>
                    </div>
                    <button
                      onClick={() => setMostrarResumenAreas(true)}
                      disabled={saving || materias.length === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
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
                      <div className="flex items-center">
                        <span className="text-xl mr-3">
                          {seccionesCompletadas.datos ? '✅' : seccionActiva === 'datos' ? '📋' : '⏳'}
                        </span>
                        <span className="font-medium">Datos Personales</span>
                        {seccionesCompletadas.datos && (
                          <span className="ml-2 text-sm text-green-600">Completo</span>
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
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
                      Teléfono Celular *
                    </label>
                    <input
                      type="tel"
                      value={docenteActual.telefono}
                      onChange={(e) => {
                        setDocenteActual(prev => ({ ...prev, telefono: e.target.value }));
                        validarCampo('telefono', e.target.value);
                      }}
                      disabled={!camposHabilitados.telefono}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                        erroresValidacion.telefono ? 'border-red-500' : 'border-slate-300'
                      } ${!camposHabilitados.telefono ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="3001234567"
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
                    <p className="text-xs text-slate-500 mt-1">
                      Formato: 3001234567 (10 dígitos empezando por 3)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={docenteActual.email}
                        onChange={(e) => {
                          setDocenteActual(prev => ({ ...prev, email: e.target.value }));
                          validarCampo('email', e.target.value);
                        }}
                        disabled={!camposHabilitados.email}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                          erroresValidacion.email ? 'border-red-500' : 'border-slate-300'
                        } ${!camposHabilitados.email ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="correo@ejemplo.com"
                      />
                      <button
                        type="button"
                        onClick={verificarEmailManual}
                        disabled={!camposValidados.email || verificandoEmail}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
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
                        Email válido. Haz clic en "Verificar" para comprobar disponibilidad
                      </p>
                    )}
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      value={docenteActual.password}
                      onChange={(e) => {
                        setDocenteActual(prev => ({ ...prev, password: e.target.value }));
                        validarCampo('password', e.target.value);
                      }}
                      disabled={!campoPasswordHabilitado()}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 ${
                        erroresValidacion.password ? 'border-red-500' : 'border-slate-300'
                      } ${!campoPasswordHabilitado() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Contraseña de acceso"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      disabled={!botonesPasswordHabilitados()}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        botonesPasswordHabilitados()
                          ? 'border-slate-300 hover:bg-slate-50 cursor-pointer'
                          : 'border-slate-200 bg-gray-100 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {mostrarPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={generarPassword}
                      disabled={!botonesPasswordHabilitados()}
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center ${
                        botonesPasswordHabilitados()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      🎲
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
                  <p className="text-xs text-slate-500 mt-1">
                    La contraseña debe tener 8 caracteres con letras, números y símbolos
                  </p>
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
                      <div className="flex items-center">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.grados ? '🔒' : seccionesCompletadas.grados ? '✅' : seccionActiva === 'grados' ? '📚' : '⏳'}
                        </span>
                        <span className="font-medium">Grados y Cursos</span>
                        {seccionesCompletadas.grados && (
                          <span className="ml-2 text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.grados && (
                          <span className="ml-2 text-sm text-gray-500">Completa datos personales primero</span>
                        )}
                        {seccionesHabilitadas.grados && !seccionesCompletadas.grados && gradosSeleccionados.length > 0 && (
                          <span className="ml-2 text-sm text-yellow-600">Selecciona al menos un curso por grado</span>
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
                                <div key={curso.id} className="flex items-center justify-between p-2 border border-green-100 rounded">
                                  <label className="flex items-center">
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
                                    <span className="text-sm text-green-800">
                                      {curso.nombre}
                                    </span>
                                  </label>
                                  {isSelected && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
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
                      <div className="flex items-center">
                        <span className="text-xl mr-3">
                          {!seccionesHabilitadas.materias ? '🔒' : seccionesCompletadas.materias ? '✅' : seccionActiva === 'materias' ? '🔬' : '⏳'}
                        </span>
                        <span className="font-medium">Áreas y Materias</span>
                        {seccionesCompletadas.materias && (
                          <span className="ml-2 text-sm text-green-600">Completo</span>
                        )}
                        {!seccionesHabilitadas.materias && (
                          <span className="ml-2 text-sm text-gray-500">Completa grados y cursos primero</span>
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
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={limpiarFormularioDocente}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Limpiar formulario
              </button>
              <button
                onClick={handleAgregarDocente}
                disabled={Object.keys(erroresValidacion).length > 0}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
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
                  <div key={docente.id} className="bg-slate-50 rounded-lg border border-slate-200">
                    {/* Información básica del docente */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">
                          {docente.nombres} {docente.apellidos}
                        </h5>
                        <p className="text-sm text-slate-600">{docente.email}</p>
                        {totalAsignaciones > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {totalAsignaciones} asignacion{totalAsignaciones !== 1 ? 'es' : ''} • {totalMaterias} materia{totalMaterias !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Botón Ver Asignaciones */}
                        {totalAsignaciones > 0 && (
                          <button
                            onClick={() => toggleAsignaciones(docente.id)}
                            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
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
                        
                        {/* Estado y botón eliminar */}
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Activo
                        </span>
                        <button 
                          onClick={() => eliminarDocente(docente.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 transition-colors"
                          title="Eliminar docente"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
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
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-green-900">Listo para continuar</h4>
                <p className="text-sm text-green-700">
                  {docentes.length} docente{docentes.length !== 1 ? 's' : ''} creado{docentes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={mostrarConfirmacion}
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 4: Estudiantes
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Paso 5: Resumen y Confirmación
              </h3>
              <p className="text-slate-600">
                En construcción...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Anterior
            </button>

            <div className="text-sm text-slate-600">
              Paso {currentStep} de 5
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === 5}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
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
                    <div className="flex justify-between items-center text-sm text-slate-600">
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
