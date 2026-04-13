'use client';
import { useEffect, useState } from 'react';
import { bookingsAPI } from '@/lib/api';
import { Calendar } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getMy()
      .then(r => {
        const d = r.data;
        setBookings(Array.isArray(d) ? d : d?.bookings || d?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl text-white mb-1">My Bookings</h1>
      <p className="text-slate-400 text-sm mb-6">Your workshop bookings</p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No bookings yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b: any) => (
            <div key={b._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{b.workshop?.title || 'Workshop'}</h3>
                  <p className="text-slate-400 text-sm">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
