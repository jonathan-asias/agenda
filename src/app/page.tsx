import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HomeHero from '@/components/landing/HomeHero';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50 text-slate-900">
      <Header />
      <main className="flex flex-1 items-center">
        <HomeHero />
      </main>
      <Footer />
    </div>
  );
}
