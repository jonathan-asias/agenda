const benefits = [
  {
    title: 'Menos tiempo perdido en avisos',
    description: 'Un solo lugar para crear y enviar recordatorios. Los docentes publican y los acudientes reciben al instante.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Acudientes siempre informados',
    description: 'Tareas, exámenes y eventos por Email (Plan Básico) o también por WhatsApp (Plan Plus). Menos inasistencias y entregas a tiempo.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Gestión académica centralizada',
    description: 'Grados, cursos, materias, docentes y estudiantes en un panel. Configuración de institución y roles desde un solo dashboard.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2 2m0 0v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Listo para pago seguro',
    description: 'Planes claros y facturación mensual. Preparado para integrar pasarela de pago (Wompi) en futuras fases.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="benefits-heading">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="benefits-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Por qué elegir Agenda Virtual
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Resuelve la comunicación entre tu institución y las familias sin esfuerzo extra.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform duration-300 group-hover:scale-105">
                {benefit.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-2 text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
