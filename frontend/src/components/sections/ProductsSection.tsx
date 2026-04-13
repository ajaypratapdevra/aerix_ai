'use client';
import Link from 'next/link';
import { ArrowRight, Cpu, Shield, Tablet, Bot } from 'lucide-react';

const products = [
  {
    badge: 'EDUCATION',
    icon: Cpu,
    name: 'AERIX AI Smart School System',
    desc: 'AI-powered platform for schools — smart learning, teacher assistance & real-time performance tracking.',
    cta: 'Request Demo',
    ctaHref: '/innovations#smart-school',
    color: 'cyan',
  },
  {
    badge: 'EDTECH DEVICE',
    icon: Tablet,
    name: 'AERIXA AI Educational Device',
    desc: 'Compact AI companion for instant student queries and personalized learning experiences.',
    cta: 'Get Quote',
    ctaHref: '/innovations#edu-device',
    color: 'cyan',
  },
  {
    badge: 'SAFETY WEARABLE',
    icon: Shield,
    name: 'NAARIX AI Smart Safety Band',
    desc: 'Wearable safety device for women with real-time emergency detection and instant SOS alerts.',
    cta: 'Pre-Order',
    ctaHref: '/innovations#naarix',
    color: 'orange',
  },
  {
    badge: 'AI ASSISTANT',
    icon: Bot,
    name: 'AI Assistant System',
    desc: 'Conversational AI for fast, context-aware responses — helping businesses and institutions instantly.',
    cta: 'Get Demo',
    ctaHref: '/innovations#ai-assistant',
    color: 'cyan',
  },
];

export default function ProductsSection() {
  return (
    <section className="py-24 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-label">OUR OFFERINGS</div>
          <h2 className="section-title">Innovations & <span>Products</span></h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Four flagship AI-powered products designed to transform education, safety, and everyday intelligence across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const Icon = product.icon;
            const isCyan = product.color === 'cyan';
            return (
              <div key={product.name} className="card group hover:-translate-y-2 transition-all duration-300 hover:border-brand-cyan/30 flex flex-col">
                {/* Badge */}
                <div className={`mb-4 ${isCyan ? 'badge-cyan' : 'badge-orange'} self-start`}>
                  {product.badge}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  isCyan ? 'bg-brand-cyan/10 border border-brand-cyan/20' : 'bg-brand-orange/10 border border-brand-orange/20'
                }`}>
                  <Icon className={`w-7 h-7 ${isCyan ? 'text-brand-cyan' : 'text-brand-orange'}`} />
                </div>

                {/* Content */}
                <h3 className="font-heading font-bold text-white text-base mb-2 leading-snug">{product.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-6">{product.desc}</p>

                {/* CTAs */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={product.ctaHref}
                    className={`flex-1 text-center text-sm font-semibold font-heading py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      isCyan
                        ? 'bg-brand-orange text-white hover:bg-orange-600'
                        : 'bg-brand-orange text-white hover:bg-orange-600'
                    }`}
                  >
                    {product.cta}
                  </Link>
                  <Link
                    href={product.ctaHref}
                    className="px-3 py-2.5 rounded-lg border border-brand-navy-border text-slate-400 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all duration-200 text-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/innovations" className="btn-outline">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
