import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          La plataforma inteligente de recordatorios escolares
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Conecta a tu institución con estudiantes y acudientes. Gestiona tareas, exámenes y eventos con recordatorios por email y WhatsApp desde un solo lugar.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/registro-institucion"
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:w-auto"
          >
            Comenzar ahora
          </Link>
          <a
            href="#pricing"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 sm:w-auto"
          >
            Ver planes
          </a>
        </div>
      </div>
    </section>
  );
}
