import Link from 'next/link';
import { Clock, Users, ArrowRight, Zap } from 'lucide-react';

const workshops = [
  {
    title: 'AI & Smart Technology Workshop',
    audience: 'Class 6–12',
    duration: '2 Days',
    tag: 'Live Demo',
    desc: 'AI basics, real-life applications, interactive demonstrations, and hands-on experiments for school students.',
    color: 'cyan',
  },
  {
    title: 'Women Safety Tech Workshop',
    audience: 'All Ages',
    duration: '1 Day',
    tag: 'Device Demo',
    desc: 'Smart safety devices, emergency response systems, live NAARIX band demo and safety awareness sessions.',
    color: 'orange',
  },
  {
    title: 'AI Assistant & Chatbot Development',
    audience: 'Class 8–12',
    duration: '3 Days',
    tag: 'Hands-on',
    desc: 'AI basics, NLP introduction, building simple chatbot assistants — no prior coding experience needed.',
    color: 'cyan',
  },
  {
    title: 'Aerospace & Innovation Workshop',
    audience: 'Class 6–12',
    duration: '3 Days',
    tag: 'Projects',
    desc: 'Rocket science basics, innovation thinking methodology, hands-on model-building and aerospace careers.',
    color: 'cyan',
  },
];

export default function WorkshopsSection() {
  return (
    <section className="py-24 bg-brand-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label">SCHOOL PROGRAMS</div>
          <h2 className="section-title">Workshops & <span>Education</span></h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Empowering the next generation of Space & AI leaders through hands-on, curriculum-aligned workshop programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {workshops.map((w) => {
            const isCyan = w.color === 'cyan';
            return (
              <div key={w.title} className="card group hover:border-brand-cyan/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-heading font-bold text-white text-base leading-snug">{w.title}</h3>
                  <span className={`badge flex-shrink-0 ${isCyan ? 'badge-cyan' : 'badge-orange'}`}>{w.tag}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">{w.desc}</p>

                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Users className="w-3.5 h-3.5 text-brand-cyan" />
                    {w.audience}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                    {w.duration}
                  </div>
                </div>

                <Link
                  href="/workshops"
                  className="inline-flex items-center gap-2 text-brand-cyan text-sm font-semibold font-heading hover:gap-3 transition-all duration-200"
                >
                  Book for Your School
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="relative bg-brand-navy-card border border-brand-navy-border rounded-2xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-brand-cyan/5 via-transparent to-transparent" />
          <div className="relative">
            <Zap className="w-8 h-8 text-brand-orange mx-auto mb-4" />
            <h3 className="font-heading font-bold text-white text-2xl mb-3">
              Host a Workshop in Your School
            </h3>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Partner with AERIX AI to bring cutting-edge AI & Aerospace education to your students.
            </p>
            <Link href="/contact" className="btn-primary">
              Inquire Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
