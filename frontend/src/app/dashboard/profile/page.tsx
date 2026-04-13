'use client';
import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getMe()
      .then(r => setUser(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl text-white mb-1">Profile</h1>
      <p className="text-slate-400 text-sm mb-6">Your account details</p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : user ? (
        <div className="card max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-brand-cyan/20 rounded-full flex items-center justify-center">
              <span className="text-brand-cyan font-heading font-bold text-xl">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">{user.name}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan">{user.role}</span>
            </div>
          </div>
          <div className="space-y-3 border-t border-brand-navy-border pt-4">
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Phone</span>
              <span className="text-white text-sm">{user.phone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">School</span>
              <span className="text-white text-sm">{user.schoolName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Joined</span>
              <span className="text-white text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">Could not load profile.</p>
      )}
    </div>
  );
}
