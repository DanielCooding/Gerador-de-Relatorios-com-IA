'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ChatWindow from '@/components/ChatWindow';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1 flex flex-col animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-bold text-white">Chat com o Documento</h1>
            <p className="text-xs text-slate-400">Faça perguntas sobre o conteúdo do arquivo</p>
          </div>
        </div>
        <ChatWindow documentId={id} />
      </div>
    </main>
  );
}
