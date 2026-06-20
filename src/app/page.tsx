'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadArea from '@/components/UploadArea';
import Navbar from '@/components/Navbar';
import { FileText, Sparkles, MessageSquare, Download } from 'lucide-react';

const features = [
  {
    icon: <FileText size={22} />,
    title: 'Upload PDF ou CSV',
    desc: 'Arraste e solte ou selecione arquivos de até 20 MB.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Resumo com IA',
    desc: 'A IA extrai pontos-chave e gera um resumo executivo automático.',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Chat com o Documento',
    desc: 'Faça perguntas sobre o conteúdo em linguagem natural.',
  },
  {
    icon: <Download size={22} />,
    title: 'Exportar Relatório',
    desc: 'Baixe o relatório formatado em PDF com um clique.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(file: File) {
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no upload.');
      router.push(`/report/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro inesperado.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-20 text-center animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-medium mb-6">
          <Sparkles size={14} />
          Powered by GROQ · Llama 3
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
          Gerador de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            Relatórios com IA
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-400 max-w-xl">
          Faça upload de um arquivo PDF ou CSV e deixe a IA resumir, analisar e responder suas dúvidas sobre o documento.
        </p>

        <div className="mt-10 w-full max-w-xl">
          <UploadArea onUpload={handleUpload} loading={loading} />
          {error && (
            <p className="mt-3 text-sm text-red-400 flex items-center gap-2">
              <span>⚠</span> {error}
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 hover:border-sky-500/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Gerador de Relatórios com IA · Open Source ·{' '}
        <a
          href="https://github.com/DanielCooding/Gerador-de-Relatorios-com-IA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:underline"
        >
          GitHub
        </a>
      </footer>
    </main>
  );
}
