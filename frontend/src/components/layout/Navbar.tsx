'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Rocket, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/innovations', label: 'Innovations' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/team', label: 'Our Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-brand-navy/95 backdrop-blur-md border-b border-brand-navy-border shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-lg animate-pulse-glow" />
              <Rocket className="w-8 h-8 text-brand-cyan relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-heading font-bold text-white text-lg tracking-wider">
              AERIX <span className="text-brand-cyan">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body ${
                  pathname === link.href
                    ? 'text-brand-cyan bg-brand-cyan/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-navy-card border border-brand-navy-border hover:border-brand-cyan/30 transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-brand-cyan/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-cyan text-xs font-heading font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="badge-orange text-xs">Admin</span>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-brand-navy-card border border-brand-navy-border rounded-xl shadow-lg overflow-hidden z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <Shield className="w-4 h-4 text-brand-orange" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-brand-navy-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-sm w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">Login</Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-brand-navy-light border-t border-brand-navy-border pb-4 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-brand-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn-outline text-sm justify-center">Dashboard</Link>
                  <button onClick={handleLogout} className="text-red-400 text-sm py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)} className="btn-outline text-sm justify-center">Login</Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm justify-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
