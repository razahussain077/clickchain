'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading, error]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (messages.length === 0) {
        getGreeting();
      }
    }
  }, [isOpen]);
  
  const addAssistantMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: 'assistant', content }]);
  };
  
  const getGreeting = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }),
      });
      
      console.log('Backend Response:', res);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch greeting.');
      }
      
      addAssistantMessage(data.message);
      
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown network error occurred.';
      setError(errorMsg);
      console.error("Error fetching greeting:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      console.log('Backend Response:', res);
      const data = await res.json();

      if (!res.ok) {
        // This will catch HTTP errors (e.g., 500, 401) and display the backend error
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }
      
      addAssistantMessage(data.message);

    } catch (err: unknown) {
      // This will catch network errors or errors from the check above
      const errorMsg = err instanceof Error ? err.message : 'An unknown network error occurred. Please try again.';
      addAssistantMessage(`Sorry, I ran into an issue: "${errorMsg}"`);
      console.error("Error sending message:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-slate-700 hover:bg-slate-600' : 'bg-[#2563EB] hover:bg-[#1E40AF]'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={26} className="text-white" /> : <MessageCircle size={26} className="text-white" />}
      </button>

      <div className={`fixed bottom-28 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '560px' }}>
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🦷</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Bright Smile Dental</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-100 text-xs">Online — We'll reply shortly</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#2563EB] text-white rounded-2xl rounded-br-md' : 'bg-white text-slate-800 rounded-2xl rounded-bl-md shadow-sm border border-slate-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {error && (
               <div className="flex justify-start">
                <div className="bg-red-100 text-red-700 max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl rounded-bl-md shadow-sm border border-red-200 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type your message..." className="flex-1 text-sm text-slate-800 placeholder-slate-400 bg-slate-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2563EB]/30 transition" />
              <button onClick={sendMessage} disabled={!input.trim() || isLoading} className="w-10 h-10 rounded-full bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-slate-300 flex items-center justify-center transition-colors">
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 py-2 text-center">
            <a href="https://clickchain.io" target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-[#2563EB] transition-colors">
              Powered by <span className="font-semibold">ClickChain AI</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
