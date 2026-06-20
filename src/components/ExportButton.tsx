'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Spinner from './Spinner';

interface Props {
  reportId: string;
}

export default function ExportButton({ reportId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/export?reportId=${reportId}`);
      if (!res.ok) throw new Error('Falha ao exportar.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${reportId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors border border-slate-600 hover:border-slate-500"
    >
      {loading ? <Spinner size={16} /> : <Download size={16} />}
      {loading ? 'Exportando...' : 'Exportar PDF'}
    </button>
  );
}
