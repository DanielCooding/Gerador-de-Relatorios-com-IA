import { NextRequest, NextResponse } from 'next/server';
import { activeProvider } from '@/lib/providers';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId é obrigatório.' }, { status: 400 });
    }

    // Verifica se já existe relatório gerado
    const existing = storage.getReportByDocumentId(documentId);
    if (existing) return NextResponse.json(existing);

    const doc = storage.getDocument(documentId);
    if (!doc) {
      return NextResponse.json({ error: 'Documento não encontrado.' }, { status: 404 });
    }

    const { summary, keyPoints } = await activeProvider.summarize(doc.content, doc.name);

    const report = {
      id: uuidv4(),
      documentId: doc.id,
      documentName: doc.name,
      summary,
      keyPoints,
      createdAt: new Date().toISOString(),
    };

    storage.saveReport(report);

    return NextResponse.json(report);
  } catch (err) {
    console.error('[summarize] Erro:', err);
    return NextResponse.json({ error: 'Erro ao gerar resumo.' }, { status: 500 });
  }
}
