import { Suspense } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import PagoExitosoContent from './PagoExitosoContent';

export const metadata = {
  title: 'Pago exitoso | Agenda Virtual',
  robots: { index: false, follow: false },
};

export default function PagoExitosoPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
              <p className="text-slate-600">Cargando confirmación...</p>
            </div>
          }
        >
          <PagoExitosoContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
