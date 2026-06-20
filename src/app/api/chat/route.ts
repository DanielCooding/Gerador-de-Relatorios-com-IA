import { NextRequest, NextResponse } from 'next/server';
import { activeProvider } from '@/lib/providers';
import { storage } from '@/lib/storage';
import { Message } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { documentId, messages } = (await req.json()) as {
      documentId: string;
      messages: Message[];
    };

    if (!documentId || !messages?.length) {
      return NextResponse.json({ error: 'documentId e messages são obrigatórios.' }, { status: 400 });
    }

    const doc = storage.getDocument(documentId);
    if (!doc) {
      return NextResponse.json({ error: 'Documento não encontrado.' }, { status: 404 });
    }

    const stream = await activeProvider.chat(messages, doc.content);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[chat] Erro:', err);
    return NextResponse.json({ error: 'Erro no chat.' }, { status: 500 });
  }
}
