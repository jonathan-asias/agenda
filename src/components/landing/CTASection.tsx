import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="border-t border-slate-200 bg-slate-900 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          ¿Listo para empezar?
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Crea tu cuenta en minutos y comienza a enviar recordatorios a tu comunidad educativa.
        </p>
        <div className="mt-10">
          <Link
            href="/registro-institucion"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
