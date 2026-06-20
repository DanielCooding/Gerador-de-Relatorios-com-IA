import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseCSV } from '@/lib/parsers/csvParser';
import { storage } from '@/lib/storage';
import { FileType } from '@/types';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const fileName = file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!['pdf', 'csv'].includes(extension || '')) {
      return NextResponse.json({ error: 'Formato inválido. Apenas PDF e CSV são suportados.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let content = '';
    if (extension === 'pdf') {
      content = await parsePDF(buffer);
    } else {
      content = parseCSV(buffer.toString('utf-8'));
    }

    if (!content.trim()) {
      return NextResponse.json({ error: 'Não foi possível extrair texto do arquivo.' }, { status: 422 });
    }

    const doc = {
      id: uuidv4(),
      name: fileName,
      type: extension as FileType,
      content,
      uploadedAt: new Date().toISOString(),
    };

    storage.saveDocument(doc);

    return NextResponse.json({ id: doc.id, name: doc.name, type: doc.type });
  } catch (err) {
    console.error('[upload] Erro:', err);
    return NextResponse.json({ error: 'Erro ao processar o arquivo.' }, { status: 500 });
  }
}
