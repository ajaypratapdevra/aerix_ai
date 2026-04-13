'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Package, Calendar, ClipboardList,
  MessageCircle, User, LogOut, Rocket, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/book', label: 'Book Workshop', icon: BookOpen },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/requests', label: 'My Requests', icon: ClipboardList },
  { href: '/dashboard/chat', label: 'AI Assistant', icon: MessageCircle },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initAuth, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Rocket className="w-10 h-10 text-brand-cyan animate-bounce" />
          <p className="text-slate-400 font-heading text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-navy-light border-r border-brand-navy-border z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Logo */}
        <div className="p-6 border-b border-brand-navy-border">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="w-7 h-7 text-brand-cyan" />
            <span className="font-heading font-bold text-white text-base tracking-wider">
              AERIX <span className="text-brand-cyan">AI</span>
            </span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-brand-navy-border">
          <div className="flex items-center gap-3 p-3 bg-brand-navy-card rounded-xl">
            <div className="w-9 h-9 bg-brand-cyan/20 border border-brand-cyan/30 rounded-full flex items-center justify-center">
              <span className="text-brand-cyan font-heading font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={isActive ? 'nav-item-active' : 'nav-item'}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-brand-navy-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-brand-navy-light border-b border-brand-navy-border flex items-center gap-4 px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading font-semibold text-white text-sm capitalize">
              {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <Link href="/" className="text-slate-500 hover:text-brand-cyan text-xs transition-colors hidden sm:block">
            ← Back to site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
