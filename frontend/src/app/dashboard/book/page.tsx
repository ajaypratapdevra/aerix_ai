'use client';
import { useEffect, useState } from 'react';
import { Clock, Users, CheckCircle, AlertCircle, Rocket } from 'lucide-react';
import { workshopsAPI, bookingsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export default function BookWorkshopPage() {
  const { user } = useAuthStore();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    schoolName: '', contactName: '', contactPhone: '',
    dateChosen: '', studentsCount: '', specialRequirements: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    workshopsAPI.getAll().then(res => {
      setWorkshops(res.data.workshops);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Pre-fill from user profile
    if (user) {
      setForm(f => ({ ...f, schoolName: user.schoolName || '', contactName: user.name, contactPhone: user.phone || '' }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { setError('Please select a workshop.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await bookingsAPI.create({ workshopId: selected._id, ...form, studentsCount: Number(form.studentsCount) });
      setSuccess(true);
      setSelected(null);
      setForm({ schoolName: user?.schoolName || '', contactName: user?.name || '', contactPhone: user?.phone || '', dateChosen: '', studentsCount: '', specialRequirements: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const workshopColors: Record<string, string> = {
    ai_tech: 'border-brand-cyan/40 bg-brand-cyan/5',
    safety: 'border-brand-orange/40 bg-brand-orange/5',
    chatbot: 'border-brand-cyan/40 bg-brand-cyan/5',
    aerospace: 'border-brand-cyan/40 bg-brand-cyan/5',
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="font-heading font-bold text-white text-2xl mb-3">Booking Submitted! 🚀</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Your workshop booking has been received. Our team will confirm within 15 minutes and contact you with details.
        </p>
        <button onClick={() => setSuccess(false)} className="btn-primary">Book Another Workshop</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-heading font-bold text-white text-2xl">Book a Workshop</h2>
        <p className="text-slate-400 mt-1">Select a workshop and fill in your school details.</p>
      </div>

      {/* Step 1: Select Workshop */}
      <div>
        <h3 className="font-heading font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-brand-cyan text-brand-navy rounded-full flex items-center justify-center text-xs font-bold">1</span>
          Choose a Workshop
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-brand-navy-card rounded-xl animate-pulse border border-brand-navy-border" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((w) => (
              <button
                key={w._id}
                onClick={() => setSelected(w)}
                className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  selected?._id === w._id
                    ? 'border-brand-cyan bg-brand-cyan/10 shadow-cyan-glow'
                    : `border-brand-navy-border hover:border-brand-cyan/30 bg-brand-navy-card ${workshopColors[w.workshopType] || ''}`
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-heading font-semibold text-white text-sm leading-snug">{w.title}</h4>
                  {selected?._id === w._id && <CheckCircle className="w-5 h-5 text-brand-cyan flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{w.targetAudience}</span>
                </div>
                <p className="text-brand-cyan text-sm font-heading font-bold">₹{w.price?.toLocaleString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Fill Details */}
      {selected && (
        <div className="animate-slide-up">
          <h3 className="font-heading font-semibold text-white text-sm mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-brand-cyan text-brand-navy rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Booking Details for: <span className="text-brand-cyan">{selected.title}</span>
          </h3>

          <form onSubmit={handleSubmit} className="card space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">School Name *</label>
                <input required value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})}
                  placeholder="Your school name" className="input-field" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Contact Name *</label>
                <input required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})}
                  placeholder="Your name" className="input-field" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Contact Phone *</label>
                <input required value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
                  placeholder="+91 XXXXXXXXXX" className="input-field" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Preferred Date *</label>
                <input required type="date" value={form.dateChosen} onChange={e => setForm({...form, dateChosen: e.target.value})}
                  className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Number of Students *</label>
                <input required type="number" min="1" value={form.studentsCount} onChange={e => setForm({...form, studentsCount: e.target.value})}
                  placeholder="e.g. 50" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Special Requirements</label>
              <textarea value={form.specialRequirements} onChange={e => setForm({...form, specialRequirements: e.target.value})}
                placeholder="Any special needs, equipment requests, or additional info..."
                rows={3} className="input-field resize-none" />
            </div>

            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setSelected(null)} className="btn-ghost border border-brand-navy-border">
                ← Change Workshop
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center disabled:opacity-50">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <><Rocket className="w-4 h-4" /> Submit Booking</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
