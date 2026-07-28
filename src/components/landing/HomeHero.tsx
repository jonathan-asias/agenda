import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Agenda virtual escolar para organizar la comunicación diaria
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            Una plataforma clara y confiable para que las instituciones educativas
            coordinen clases, recordatorios y comunicación con su comunidad.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#planes"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ver planes
          </a>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-blue-600 px-6 py-3 text-sm font-medium text-blue-700 transition-colors hover:border-blue-700 hover:text-blue-800 focus-ring-outline"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </section>
  );
}
