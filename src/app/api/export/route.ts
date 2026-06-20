import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { ReportDocument } from '@/lib/reportDocument';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json({ error: 'reportId é obrigatório.' }, { status: 400 });
    }

    const report = storage.getReport(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Relatório não encontrado.' }, { status: 404 });
    }

    const pdfBuffer = await renderToBuffer(createElement(ReportDocument, { report }));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${report.id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[export] Erro:', err);
    return NextResponse.json({ error: 'Erro ao exportar relatório.' }, { status: 500 });
  }
}
