'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Rocket } from 'lucide-react';
import { chatAPI } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickReplies = [
  'Show me your workshops',
  'Tell me about NAARIX',
  'How to book a workshop?',
  'What products do you have?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 🚀 I\'m the AERIX AI Assistant. I can help you learn about our products, workshops, and how to get started. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await chatAPI.send({ message: text, sessionId, conversationHistory: history });
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again or contact us at aerixteam@gmail.com 📧',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[350px] sm:w-[380px] h-[520px] bg-brand-navy-card border border-brand-navy-border rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-brand-navy-border bg-brand-navy-light">
            <div className="w-9 h-9 bg-brand-cyan/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <Rocket className="w-5 h-5 text-brand-cyan" />
            </div>
            <div className="flex-1">
              <div className="font-heading font-bold text-white text-sm">AERIX AI Assistant</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-green-400 text-xs">Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-brand-orange/20 border border-brand-orange/30'
                    : 'bg-brand-cyan/20 border border-brand-cyan/30'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-brand-orange" />
                    : <Bot className="w-3.5 h-3.5 text-brand-cyan" />
                  }
                </div>
                <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-orange/20 text-white border border-brand-orange/20'
                    : 'bg-brand-navy-light text-slate-300 border border-brand-navy-border'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-brand-cyan" />
                </div>
                <div className="bg-brand-navy-light border border-brand-navy-border rounded-xl px-3.5 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="text-xs bg-brand-navy-light border border-brand-navy-border text-brand-cyan rounded-full px-3 py-1.5 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 transition-all duration-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-brand-navy-border">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-brand-navy-light border border-brand-navy-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 transition-all duration-200"
                maxLength={1000}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-brand-cyan rounded-full flex items-center justify-center shadow-cyan-glow hover:bg-cyan-400 transition-all duration-300 z-50 hover:scale-110 active:scale-95"
      >
        {isOpen
          ? <X className="w-6 h-6 text-brand-navy" />
          : <MessageCircle className="w-6 h-6 text-brand-navy" />
        }
      </button>
    </>
  );
}
