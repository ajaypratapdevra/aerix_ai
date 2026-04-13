'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, ClipboardList, MessageSquare,
  Wrench, LogOut, Rocket, Menu, Shield, ChevronRight, MessageCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/workshops', label: 'Workshops', icon: BookOpen },
  { href: '/admin/bookings', label: 'All Bookings', icon: ClipboardList },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/chat-logs', label: 'Chat Logs', icon: MessageCircle },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, initAuth, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { initAuth(); }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/auth/login');
      else if (user.role !== 'admin') router.push('/dashboard');
    }
  }, [user, isLoading]);

  const handleLogout = () => { logout(); router.push('/'); };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <Rocket className="w-10 h-10 text-brand-cyan animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-navy-light border-r border-brand-navy-border z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="p-6 border-b border-brand-navy-border">
          <Link href="/" className="flex items-center gap-2 mb-1">
            <Rocket className="w-7 h-7 text-brand-cyan" />
            <span className="font-heading font-bold text-white text-base tracking-wider">AERIX <span className="text-brand-cyan">AI</span></span>
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-brand-orange text-xs font-heading font-semibold tracking-wider">ADMIN PANEL</span>
          </div>
        </div>

        <div className="p-4 border-b border-brand-navy-border">
          <div className="flex items-center gap-3 p-3 bg-brand-navy-card rounded-xl">
            <div className="w-9 h-9 bg-brand-orange/20 border border-brand-orange/30 rounded-full flex items-center justify-center">
              <span className="text-brand-orange font-heading font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <span className="badge-orange text-xs">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={isActive ? 'nav-item-active' : 'nav-item'}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-navy-border space-y-1">
          <Link href="/dashboard" className="nav-item text-sm">
            <LayoutDashboard className="w-4 h-4" /> Customer View
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-brand-navy-light border-b border-brand-navy-border flex items-center gap-4 px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-heading font-semibold text-white text-sm flex-1">
            {navItems.find(n => n.href === pathname)?.label || 'Admin'}
          </h1>
          <Link href="/" className="text-slate-500 hover:text-brand-cyan text-xs transition-colors hidden sm:block">← Back to site</Link>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
