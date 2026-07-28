import type { Metadata } from 'next';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import LegacyPaymentSuccessRedirect from '@/components/payments/LegacyPaymentSuccessRedirect';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agenda-lilac-sigma.vercel.app';

export const metadata: Metadata = {
  title: 'Agenda Virtual | Recordatorios escolares por Email y WhatsApp',
  description:
    'Plataforma SaaS para instituciones educativas. Envía recordatorios de tareas, exámenes y eventos por Email (Plan Básico) o Email + WhatsApp (Plan Plus). Gestión académica y panel administrativo.',
  keywords: [
    'agenda escolar',
    'recordatorios escolares',
    'comunicación colegios',
    'notificaciones acudientes',
    'WhatsApp educación',
    'plataforma educativa',
  ],
  openGraph: {
    title: 'Agenda Virtual | Recordatorios escolares por Email y WhatsApp',
    description:
      'Plataforma para instituciones. Recordatorios por Email y WhatsApp. Plan Básico y Plan Plus.',
    url: siteUrl,
    siteName: 'Agenda Virtual',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenda Virtual | Recordatorios escolares por Email y WhatsApp',
    description: 'Plataforma para instituciones. Recordatorios por Email y WhatsApp.',
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
      <LegacyPaymentSuccessRedirect />
    </div>
  );
}
