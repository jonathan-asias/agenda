const testimonials = [
  {
    quote: 'Por fin dejamos de depender de grupos de WhatsApp y correos perdidos. Los recordatorios llegan solos y los acudientes responden mejor.',
    role: 'Coordinación académica',
    context: 'Colegio privado, Bogotá',
  },
  {
    quote: 'La gestión por grados y cursos nos ahorra tiempo. Los docentes crean los avisos y nosotros solo supervisamos desde el panel.',
    role: 'Administración',
    context: 'Institución educativa',
  },
  {
    quote: 'Queríamos algo simple y profesional. Agenda Virtual cumple: Email para lo formal y en el Plan Plus WhatsApp para llegar a todos.',
    role: 'Rectoría',
    context: 'Colegio',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Lo que dicen las instituciones
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Experiencias de coordinación y administración con Agenda Virtual.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <blockquote
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="text-slate-700">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-slate-100 pt-4">
                <cite className="not-italic">
                  <span className="block font-semibold text-slate-900">{item.role}</span>
                  <span className="text-sm text-slate-500">{item.context}</span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Elegir mi plan
          </a>
        </div>
      </div>
    </section>
  );
}
