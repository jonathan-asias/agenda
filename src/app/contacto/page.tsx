import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const contactInfo = [
  {
    title: 'Correo',
    value: 'contacto@agendavirtual.co',
    href: 'mailto:contacto@agendavirtual.co',
    description: 'Escríbenos para consultas sobre planes, implementación o soporte.',
  },
  {
    title: 'Horario de atención',
    value: 'Lunes a viernes, 8:00 a. m. – 6:00 p. m.',
    description: 'Hora Colombia (GMT-5).',
  },
  {
    title: 'Tiempo de respuesta',
    value: '24 horas hábiles en promedio',
    description: 'Nuestro equipo de asesoría le responderá lo antes posible.',
  },
];

const helpTopics = [
  'Asesoría para elegir entre Plan Básico y Plan Plus',
  'Acompañamiento en la contratación y activación',
  'Soporte durante la configuración inicial',
  'Consultas sobre facturación y renovación',
];

export const metadata: Metadata = {
  title: 'Contacto | Agenda Virtual',
  description:
    'Comuníquese con el equipo de Agenda Virtual para resolver dudas sobre planes, implementación y soporte.',
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contacto</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                ¿Tiene preguntas sobre implementación, planes o soporte? Nuestro equipo está listo para
                acompañarle.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 block text-base font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">¿En qué podemos ayudarle?</h2>
              <ul className="mt-4 space-y-3">
                {helpTopics.map((topic) => (
                  <li key={topic} className="flex gap-3 text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" aria-hidden />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:contacto@agendavirtual.co?subject=Consulta%20-%20Agenda%20Virtual"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Contactar con asesor
              </a>
              <Link
                href="/#planes"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
