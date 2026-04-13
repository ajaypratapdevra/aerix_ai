'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ClipboardList, MessageCircle, BookOpen, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { bookingsAPI, requestsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'badge-yellow', confirmed: 'badge-green',
    cancelled: 'badge-red', completed: 'badge-cyan',
    new: 'badge-cyan', in_progress: 'badge-yellow'
  };
  return map[status] || 'badge-yellow';
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, rRes] = await Promise.all([bookingsAPI.getMy(), requestsAPI.getMy()]);
        setBookings(bRes.data.bookings.slice(0, 3));
        setRequests(rRes.data.requests.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { href: '/dashboard/book', label: 'Book Workshop', icon: BookOpen, color: 'cyan', desc: 'Schedule a session for your school' },
    { href: '/dashboard/products', label: 'Browse Products', icon: ClipboardList, color: 'orange', desc: 'Request demo or quote' },
    { href: '/dashboard/chat', label: 'AI Assistant', icon: MessageCircle, color: 'cyan', desc: 'Ask anything about AERIX AI' },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar, color: 'orange', desc: 'View all your bookings' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="font-heading font-bold text-white text-2xl">
          Welcome back, <span className="text-brand-cyan">{user?.name.split(' ')[0]}</span> 👋
        </h2>
        <p className="text-slate-400 mt-1">Here's what's happening with your AERIX AI account.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isCyan = action.color === 'cyan';
          return (
            <Link key={action.href} href={action.href} className="card group hover:-translate-y-1 hover:border-brand-cyan/30 transition-all duration-300">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isCyan ? 'bg-brand-cyan/10' : 'bg-brand-orange/10'}`}>
                <Icon className={`w-5 h-5 ${isCyan ? 'text-brand-cyan' : 'text-brand-orange'}`} />
              </div>
              <h3 className="font-heading font-semibold text-white text-sm mb-1">{action.label}</h3>
              <p className="text-slate-500 text-xs">{action.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Bookings + Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-cyan" />
              Recent Bookings
            </h3>
            <Link href="/dashboard/bookings" className="text-brand-cyan text-xs hover:text-cyan-400 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-brand-navy-light rounded-lg animate-pulse" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No bookings yet</p>
              <Link href="/dashboard/book" className="text-brand-cyan text-xs mt-1 hover:text-cyan-400 inline-block">
                Book your first workshop →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="flex items-center gap-3 p-3 bg-brand-navy-light rounded-lg border border-brand-navy-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.workshopId?.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{b.schoolName}</p>
                  </div>
                  <span className={`badge ${statusBadge(b.status)} text-xs flex-shrink-0`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-white text-sm flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-orange" />
              Recent Requests
            </h3>
            <Link href="/dashboard/requests" className="text-brand-cyan text-xs hover:text-cyan-400 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-brand-navy-light rounded-lg animate-pulse" />)}
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No requests yet</p>
              <Link href="/dashboard/products" className="text-brand-cyan text-xs mt-1 hover:text-cyan-400 inline-block">
                Browse products →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r._id} className="flex items-center gap-3 p-3 bg-brand-navy-light rounded-lg border border-brand-navy-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.productId?.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5 capitalize">{r.type} request</p>
                  </div>
                  <span className={`badge ${statusBadge(r.status)} text-xs flex-shrink-0`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
