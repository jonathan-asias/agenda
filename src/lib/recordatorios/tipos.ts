/** Tipos de recordatorio admitidos en API y UI. */
export const RECORDATORIO_TIPOS = [
  'tarea',
  'examen',
  'evento',
  'autorizacion',
  'otro',
] as const;

export type RecordatorioTipo = (typeof RECORDATORIO_TIPOS)[number];

export const RECORDATORIO_TIPO_LABELS: Record<RecordatorioTipo, string> = {
  tarea: 'Tarea',
  examen: 'Examen',
  evento: 'Evento',
  autorizacion: 'Autorización',
  otro: 'Otro',
};

export const RECORDATORIO_TIPO_COLORS: Record<RecordatorioTipo, string> = {
  tarea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  examen: 'bg-red-100 text-red-800 border-red-200',
  evento: 'bg-blue-100 text-blue-800 border-blue-200',
  autorizacion: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  otro: 'bg-purple-100 text-purple-800 border-purple-200',
};

export function isRecordatorioTipo(value: string): value is RecordatorioTipo {
  return (RECORDATORIO_TIPOS as readonly string[]).includes(value);
}

/** Etiquetas del formulario de creación según el tipo de recordatorio. */
export interface RecordatorioFormLabels {
  seccionTitulo: string;
  nombre: string;
  nombreTip: string;
  nombrePlaceholder: string;
  descripcion: string;
  descripcionTip: string;
  descripcionPlaceholder: string;
  fecha: string;
  fechaTip: string;
  datosEventoTitulo: string;
  eventoNombre: string;
  eventoNombreTip: string;
  eventoNombrePlaceholder: string;
  lugarEvento: string;
  lugarEventoTip: string;
  lugarEventoPlaceholder: string;
  fechaEvento: string;
  fechaEventoTip: string;
  horarioEvento: string;
  horaInicio: string;
  horaInicioTip: string;
  horaFin: string;
  horaFinTip: string;
  horaLlegada: string;
  horaLlegadaTip: string;
  fechaVencimiento: string;
  fechaVencimientoTip: (minutosAntes: number) => string;
  horaVencimiento: string;
  horaVencimientoTip: (minutosAntes: number) => string;
  crearBoton: string;
  crearBotonEnProgreso: string;
  crearConfirmTitulo: string;
}

export const RECORDATORIO_FORM_LABELS: Record<RecordatorioTipo, RecordatorioFormLabels> = {
  tarea: {
    seccionTitulo: 'Datos de la tarea',
    nombre: 'Nombre de la tarea',
    nombreTip:
      'Título que verá el acudiente. Sé concreto, por ejemplo: “Tarea de fracciones — entrega viernes”.',
    nombrePlaceholder: 'Ej: Tarea de fracciones — entrega viernes',
    descripcion: 'Descripción de la tarea',
    descripcionTip:
      'Indica qué debe hacer el estudiante. Este texto llega al acudiente casi tal cual.',
    descripcionPlaceholder:
      'Ej: Traer el cuaderno y resolver los ejercicios 1 al 10 de la página 42.',
    fecha: 'Fecha de entrega',
    fechaTip: 'Fecha límite para entregar la tarea. No puede ser anterior a hoy.',
    datosEventoTitulo: 'Datos del evento',
    eventoNombre: 'Evento al que pertenece',
    eventoNombreTip: 'Nombre del evento relacionado.',
    eventoNombrePlaceholder: '',
    lugarEvento: 'Lugar del evento',
    lugarEventoTip: 'Dirección o sitio del evento.',
    lugarEventoPlaceholder: '',
    fechaEvento: 'Fecha del evento',
    fechaEventoTip: 'Día del evento.',
    horarioEvento: 'Horario del evento',
    horaInicio: 'Hora de inicio',
    horaInicioTip: 'Hora en que inicia la actividad.',
    horaFin: 'Hora de fin',
    horaFinTip: 'Hora en que termina la actividad.',
    horaLlegada: 'Hora de llegada',
    horaLlegadaTip: 'Hora de llegada al punto de encuentro.',
    fechaVencimiento: 'Fecha de vencimiento',
    fechaVencimientoTip: (m) => `Se calcula automáticamente: ${m} minutos antes de la hora de inicio.`,
    horaVencimiento: 'Hora de vencimiento',
    horaVencimientoTip: (m) => `Se fija automáticamente ${m} minutos antes del inicio.`,
    crearBoton: 'Crear tarea',
    crearBotonEnProgreso: 'Creando tarea…',
    crearConfirmTitulo: '¿Crear tarea?',
  },
  examen: {
    seccionTitulo: 'Datos del examen',
    nombre: 'Nombre del examen',
    nombreTip:
      'Título que verá el acudiente. Sé concreto, por ejemplo: “Examen de ciencias — unidad 3”.',
    nombrePlaceholder: 'Ej: Examen de ciencias naturales — unidad 3',
    descripcion: 'Descripción del examen',
    descripcionTip: 'Indica el alcance, materiales permitidos o temas a evaluar.',
    descripcionPlaceholder: 'Ej: Evalúa ecosistemas, cadenas alimenticias y adaptaciones.',
    fecha: 'Fecha del examen',
    fechaTip: 'Día en que se realizará el examen. No puede ser anterior a hoy.',
    datosEventoTitulo: 'Datos del evento',
    eventoNombre: 'Evento al que pertenece',
    eventoNombreTip: 'Nombre del evento relacionado.',
    eventoNombrePlaceholder: '',
    lugarEvento: 'Lugar del evento',
    lugarEventoTip: 'Dirección o sitio del evento.',
    lugarEventoPlaceholder: '',
    fechaEvento: 'Fecha del evento',
    fechaEventoTip: 'Día del evento.',
    horarioEvento: 'Horario del evento',
    horaInicio: 'Hora de inicio',
    horaInicioTip: 'Hora en que inicia la actividad.',
    horaFin: 'Hora de fin',
    horaFinTip: 'Hora en que termina la actividad.',
    horaLlegada: 'Hora de llegada',
    horaLlegadaTip: 'Hora de llegada al punto de encuentro.',
    fechaVencimiento: 'Fecha de vencimiento',
    fechaVencimientoTip: (m) => `Se calcula automáticamente: ${m} minutos antes de la hora de inicio.`,
    horaVencimiento: 'Hora de vencimiento',
    horaVencimientoTip: (m) => `Se fija automáticamente ${m} minutos antes del inicio.`,
    crearBoton: 'Crear examen',
    crearBotonEnProgreso: 'Creando examen…',
    crearConfirmTitulo: '¿Crear examen?',
  },
  evento: {
    seccionTitulo: 'Datos del evento',
    nombre: 'Nombre del evento',
    nombreTip:
      'Título que verá el acudiente. Sé concreto, por ejemplo: “Día del deporte — actividades en la cancha”.',
    nombrePlaceholder: 'Ej: Día del deporte — actividades en la cancha',
    descripcion: 'Descripción del evento',
    descripcionTip: 'Explica en qué consiste el evento y qué debe saber el acudiente.',
    descripcionPlaceholder: 'Ej: Participación en actividades deportivas con el curso completo.',
    fecha: 'Fecha del evento',
    fechaTip: 'Día en que ocurre el evento. No puede ser anterior a hoy.',
    datosEventoTitulo: 'Datos del evento',
    eventoNombre: 'Evento al que pertenece',
    eventoNombreTip: 'Nombre del evento relacionado.',
    eventoNombrePlaceholder: '',
    lugarEvento: 'Lugar del evento',
    lugarEventoTip: 'Dirección o sitio del evento.',
    lugarEventoPlaceholder: '',
    fechaEvento: 'Fecha del evento',
    fechaEventoTip: 'Día del evento.',
    horarioEvento: 'Horario del evento',
    horaInicio: 'Hora de inicio',
    horaInicioTip: 'Hora en que inicia la actividad.',
    horaFin: 'Hora de fin',
    horaFinTip: 'Hora en que termina la actividad.',
    horaLlegada: 'Hora de llegada',
    horaLlegadaTip: 'Hora de llegada al punto de encuentro.',
    fechaVencimiento: 'Fecha de vencimiento',
    fechaVencimientoTip: (m) => `Se calcula automáticamente: ${m} minutos antes de la hora de inicio.`,
    horaVencimiento: 'Hora de vencimiento',
    horaVencimientoTip: (m) => `Se fija automáticamente ${m} minutos antes del inicio.`,
    crearBoton: 'Crear evento',
    crearBotonEnProgreso: 'Creando evento…',
    crearConfirmTitulo: '¿Crear evento?',
  },
  autorizacion: {
    seccionTitulo: 'Datos de la autorización',
    nombre: 'Nombre de la autorización',
    nombreTip:
      'Título que verá el acudiente. Sé concreto, por ejemplo: “Autorización salida pedagógica”.',
    nombrePlaceholder: 'Ej: Autorización salida pedagógica — Museo Nacional',
    descripcion: 'Descripción de la autorización',
    descripcionTip: 'Describe la autorización que debe revisar y responder el acudiente.',
    descripcionPlaceholder: 'Ej: Autorización para la salida pedagógica al museo.',
    fecha: 'Fecha de vencimiento de la autorización',
    fechaTip: 'Se calcula automáticamente según la hora de inicio del evento.',
    datosEventoTitulo: 'Datos del evento',
    eventoNombre: 'Evento al que pertenece',
    eventoNombreTip: 'Nombre del evento al que pertenece esta autorización.',
    eventoNombrePlaceholder: 'Ej: Salida pedagógica — Museo Nacional',
    lugarEvento: 'Lugar del evento',
    lugarEventoTip: 'Dirección o sitio donde ocurre el evento.',
    lugarEventoPlaceholder: 'Ej: Museo Nacional, Calle 28 #7-43, Bogotá',
    fechaEvento: 'Fecha del evento',
    fechaEventoTip: 'Día en que ocurre el evento.',
    horarioEvento: 'Horario del evento',
    horaInicio: 'Hora de inicio del evento',
    horaInicioTip: 'Hora en que inicia la actividad.',
    horaFin: 'Hora de fin del evento',
    horaFinTip: 'Hora en que termina la actividad (después del inicio).',
    horaLlegada: 'Hora de llegada',
    horaLlegadaTip:
      'Hora en la que deben llegar al punto de encuentro (igual o antes del inicio).',
    fechaVencimiento: 'Fecha de vencimiento de la autorización',
    fechaVencimientoTip: (m) => `Se calcula automáticamente: ${m} minutos antes de la hora de inicio.`,
    horaVencimiento: 'Hora de vencimiento de la autorización',
    horaVencimientoTip: (m) => `Se fija automáticamente ${m} minutos antes del inicio.`,
    crearBoton: 'Crear autorización',
    crearBotonEnProgreso: 'Creando autorización…',
    crearConfirmTitulo: '¿Crear autorización?',
  },
  otro: {
    seccionTitulo: 'Datos del aviso',
    nombre: 'Nombre del aviso',
    nombreTip: 'Título que verá el acudiente. Sé claro y concreto.',
    nombrePlaceholder: 'Ej: Recordatorio de útiles escolares',
    descripcion: 'Descripción del aviso',
    descripcionTip: 'Explica con claridad qué debe saber o hacer el estudiante.',
    descripcionPlaceholder: 'Ej: Traer marcadores y cartulina para la actividad del viernes.',
    fecha: 'Fecha del aviso',
    fechaTip: 'Fecha relevante del aviso. No puede ser anterior a hoy.',
    datosEventoTitulo: 'Datos del evento',
    eventoNombre: 'Evento al que pertenece',
    eventoNombreTip: 'Nombre del evento relacionado.',
    eventoNombrePlaceholder: '',
    lugarEvento: 'Lugar del evento',
    lugarEventoTip: 'Dirección o sitio del evento.',
    lugarEventoPlaceholder: '',
    fechaEvento: 'Fecha del evento',
    fechaEventoTip: 'Día del evento.',
    horarioEvento: 'Horario del evento',
    horaInicio: 'Hora de inicio',
    horaInicioTip: 'Hora en que inicia la actividad.',
    horaFin: 'Hora de fin',
    horaFinTip: 'Hora en que termina la actividad.',
    horaLlegada: 'Hora de llegada',
    horaLlegadaTip: 'Hora de llegada al punto de encuentro.',
    fechaVencimiento: 'Fecha de vencimiento',
    fechaVencimientoTip: (m) => `Se calcula automáticamente: ${m} minutos antes de la hora de inicio.`,
    horaVencimiento: 'Hora de vencimiento',
    horaVencimientoTip: (m) => `Se fija automáticamente ${m} minutos antes del inicio.`,
    crearBoton: 'Crear aviso',
    crearBotonEnProgreso: 'Creando aviso…',
    crearConfirmTitulo: '¿Crear aviso?',
  },
};

export function getRecordatorioFormLabels(tipo: RecordatorioTipo): RecordatorioFormLabels {
  return RECORDATORIO_FORM_LABELS[tipo];
}

export const AUTORIZACION_RESPUESTAS = ['autorizado', 'no_autorizado'] as const;
export type AutorizacionRespuesta = (typeof AUTORIZACION_RESPUESTAS)[number];

export function isAutorizacionRespuesta(value: string): value is AutorizacionRespuesta {
  return (AUTORIZACION_RESPUESTAS as readonly string[]).includes(value);
}
