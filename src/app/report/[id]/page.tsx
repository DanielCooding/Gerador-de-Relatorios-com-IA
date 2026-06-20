'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ReportViewer from '@/components/ReportViewer';
import ExportButton from '@/components/ExportButton';
import Spinner from '@/components/Spinner';
import { Report } from '@/types';
import { MessageSquare, ArrowLeft } from 'lucide-react';

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao gerar relatório.');
        setReport(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erro inesperado.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-4 py-10 flex-1 animate-fadeIn">

        {/* Breadcrumb */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Novo upload
        </button>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center animate-pulse-ring">
              <Spinner size={32} className="text-sky-400" />
            </div>
            <p className="text-slate-400 text-sm">Analisando documento com IA...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">
            <p className="font-semibold mb-1">⚠ Erro</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {report && (
          <>
            {/* Header do relatório */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">{report.documentName}</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Gerado em {new Date(report.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-3">
                <ExportButton reportId={report.id} />
                <Link
                  href={`/chat/${id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/20"
                >
                  <MessageSquare size={16} />
                  Chat com o Doc
                </Link>
              </div>
            </div>

            <ReportViewer report={report} />
          </>
        )}
      </div>
    </main>
  );
}
