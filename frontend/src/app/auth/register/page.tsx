'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Rocket, Mail, Lock, Eye, EyeOff, User, Phone, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', schoolName: '', phone: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        schoolName: form.schoolName,
        phone: form.phone
      });
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'text-red-400', width: 'w-1/4' };
    if (p.length < 10) return { label: 'Fair', color: 'text-yellow-400', width: 'w-1/2' };
    if (p.length < 14) return { label: 'Good', color: 'text-brand-cyan', width: 'w-3/4' };
    return { label: 'Strong', color: 'text-green-400', width: 'w-full' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-brand-navy bg-grid flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Rocket className="w-8 h-8 text-brand-cyan" />
            <span className="font-heading font-bold text-white text-xl tracking-wider">
              AERIX <span className="text-brand-cyan">AI</span>
            </span>
          </Link>
          <h1 className="font-heading font-bold text-white text-2xl">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join AERIX AI and explore the future</p>
        </div>

        <div className="card">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="name" type="text" required value={form.name} onChange={handleChange}
                  placeholder="Your full name" className="input-field pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="your@email.com" className="input-field pl-10" />
              </div>
            </div>

            {/* School Name */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">School / Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="schoolName" type="text" value={form.schoolName} onChange={handleChange}
                  placeholder="Your school or organization name" className="input-field pl-10" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+91 XXXXXXXXXX" className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="password" type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-brand-navy-border rounded-full overflow-hidden">
                    <div className={`h-full ${strength.width} bg-current ${strength.color} transition-all duration-300`} />
                  </div>
                  <span className={`text-xs mt-1 ${strength.color}`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input name="confirmPassword" type={showPass ? 'text' : 'password'} required
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password" className="input-field pl-10 pr-10" />
                {form.confirmPassword && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand-cyan hover:text-cyan-400 font-medium">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
            ← Back to AERIX AI
          </Link>
        </div>
      </div>
    </div>
  );
}
