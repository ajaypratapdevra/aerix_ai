'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, ChevronDown } from 'lucide-react';
import { inquiriesAPI } from '@/lib/api';

const STATUS_OPTIONS = ['new', 'read', 'replied', 'closed'];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    new: 'badge-cyan', read: 'badge-yellow', replied: 'badge-green', closed: 'badge-red'
  };
  return map[status] || 'badge-yellow';
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await inquiriesAPI.getAll(params);
      setInquiries(res.data.inquiries);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInquiries(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await inquiriesAPI.updateStatus(id, { status });
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-white text-2xl">Inquiries & Contact</h2>
          <p className="text-slate-400 mt-1">Messages received from the contact form.</p>
        </div>
        <span className="badge-orange">{inquiries.filter(i => i.status === 'new').length} new</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setFilter('')} className={`badge cursor-pointer transition-all ${!filter ? 'badge-cyan' : 'bg-brand-navy-card text-slate-400 border border-brand-navy-border hover:text-white'}`}>All</button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`badge cursor-pointer capitalize transition-all ${filter === s ? statusBadge(s) : 'bg-brand-navy-card text-slate-400 border border-brand-navy-border hover:text-white'}`}>{s}</button>
        ))}
      </div>

      {/* Inquiries list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-brand-navy-card rounded-xl border border-brand-navy-border animate-pulse" />)}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 card">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{inq.firstName} {inq.lastName}</h3>
                    <span className={`badge ${statusBadge(inq.status)} capitalize`}>{inq.status}</span>
                    <span className="badge bg-brand-navy-light text-slate-400 border border-brand-navy-border">{inq.inquiryType}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{inq.email}</span>
                    {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{inq.phone}</span>}
                    <span>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={inq.status}
                    onChange={e => updateStatus(inq._id, e.target.value)}
                    className="text-xs bg-brand-navy-light border border-brand-navy-border rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-brand-cyan/50 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                  <button
                    onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
                    className="text-slate-500 hover:text-brand-cyan transition-colors p-1"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === inq._id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expanded === inq._id && (
                <div className="mt-4 pt-4 border-t border-brand-navy-border animate-slide-up">
                  <p className="text-slate-300 text-sm leading-relaxed bg-brand-navy-light rounded-lg p-4 border border-brand-navy-border">
                    {inq.message}
                  </p>
                  <a
                    href={`mailto:${inq.email}?subject=Re: Your inquiry to AERIX AI`}
                    className="inline-flex items-center gap-2 mt-3 text-brand-cyan text-xs hover:text-cyan-400 transition-colors font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
