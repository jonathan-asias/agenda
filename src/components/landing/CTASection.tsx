export default function CTASection() {
  return (
    <section className="border-t border-slate-200 bg-slate-900 px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          ¿Listo para empezar?
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Contrate un plan y active su institución para comenzar a enviar recordatorios a su comunidad educativa.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="#planes"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Ver planes
          </a>
        </div>
      </div>
    </section>
  );
}
