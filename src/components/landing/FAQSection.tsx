'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    question: '¿Cómo contrato un plan para mi institución?',
    answer:
      'Desde la sección de Planes elige el Plan Básico o Plan Plus, completa el pago de la suscripción y, una vez confirmado, podrás activar tu institución y comenzar la configuración.',
  },
  {
    question: '¿Cuál es la diferencia entre el Plan Básico y el Plan Plus?',
    answer:
      'El Plan Básico incluye recordatorios por correo electrónico, gestión académica y plan de clases semanal por formulario con vista web. El Plan Plus agrega WhatsApp, notificaciones push y plan semanal con carga de PDF, extracción automática y edición en formato web.',
  },
  {
    question: '¿Los docentes necesitan capacitación para usar la plataforma?',
    answer:
      'No es obligatoria. La interfaz está pensada para ser intuitiva: el docente selecciona su curso, crea el recordatorio y el sistema lo envía. Además, ofrecemos acompañamiento inicial si su institución lo requiere.',
  },
  {
    question: '¿Cómo llegan los recordatorios a los acudientes?',
    answer:
      'Según el plan contratado, los avisos se envían por correo electrónico (Plan Básico) o también por WhatsApp y notificaciones push (Plan Plus), usando los datos de contacto registrados en la plataforma.',
  },
  {
    question: '¿Puedo gestionar varios grados y cursos desde un solo panel?',
    answer:
      'Sí. La plataforma permite configurar grados, cursos, materias, docentes y estudiantes desde un panel centralizado, con roles diferenciados para administración y docentes.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'El pago de la suscripción se realiza de forma segura a través de Mercado Pago, con opción de facturación mensual o anual (esta última con 5% de descuento).',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="preguntas-frecuentes"
      className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            ¿Aún tienes preguntas?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Resolvemos las dudas más frecuentes sobre el uso de Agenda Virtual.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-100/80"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-200 px-6 pb-5 pt-4 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Contactar con asesor
          </Link>
        </div>
      </div>
    </section>
  );
}
