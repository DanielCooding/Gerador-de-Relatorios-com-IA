/**
 * Armazenamento em memória (server-side, por processo).
 * Em produção, substitua por Redis ou banco de dados.
 */
import { UploadedDocument, Report } from '@/types';

const documents = new Map<string, UploadedDocument>();
const reports = new Map<string, Report>();

export const storage = {
  saveDocument(doc: UploadedDocument) {
    documents.set(doc.id, doc);
  },
  getDocument(id: string): UploadedDocument | undefined {
    return documents.get(id);
  },
  saveReport(report: Report) {
    reports.set(report.id, report);
  },
  getReport(id: string): Report | undefined {
    return reports.get(id);
  },
  getReportByDocumentId(docId: string): Report | undefined {
    for (const report of reports.values()) {
      if (report.documentId === docId) return report;
    }
    return undefined;
  },
};
