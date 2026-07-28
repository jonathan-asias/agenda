'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type TestimonialType = 'institucion' | 'docente';

const VISIBLE_COUNT = 3;

const testimonials: {
  quote: string;
  name: string;
  role: string;
  context: string;
  type: TestimonialType;
}[] = [
  {
    quote:
      'Por fin dejamos de depender de grupos de WhatsApp y correos perdidos. Los recordatorios llegan solos y los acudientes responden mejor.',
    name: 'María Fernanda López',
    role: 'Coordinación académica',
    context: 'Colegio San Patricio, Bogotá',
    type: 'institucion',
  },
  {
    quote:
      'Publicar una tarea toma menos de un minuto. Los padres me confirman que reciben el aviso el mismo día y ya no tengo que repetir lo mismo en clase.',
    name: 'Carlos Andrés Ruiz',
    role: 'Docente de Matemáticas',
    context: 'Grado 8°, Institución educativa',
    type: 'docente',
  },
  {
    quote:
      'La gestión por grados y cursos nos ahorra tiempo. Los docentes crean los avisos y nosotros solo supervisamos desde el panel administrativo.',
    name: 'Ana Lucía Gómez',
    role: 'Administración',
    context: 'Liceo Campestre, Medellín',
    type: 'institucion',
  },
  {
    quote:
      'Antes enviaba listas por correo y muchas no las leían. Con Agenda Virtual el recordatorio llega directo y puedo programar avisos de exámenes con anticipación.',
    name: 'Diana Marcela Vargas',
    role: 'Docente de Ciencias Naturales',
    context: 'Grado 6°, Colegio privado',
    type: 'docente',
  },
  {
    quote:
      'Queríamos algo simple y profesional. Email para lo formal y en el Plan Plus WhatsApp para llegar a todos. La implementación fue más rápida de lo esperado.',
    name: 'Jorge Iván Mejía',
    role: 'Rectoría',
    context: 'Colegio Los Nogales',
    type: 'institucion',
  },
  {
    quote:
      'Lo que más valoro es la claridad: elijo el curso, escribo el recordatorio y el sistema se encarga del envío. Me quitó la carga de perseguir acudientes por mensajes.',
    name: 'Laura Patricia Soto',
    role: 'Docente de Lengua Castellana',
    context: 'Grado 10°, Institución educativa',
    type: 'docente',
  },
];

const typeLabels: Record<TestimonialType, string> = {
  institucion: 'Institución',
  docente: 'Docente',
};

const typeStyles: Record<TestimonialType, string> = {
  institucion: 'bg-blue-100 text-blue-800',
  docente: 'bg-emerald-100 text-emerald-800',
};

function chunkTestimonials<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function TestimonialCard({ item }: { item: (typeof testimonials)[number] }) {
  return (
    <blockquote className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[item.type]}`}
      >
        {typeLabels[item.type]}
      </span>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 sm:text-base">
        &ldquo;{item.quote}&rdquo;
      </p>
      <footer className="mt-4 border-t border-slate-100 pt-4">
        <cite className="not-italic">
          <span className="block font-semibold text-slate-900">{item.name}</span>
          <span className="block text-sm text-slate-600">{item.role}</span>
          <span className="text-sm text-slate-500">{item.context}</span>
        </cite>
      </footer>
    </blockquote>
  );
}

export default function TestimonialsSection() {
  const slides = useMemo(() => chunkTestimonials(testimonials, VISIBLE_COUNT), []);
  const slideCount = slides.length;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slideCount);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  return (
    <section
      id="testimonios"
      className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Lo que dicen los clientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Comentarios de instituciones y docentes que ya usan Agenda Virtual en su día a día.
          </p>
        </div>

        <div className="relative mt-14 px-10 sm:px-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {slide.map((item) => (
                      <TestimonialCard key={item.name} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {slideCount > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:h-11 sm:w-11"
                aria-label="Testimonios anteriores"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:h-11 sm:w-11"
                aria-label="Siguientes testimonios"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {slideCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ir al grupo de testimonios ${index + 1}`}
                aria-current={index === current ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
