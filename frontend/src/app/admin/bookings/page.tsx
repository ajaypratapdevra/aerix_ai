'use client';
import { useEffect, useState } from 'react';
import { Calendar, Search, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'badge-yellow', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-cyan'
  };
  return map[status] || 'badge-yellow';
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await bookingsAPI.getAll(params);
      setBookings(res.data.bookings);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await bookingsAPI.updateStatus(id, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (err) { console.error(err); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-white text-2xl">All Bookings</h2>
          <p className="text-slate-400 mt-1">Manage and update workshop booking statuses.</p>
        </div>
        <span className="badge-cyan">{bookings.length} bookings</span>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setFilter('')} className={`badge cursor-pointer transition-all ${!filter ? 'badge-cyan' : 'bg-brand-navy-card text-slate-400 border border-brand-navy-border hover:text-white'}`}>
          All
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`badge cursor-pointer capitalize transition-all ${filter === s ? statusBadge(s) : 'bg-brand-navy-card text-slate-400 border border-brand-navy-border hover:text-white'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-brand-navy-light rounded-lg animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-navy-border">
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Workshop</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">School</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Students</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-slate-400 font-heading font-semibold text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy-border">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-brand-navy-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{b.userId?.name}</p>
                      <p className="text-slate-500 text-xs">{b.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{b.workshopId?.title}</p>
                      <p className="text-slate-500 text-xs">{b.workshopId?.duration}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{b.schoolName}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {b.dateChosen ? new Date(b.dateChosen).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{b.studentsCount}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${statusBadge(b.status)} capitalize`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        disabled={updatingId === b._id}
                        onChange={e => updateStatus(b._id, e.target.value)}
                        className="text-xs bg-brand-navy-light border border-brand-navy-border rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-brand-cyan/50 cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
