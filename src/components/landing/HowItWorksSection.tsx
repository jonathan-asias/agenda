const steps = [
  {
    step: 1,
    title: 'Registra tu institución',
    description: 'Crea tu cuenta y configura grados, cursos y materias en pocos minutos.',
  },
  {
    step: 2,
    title: 'Asigna docentes y estudiantes',
    description: 'Invita a tu equipo y carga los datos de estudiantes y acudientes.',
  },
  {
    step: 3,
    title: 'Crea recordatorios',
    description: 'Los docentes envían tareas, exámenes y eventos por email o WhatsApp.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-slate-200 bg-slate-50/50 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Tres pasos para poner tu institución en marcha con la agenda virtual.
          </p>
        </div>
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-xl font-bold text-slate-900 shadow-sm">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.description}</p>
              {item.step < steps.length && (
                <div className="absolute left-1/2 top-7 hidden h-0.5 w-full bg-slate-200 sm:block" style={{ width: 'calc(100% + 2rem)', marginLeft: 'calc(-50% - 1rem)' }} aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
