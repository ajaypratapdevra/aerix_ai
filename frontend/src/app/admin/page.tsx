'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, ClipboardList, MessageSquare, BookOpen, TrendingUp, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'badge-yellow', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-cyan',
    new: 'badge-cyan', read: 'badge-yellow', replied: 'badge-green', closed: 'badge-red'
  };
  return map[status] || 'badge-yellow';
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statCards = data ? [
    { label: 'Total Users', value: data.stats.totalUsers, icon: Users, color: 'cyan', href: '/admin/users' },
    { label: 'Total Bookings', value: data.stats.totalBookings, icon: Calendar, color: 'orange', href: '/admin/bookings' },
    { label: 'Pending Bookings', value: data.stats.pendingBookings, icon: Clock, color: 'yellow', href: '/admin/bookings' },
    { label: 'New Inquiries', value: data.stats.newInquiries, icon: MessageSquare, color: 'orange', href: '/admin/inquiries' },
    { label: 'Total Requests', value: data.stats.totalRequests, icon: ClipboardList, color: 'cyan', href: '/admin/bookings' },
    { label: 'Active Workshops', value: data.stats.totalWorkshops, icon: BookOpen, color: 'green', href: '/admin/workshops' },
  ] : [];

  const colorMap: Record<string, string> = {
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20',
    orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading font-bold text-white text-2xl">Admin Dashboard</h2>
        <p className="text-slate-400 mt-1">Overview of all AERIX AI portal activity.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-brand-navy-card rounded-xl border border-brand-navy-border animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href} className="stat-card hover:-translate-y-0.5 transition-all duration-200 hover:border-brand-cyan/20">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[card.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-black text-white text-2xl">{card.value}</div>
                  <div className="text-slate-500 text-xs font-medium">{card.label}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Recent Bookings + Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-cyan" /> Recent Bookings
            </h3>
            <Link href="/admin/bookings" className="text-brand-cyan text-xs flex items-center gap-1 hover:text-cyan-400">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-brand-navy-light rounded-lg animate-pulse" />)}</div>
          ) : data?.recentBookings?.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No bookings yet</p>
          ) : (
            <div className="space-y-2.5">
              {data?.recentBookings?.map((b: any) => (
                <div key={b._id} className="flex items-center gap-3 p-3 bg-brand-navy-light rounded-lg border border-brand-navy-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{b.userId?.name}</p>
                    <p className="text-slate-500 text-xs truncate">{b.workshopId?.title}</p>
                  </div>
                  <span className={`badge ${statusBadge(b.status)} text-xs flex-shrink-0`}>{b.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Inquiries */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-orange" /> New Inquiries
            </h3>
            <Link href="/admin/inquiries" className="text-brand-cyan text-xs flex items-center gap-1 hover:text-cyan-400">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-brand-navy-light rounded-lg animate-pulse" />)}</div>
          ) : data?.recentInquiries?.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No new inquiries</p>
          ) : (
            <div className="space-y-2.5">
              {data?.recentInquiries?.map((inq: any) => (
                <div key={inq._id} className="flex items-center gap-3 p-3 bg-brand-navy-light rounded-lg border border-brand-navy-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{inq.firstName} {inq.lastName}</p>
                    <p className="text-slate-500 text-xs truncate">{inq.inquiryType}</p>
                  </div>
                  <span className={`badge ${statusBadge(inq.status)} text-xs flex-shrink-0`}>{inq.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
