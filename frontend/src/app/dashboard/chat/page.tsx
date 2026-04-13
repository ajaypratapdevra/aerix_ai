'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Rocket, Sparkles } from 'lucide-react';
import { chatAPI } from '@/lib/api';

interface Message { role: 'user' | 'assistant'; content: string; }

const quickReplies = [
  'What workshops do you offer?',
  'Tell me about NAARIX Safety Band',
  'How to book a workshop for my school?',
  'What is the AERIX Smart School System?',
  'What are your contact details?',
];

export default function DashboardChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hello! 🚀 I\'m the AERIX AI Assistant. I can help you with information about our products, workshops, bookings, and more. What would you like to know?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await chatAPI.send({ message: text, sessionId, conversationHistory: history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please contact us at aerixteam@gmail.com 📧'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-brand-navy-card border border-brand-navy-border rounded-t-2xl">
        <div className="w-10 h-10 bg-brand-cyan/20 rounded-full flex items-center justify-center animate-pulse-glow">
          <Rocket className="w-5 h-5 text-brand-cyan" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-white text-sm">AERIX AI Assistant</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-green-400 text-xs">Online — Powered by GPT-4o-mini</span>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-brand-orange ml-auto" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-brand-navy-light border-x border-brand-navy-border p-6 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-brand-orange/20 border border-brand-orange/30' : 'bg-brand-cyan/20 border border-brand-cyan/30'
            }`}>
              {msg.role === 'user'
                ? <User className="w-4 h-4 text-brand-orange" />
                : <Bot className="w-4 h-4 text-brand-cyan" />
              }
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-orange/15 text-white border border-brand-orange/20 rounded-tr-sm'
                : 'bg-brand-navy-card text-slate-300 border border-brand-navy-border rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-cyan" />
            </div>
            <div className="bg-brand-navy-card border border-brand-navy-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick replies — show only at start */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            <p className="w-full text-slate-500 text-xs mb-1">Quick questions:</p>
            {quickReplies.map(r => (
              <button key={r} onClick={() => sendMessage(r)}
                className="text-xs bg-brand-navy-card border border-brand-navy-border text-brand-cyan rounded-full px-3 py-1.5 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 transition-all duration-200">
                {r}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-brand-navy-card border border-t-0 border-brand-navy-border rounded-b-2xl">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
            placeholder="Ask me anything about AERIX AI..."
            className="flex-1 input-field"
            maxLength={1000}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="px-5 py-3 bg-brand-orange rounded-xl text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-heading font-semibold text-sm flex items-center gap-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-slate-600 text-xs mt-2 text-center">
          AERIX AI assistant may make mistakes. For critical decisions, contact aerixteam@gmail.com
        </p>
      </div>
    </div>
  );
}
