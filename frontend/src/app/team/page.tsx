import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl text-white mb-4">Our Team</h1>
          <p className="text-slate-400">Meet the people behind AERIX AI.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
