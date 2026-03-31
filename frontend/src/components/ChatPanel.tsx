import React, { useState } from 'react';
import { Send, Bot, User, X } from 'lucide-react';

export const ChatPanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Error: Brak polaczenia z backendem' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-6 top-6 bottom-24 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <Bot className="text-blue-400" size={20} />
                    <h3 className="font-bold text-slate-200">AI Agent</h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                            }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold">
                                {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                                {m.role}
                            </div>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-blue-400 text-xs animate-pulse">Agent myśli i klika...</div>}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-xl">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Napisz do Agenta..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-500 transition-colors p-2 rounded-lg text-white"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
