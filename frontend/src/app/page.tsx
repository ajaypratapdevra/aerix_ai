import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ProductsSection from '@/components/sections/ProductsSection';
import WorkshopsSection from '@/components/sections/WorkshopsSection';
import ChatWidget from '@/components/ui/ChatWidget';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, GraduationCap, Brain } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Trendy & Practical Design',
    desc: 'Products built for real classroom and field environments — functional, durable, and student-friendly.',
    color: 'cyan',
  },
  {
    icon: Brain,
    title: 'Real-Time AI Intelligence',
    desc: 'Live AI processing for instant responses, smart recommendations, and continuous learning support.',
    color: 'cyan',
  },
  {
    icon: Shield,
    title: 'Smart Safety Integration',
    desc: 'Emergency detection algorithms with sub-5-second response time — trusted, reliable, life-saving.',
    color: 'orange',
  },
  {
    icon: GraduationCap,
    title: 'Education-First Innovation',
    desc: 'Every product and workshop is designed with pedagogy in mind — easy to teach, easy to learn.',
    color: 'cyan',
  },
];

const testimonial = {
  quote: 'The safety band concept is impressive and has real-world impact. Every school should have this kind of safety awareness program for their students.',
  author: 'CF College Faculty',
  org: 'Engineering College, Gujarat',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <WorkshopsSection />

        {/* Features */}
        <section className="py-24 bg-brand-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="section-label">WHY AERIX AI</div>
                <h2 className="section-title mb-6">More Features of <span>AERIX AI</span></h2>
                <p className="text-slate-400 mb-8">
                  Everything designed with education and real-world impact at the core.
                </p>
                <div className="space-y-5">
                  {features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          f.color === 'cyan' ? 'bg-brand-cyan/10 border border-brand-cyan/20' : 'bg-brand-orange/10 border border-brand-orange/20'
                        }`}>
                          <Icon className={`w-5 h-5 ${f.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-orange'}`} />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-white text-sm mb-1">{f.title}</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Testimonial */}
              <div className="card border-brand-cyan/20 relative">
                <div className="absolute -top-3 -left-3 text-6xl text-brand-cyan/20 font-heading">"</div>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 relative z-10">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-cyan/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-cyan font-heading font-bold">CF</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-slate-500 text-xs">{testimonial.org}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-brand-navy-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="section-label">GET IN TOUCH</div>
            <h2 className="section-title mb-4">Let's Work <span>Together</span></h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Whether you're a school principal, investor, or just curious about our products — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8 py-4">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/workshops" className="btn-outline px-8 py-4">
                Book a Workshop
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
