'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Spinner from './Spinner';
import { cn } from '@/lib/utils';

interface Props {
  onUpload: (file: File) => void;
  loading?: boolean;
}

const ACCEPTED = ['application/pdf', 'text/csv', 'application/vnd.ms-excel'];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export default function UploadArea({ onUpload, loading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');

  function validate(file: File): string | null {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'csv'].includes(ext || '')) return 'Apenas arquivos PDF ou CSV são suportados.';
    if (file.size > MAX_SIZE) return 'Arquivo muito grande. Máximo: 20 MB.';
    return null;
  }

  function handleFile(file: File) {
    const err = validate(file);
    if (err) { setLocalError(err); return; }
    setLocalError('');
    setSelected(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleSubmit() {
    if (selected) onUpload(selected);
  }

  const formatSize = (n: number) => n < 1024 * 1024
    ? `${(n / 1024).toFixed(1)} KB`
    : `${(n / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !selected && inputRef.current?.click()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
          dragging
            ? 'border-sky-400 bg-sky-500/10'
            : selected
            ? 'border-green-500/60 bg-green-500/5 cursor-default'
            : 'border-slate-600 bg-slate-800/50 hover:border-sky-500/60 hover:bg-slate-800',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv"
          className="hidden"
          onChange={handleChange}
        />

        {selected ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center">
              <FileText size={28} className="text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{selected.name}</p>
              <p className="text-sm text-slate-400">{formatSize(selected.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors',
              dragging ? 'bg-sky-500/20' : 'bg-slate-700/70',
            )}>
              <Upload size={26} className={dragging ? 'text-sky-400' : 'text-slate-400'} />
            </div>
            <div>
              <p className="font-semibold text-white">Arraste seu arquivo aqui</p>
              <p className="text-sm text-slate-400 mt-1">
                ou <span className="text-sky-400">clique para selecionar</span>
              </p>
            </div>
            <p className="text-xs text-slate-500">PDF ou CSV · até 20 MB</p>
          </>
        )}
      </div>

      {localError && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span>⚠</span> {localError}
        </p>
      )}

      {selected && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
        >
          {loading ? (
            <><Spinner size={18} /> Processando...</>
          ) : (
            'Gerar Relatório →'
          )}
        </button>
      )}
    </div>
  );
}
