'use client';
import { useEffect, useState } from 'react';
import { chatAPI } from '@/lib/api';
import { MessageCircle } from 'lucide-react';

export default function AdminChatLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatAPI.getAllLogs()
      .then(r => {
        const d = r.data;
        setLogs(Array.isArray(d) ? d : d?.logs || d?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-white mb-1">Chat Logs</h1>
        <p className="text-slate-400 text-sm">All AI assistant conversations</p>
      </div>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-16">
          <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No chat logs yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {logs.map((log: any, i: number) => (
            <div key={i} className="card">
              <div className="flex justify-between mb-2">
                <span className="text-brand-cyan text-sm">{log.user?.name || 'Guest'}</span>
                <span className="text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 text-sm">{log.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
