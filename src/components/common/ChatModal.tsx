import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Store,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  time: string;
}

export const ChatModal: React.FC = () => {
  const { isChatModalOpen, setIsChatModalOpen, chatStoreTarget } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'seller',
      text: `Halo! Selamat datang di ${
        chatStoreTarget?.name || 'Toko UMKM kami'
      }. Ada yang bisa kami bantu mengenai produk kerajinan atau kuliner khas kami?`,
      time: 'Baru saja'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  if (!isChatModalOpen || !chatStoreTarget) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate friendly realistic reply from UMKM seller
    setTimeout(() => {
      let reply = `Terima kasih telah menghubungi ${chatStoreTarget.name}! Produk kami ready stock dan langsung dikirim dari sentra pengrajin di ${chatStoreTarget.kabupaten}, ${chatStoreTarget.provinsi}. Silakan langsung checkout ya kak!`;

      if (userText.toLowerCase().includes('ongkir') || userText.toLowerCase().includes('kirim')) {
        reply = `Pengiriman kami menggunakan JNE, Pos Indonesia, SiCepat, atau J&T Express. Paket dipacking aman dengan bubble wrap tebal dan kardus higienis kak.`;
      } else if (userText.toLowerCase().includes('asli') || userText.toLowerCase().includes('ori')) {
        reply = `Jaminan 100% asli kak! Toko kami memiliki NIB resmi ${chatStoreTarget.nib} dan dibina langsung dalam program UMKM Nusantara.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'seller',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full h-[520px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-3.5 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={chatStoreTarget.logo}
              alt=""
              className="w-9 h-9 rounded-xl object-cover border border-emerald-400"
            />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-bold text-xs truncate max-w-[200px]">{chatStoreTarget.name}</p>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <p className="text-[10px] text-emerald-200">
                Online &middot; {chatStoreTarget.kabupaten}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChatModalOpen(false)}
            className="p-1 rounded-lg text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{m.time}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Ketik pesan untuk penjual UMKM..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
