import Link from 'next/link';
import { Rocket, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy-light border-t border-brand-navy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Rocket className="w-8 h-8 text-brand-cyan" />
              <span className="font-heading font-bold text-white text-xl tracking-wider">
                AERIX <span className="text-brand-cyan">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Aerospace & AI Based Solutions for Emerging India. Pioneering intelligent technologies 
              that empower education, safety & innovation.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-brand-navy-card border border-brand-navy-border rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {[
                { href: '/innovations', label: 'Innovations & Products' },
                { href: '/workshops', label: 'Workshops' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/team', label: 'Our Team' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-brand-cyan text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm tracking-wider mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                <a href="mailto:aerixteam@gmail.com" className="hover:text-brand-cyan transition-colors">
                  aerixteam@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+919358855881" className="block hover:text-brand-cyan transition-colors">+91 9358855881</a>
                  <a href="tel:+917742126600" className="block hover:text-brand-cyan transition-colors">+91 7742126600</a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-brand-cyan mt-0.5 flex-shrink-0" />
                <span>India — Serving schools nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glow-line my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 AERIX AI. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs font-heading tracking-wider">
            AEROSPACE INTELLIGENCE FOR EMERGING INDIA
          </p>
        </div>
      </div>
    </footer>
  );
}
