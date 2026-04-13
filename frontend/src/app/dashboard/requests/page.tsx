'use client';
import { useEffect, useState } from 'react';
import { requestsAPI } from '@/lib/api';
import { ClipboardList } from 'lucide-react';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestsAPI.getMy()
      .then(r => {
        const d = r.data;
        setRequests(Array.isArray(d) ? d : d?.requests || d?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl text-white mb-1">My Requests</h1>
      <p className="text-slate-400 text-sm mb-6">Your product demo requests</p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No requests yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((r: any) => (
            <div key={r._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{r.subject || 'Request'}</h3>
                  <p className="text-slate-400 text-sm">{r.message}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
