'use client';
import Link from 'next/link';
import { Rocket, ArrowRight, BookOpen } from 'lucide-react';

const stats = [
  { value: '3+', label: 'AI Products Developed' },
  { value: '10+', label: 'Schools Targeted' },
  { value: '24/7', label: 'AI Assistance' },
  { value: '<15min', label: 'Customer Support' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-grid overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-aerix-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />

      {/* Animated rocket orb */}
      <div className="absolute top-24 right-8 md:right-16 lg:right-24 animate-float opacity-80 hidden md:block">
        <div className="relative">
          <div className="w-72 h-72 lg:w-96 lg:h-96 bg-gradient-radial from-brand-cyan/20 via-brand-cyan/5 to-transparent rounded-full flex items-center justify-center">
            <div className="w-40 h-40 lg:w-56 lg:h-56 bg-brand-navy-card border-2 border-brand-cyan/30 rounded-full flex items-center justify-center shadow-cyan-glow">
              <Rocket className="w-20 h-20 lg:w-28 lg:h-28 text-brand-cyan rotate-12" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-4 py-2 mb-6">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
            <span className="text-brand-cyan text-xs font-heading tracking-widest uppercase">
              Aerospace Intelligence for Emerging India
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-black text-white leading-tight mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">Pioneering</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-brand-cyan">Aerospace</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl">Intelligence</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
            Intelligent technologies that empower <span className="text-white font-medium">education</span>, 
            strengthen <span className="text-white font-medium">safety</span>, and drive 
            <span className="text-white font-medium"> innovation</span> across India.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/innovations" className="btn-primary text-base px-8 py-4">
              <Rocket className="w-5 h-5" />
              Explore Innovations
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/workshops" className="btn-outline text-base px-8 py-4">
              <BookOpen className="w-5 h-5" />
              Book School Workshop
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center sm:text-left">
                <div className="font-heading font-black text-2xl text-white">{stat.value}</div>
                <div className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-navy to-transparent" />
    </section>
  );
}
