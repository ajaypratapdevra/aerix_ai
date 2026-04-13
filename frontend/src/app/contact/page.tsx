'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatWidget from '@/components/ui/ChatWidget';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { inquiriesAPI } from '@/lib/api';

const INQUIRY_TYPES = ['School Workshop Booking', 'Product Demo', 'General Inquiry', 'Partnership', 'Other'];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', inquiryType: 'General Inquiry', message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await inquiriesAPI.create(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="section-label">GET IN TOUCH</div>
            <h1 className="section-title">Let's Work <span>Together</span></h1>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Whether you're a school principal, investor, or just curious about our products — we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Phone', lines: ['+91 9358855881', '+91 7742126600', '+91 8200589187'], href: 'tel:+919358855881' },
                { icon: Mail, label: 'Email', lines: ['aerixteam@gmail.com'], href: 'mailto:aerixteam@gmail.com' },
                { icon: MapPin, label: 'Location', lines: ['India — Serving schools nationwide'], href: null },
              ].map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="card flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-heading font-semibold tracking-wider uppercase mb-1">{info.label}</p>
                      {info.lines.map((line, i) => (
                        info.href
                          ? <a key={i} href={info.href} className="block text-white text-sm hover:text-brand-cyan transition-colors">{line}</a>
                          : <p key={i} className="text-white text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-xl mb-2">Message Sent! 🚀</h3>
                  <p className="text-slate-400 mb-6">We'll get back to you within 15 minutes.</p>
                  <button onClick={() => setSuccess(false)} className="btn-outline">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">First Name *</label>
                      <input name="firstName" required value={form.firstName} onChange={handleChange} placeholder="Your name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Last Name *</label>
                      <input name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Last name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Email *</label>
                      <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Phone</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Inquiry Type</label>
                    <select name="inquiryType" value={form.inquiryType} onChange={handleChange} className="select-field">
                      {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Message *</label>
                    <textarea name="message" required rows={5} value={form.message} onChange={handleChange}
                      placeholder="Tell us about your school or project..." className="input-field resize-none" />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
