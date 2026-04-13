'use client';
import { useEffect, useState, useRef } from 'react';
import { workshopsAPI } from '@/lib/api';
import { BookOpen, Plus, Trash2, X, Upload, Image } from 'lucide-react';

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '', description: '', duration: '', price: '',
    targetAudience: '', workshopType: 'school', features: '', imageUrl: ''
  });

  const fetchWorkshops = () => {
    setLoading(true);
    workshopsAPI.getAll()
      .then(r => {
        const d = r.data;
        setWorkshops(Array.isArray(d) ? d : d?.workshops || d?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkshops(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm(f => ({ ...f, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.duration || !form.targetAudience) {
      alert('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await workshopsAPI.create({
        title: form.title,
        description: form.description,
        duration: form.duration,
        price: Number(form.price) || 0,
        targetAudience: form.targetAudience,
        workshopType: form.workshopType,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        imageUrl: form.imageUrl,
        isActive: true
      });
      setShowModal(false);
      setForm({ title: '', description: '', duration: '', price: '', targetAudience: '', workshopType: 'school', features: '', imageUrl: '' });
      setImagePreview('');
      fetchWorkshops();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to create workshop');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workshop?')) return;
    await workshopsAPI.delete(id).catch(() => {});
    fetchWorkshops();
  };

  const resetModal = () => {
    setShowModal(false);
    setImagePreview('');
    setForm({ title: '', description: '', duration: '', price: '', targetAudience: '', workshopType: 'school', features: '', imageUrl: '' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-white mb-1">Workshops</h1>
          <p className="text-slate-400 text-sm">{workshops.length} workshops</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Workshop
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : workshops.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">No workshops yet</p>
          <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2 text-sm">Add First Workshop</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workshops.map((w: any) => (
            <div key={w._id} className="card flex items-center gap-4">
              {w.imageUrl ? (
                <img src={w.imageUrl} alt={w.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-brand-navy-border flex items-center justify-center flex-shrink-0">
                  <Image className="w-6 h-6 text-slate-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-white font-semibold">{w.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-1">{w.description}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-brand-cyan">₹{w.price}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{w.duration}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{w.targetAudience}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(w._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-navy-card border border-brand-navy-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-xl text-white">Add Workshop</h2>
              <button onClick={resetModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">

              {/* Image Upload */}
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Workshop Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-brand-navy-border" />
                    <button
                      onClick={() => { setImagePreview(''); setForm(f => ({...f, imageUrl: ''})); }}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-brand-cyan/80 text-white text-xs px-3 py-1 rounded-full hover:bg-brand-cyan"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-brand-navy-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-500" />
                    <span className="text-slate-400 text-sm">Click to upload image</span>
                    <span className="text-slate-600 text-xs">PNG, JPG, WebP up to 5MB</span>
                  </button>
                )}
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Title *</label>
                <input className="input w-full" placeholder="e.g. AI & Robotics for Schools" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Description *</label>
                <textarea className="input w-full h-24 resize-none" placeholder="Workshop description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Duration *</label>
                  <input className="input w-full" placeholder="e.g. 2 Days" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Price (₹)</label>
                  <input className="input w-full" type="number" placeholder="1999" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Target Audience *</label>
                  <input className="input w-full" placeholder="e.g. Class 6-12" value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})} />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1 block">Type</label>
                  <select className="input w-full" value={form.workshopType} onChange={e => setForm({...form, workshopType: e.target.value})}>
                    <option value="school">School</option>
                    <option value="college">College</option>
                    <option value="corporate">Corporate</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Features (comma separated)</label>
                <input className="input w-full" placeholder="e.g. Hands-on demo, Certificate, Q&A" value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetModal} className="btn-outline flex-1 py-3">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-50">
                {saving ? 'Saving...' : 'Create Workshop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
