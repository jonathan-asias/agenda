import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-32" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 sm:text-base">
          Para instituciones educativas
        </p>
        <h1 id="hero-heading" className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          La plataforma inteligente de recordatorios escolares
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          <strong>Agenda Virtual</strong> resuelve la desinformación entre colegio y familias: tareas, exámenes y eventos llegan por <strong>Email</strong> o <strong>WhatsApp</strong> a acudientes y estudiantes, sin llamadas ni grupos perdidos.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#pricing"
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:w-auto"
          >
            Ver planes y precios
          </a>
          <Link
            href="/registro-institucion"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:w-auto"
          >
            Comenzar ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
