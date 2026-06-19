import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { withDbBypass } from '@/lib/db/rls-context';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ContratarPlanForm from './ContratarPlanForm';

interface PageProps {
  params: Promise<{ planId: string }>;
}

export default async function ContratarPlanPage({ params }: PageProps) {
  const { planId } = await params;
  const id = parseInt(planId, 10);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const plan = await withDbBypass(async (tx) =>
    tx.plan.findFirst({
      where: { id, activo: true },
      select: {
        id: true,
        nombre: true,
        precio: true,
        push: true,
        whatsapp: true,
        email: true,
      },
    })
  );

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl text-center text-slate-600">Cargando plan...</div>
          }
        >
          <ContratarPlanForm plan={plan} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
