'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Message } from '@/types';
import { Send, Bot, User } from 'lucide-react';
import Spinner from './Spinner';
import { cn } from '@/lib/utils';

interface Props {
  documentId: string;
}

export default function ChatWindow({ documentId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || streaming) return;

    const userMsg: Message = { role: 'user', content };
    const newHistory: Message[] = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setStreaming(true);

    // placeholder do assistant para streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, messages: newHistory }),
      });

      if (!res.ok || !res.body) throw new Error('Erro na requisição.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantText },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '⚠ Ocorreu um erro. Tente novamente.' },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 min-h-[400px] max-h-[60vh]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center">
              <Bot size={28} className="text-sky-400" />
            </div>
            <p className="font-semibold text-white">Converse com seu documento</p>
            <p className="text-sm text-slate-400 max-w-xs">
              Faça perguntas sobre o conteúdo do arquivo. Eu respondo com base no que foi carregado.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn('flex items-start gap-3', msg.role === 'user' && 'flex-row-reverse')}
          >
            {/* Avatar */}
            <div className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
              msg.role === 'user'
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-slate-700 text-slate-300',
            )}>
              {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>

            {/* Balão */}
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-sky-600 text-white rounded-tr-sm'
                : 'bg-slate-700/70 text-slate-200 rounded-tl-sm',
            )}>
              {msg.content || (
                <span className="flex items-center gap-2 text-slate-400">
                  <Spinner size={14} /> Pensando...
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={streaming}
            placeholder="Escreva sua pergunta... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-60"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-sky-500/20 flex-shrink-0"
          >
            {streaming ? <Spinner size={16} /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Shift+Enter para nova linha</p>
      </div>
    </div>
  );
}
