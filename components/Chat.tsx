import React, { useState, useEffect, useRef } from 'react';
import { Message, Screen, User } from '../types'; // Added Screen, User
import { getPartnerReply } from '../services/geminiService';
import MainLayout from './MainLayout'; // Import MainLayout

interface Props {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
  // Added props for MainLayout
  onNavigate: (screen: Screen) => void;
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const Chat: React.FC<Props> = ({
  messages,
  setMessages,
  onBack,
  onNavigate,
  user,
  onLogout,
  onUpdateUser
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const reply = await getPartnerReply(text);

    const partnerMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'partner',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIsTyping(false);
    setMessages(prev => [...prev, partnerMsg]);
  };

  const chips = ["👏 Fiz minha parte!", "🔋 Preciso de motivação", "💪 Vamos lá!", "🌟 Dia incrível!"];

  return (
    <MainLayout
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      onUpdateUser={onUpdateUser}
    >
      <div className="flex flex-col h-[calc(100vh-6rem)] relative bg-background-dark/50 rounded-2xl overflow-hidden border border-white/5 m-4">
        {/* Adjusted height and styling to fit inside MainLayout card-like container */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'partner' && (
                <div className="size-8 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                  <span className="material-symbols-outlined text-lg">face</span>
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'me' ? 'items-end' : ''}`}>
                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'me'
                  ? 'bg-primary text-background-dark font-medium rounded-br-none shadow-lg shadow-primary/10'
                  : 'bg-surface-dark border border-white/5 rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-3">
              <div className="size-8 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-lg">face</span>
              </div>
              <div className="bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center border border-white/5">
                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="size-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 bg-background-dark border-t border-white/5 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => setInputValue(chip)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:border-primary/50 hover:text-primary transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="relative flex items-center">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite algo motivador..."
              className="w-full bg-surface-dark border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 size-12 rounded-xl bg-primary text-background-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default Chat;
