import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import {
  isDevConfirmPurchaseEnabled,
  isValidDevConfirmPurchaseToken,
} from '@/lib/payments/dev-confirm-purchase';
import ConfirmarCompraForm from './ConfirmarCompraForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Confirmar compra (prueba)',
  robots: { index: false, follow: false },
};

export default async function ConfirmarCompraPruebaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!isDevConfirmPurchaseEnabled() || !isValidDevConfirmPurchaseToken(token)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 mb-4">
            Solo pruebas
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Confirmar compra</h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Herramienta interna para simular la confirmación de un pago cuando el webhook o el retorno
            de Wompi/Mercado Pago no llegó. Ingrese los datos del comprobante.
          </p>

          <ConfirmarCompraForm token={token} />

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
