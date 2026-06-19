import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión interna',
  robots: { index: false, follow: false },
};

export default function GestionVorticoRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
