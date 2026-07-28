import ImagePlaceholder from '@/components/landing/ImagePlaceholder';

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 sm:text-base">
            Para instituciones educativas
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            La plataforma inteligente de recordatorios escolares
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 sm:text-xl">
            <strong>Agenda Virtual</strong> resuelve la desinformación entre colegio y familias: tareas,
            exámenes y eventos llegan por <strong>Email</strong> o <strong>WhatsApp</strong> a acudientes y
            estudiantes, sin llamadas ni grupos perdidos.
          </p>
          <div className="mt-10">
            <a
              href="#planes"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl"
            >
              Ver planes
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ImagePlaceholder label="Imagen principal" className="max-w-lg" />
        </div>
      </div>
    </section>
  );
}
