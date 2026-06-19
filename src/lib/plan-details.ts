import type { PreRegistroInstitucion } from '@/types/pre-registro-institucion';

export interface PlanDetailSection {
  title: string;
  items: string[];
}

export interface PlanMarketingDetail {
  tagline: string;
  description: string;
  sections: PlanDetailSection[];
  idealFor: string[];
}

const BASE_SECTIONS: PlanDetailSection[] = [
  {
    title: 'Gestión académica',
    items: [
      'Grados, cursos, áreas y materias configurables',
      'Asignación de docentes y estudiantes',
      'Panel administrativo por institución',
      'Soporte para múltiples sedes y jornadas',
    ],
  },
  {
    title: 'Comunicación con familias',
    items: [
      'Recordatorios de tareas, exámenes y eventos',
      'Historial de avisos por institución',
      'Plantillas y envíos programados',
    ],
  },
];

export function getPlanMarketingDetail(plan: {
  nombre: string;
  push: boolean;
  whatsapp: boolean;
  email: boolean;
}): PlanMarketingDetail {
  const isPlus = plan.nombre.toLowerCase().includes('plus');

  const channels: PlanDetailSection = {
    title: 'Canales incluidos',
    items: [
      plan.email ? 'Recordatorios por correo electrónico' : null,
      plan.whatsapp ? 'Recordatorios por WhatsApp' : null,
      plan.push ? 'Notificaciones push a acudientes' : null,
    ].filter((x): x is string => Boolean(x)),
  };

  const sections = [...BASE_SECTIONS, channels];

  if (isPlus) {
    sections.push({
      title: 'Ventajas Plan Plus',
      items: [
        'Mayor alcance con WhatsApp y push',
        'Prioridad en soporte técnico',
        'Ideal para instituciones con alta comunicación diaria',
      ],
    });
  } else {
    sections.push({
      title: 'Ventajas Plan Básico',
      items: [
        'Todo lo esencial para digitalizar la agenda escolar',
        'Precio accesible para instituciones pequeñas y medianas',
        'Implementación rápida sin complejidad',
      ],
    });
  }

  return {
    tagline: isPlus
      ? 'Máximo alcance con WhatsApp y notificaciones push'
      : 'Todo lo esencial para empezar con agenda digital',
    description: isPlus
      ? 'El plan premium de Agenda Virtual combina email, WhatsApp y push para que ningún aviso importante se pierda. Pensado para colegios que necesitan comunicación inmediata con acudientes.'
      : 'El plan básico incluye la plataforma completa de gestión académica y recordatorios por correo. Es la forma más simple de profesionalizar la comunicación de su institución.',
    sections,
    idealFor: isPlus
      ? [
          'Colegios con alto volumen de comunicaciones',
          'Instituciones que usan WhatsApp con familias',
          'Sedes que requieren alertas en tiempo real',
        ]
      : [
          'Instituciones que inician su transformación digital',
          'Colegios que priorizan avisos formales por email',
          'Equipos administrativos pequeños',
        ],
  };
}

export function formatCop(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}
