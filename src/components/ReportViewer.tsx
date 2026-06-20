import { Report } from '@/types';
import { CheckCircle, AlignLeft } from 'lucide-react';

interface Props {
  report: Report;
}

export default function ReportViewer({ report }: Props) {
  return (
    <div className="flex flex-col gap-6">

      {/* Resumo */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
            <AlignLeft size={16} className="text-sky-400" />
          </div>
          <h2 className="font-semibold text-white">Resumo Executivo</h2>
        </div>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
      </div>

      {/* Pontos-chave */}
      {report.keyPoints.length > 0 && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <CheckCircle size={16} className="text-green-400" />
            </div>
            <h2 className="font-semibold text-white">Pontos-Chave</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {report.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
