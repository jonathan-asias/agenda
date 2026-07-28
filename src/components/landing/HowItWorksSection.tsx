const steps = [
  {
    step: 1,
    title: 'Contrata tu plan',
    description: 'Elige el plan que mejor se adapte y completa el pago de tu suscripción.',
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
    <section
      id="how-it-works"
      className="bg-blue-800 px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cómo funciona
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Tres pasos para poner tu institución en marcha con la agenda virtual.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="group rounded-2xl bg-slate-100 p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-800 bg-white text-xl font-bold text-blue-800 shadow-sm transition-all duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
