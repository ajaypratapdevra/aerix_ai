'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => {
        const d = r.data;
        setUsers(Array.isArray(d) ? d : d?.users || d?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-white mb-1">Users</h1>
        <p className="text-slate-400 text-sm">{users.length} registered users</p>
      </div>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No users yet</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="border-b border-brand-navy-border">
              <tr>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Name</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Role</th>
                <th className="text-left p-4 text-slate-400 text-sm font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u._id} className="border-b border-brand-navy-border/50 hover:bg-brand-navy-card/50">
                  <td className="p-4 text-white">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-700 text-slate-300'}`}>{u.role}</span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
