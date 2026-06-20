/**
 * Storage baseado em arquivos JSON no disco.
 * Sobrevive ao hot reload do Next.js em desenvolvimento.
 * Em produção (Vercel/Railway), use Redis ou Supabase.
 */
import fs from 'fs';
import path from 'path';
import { UploadedDocument, Report } from '@/types';

const TMP_DIR = path.join(process.cwd(), '.tmp-storage');
const DOCS_FILE = path.join(TMP_DIR, 'documents.json');
const REPORTS_FILE = path.join(TMP_DIR, 'reports.json');

function ensureDir() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string): Record<string, T> {
  ensureDir();
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

function writeJSON<T>(filePath: string, data: Record<string, T>) {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const storage = {
  saveDocument(doc: UploadedDocument) {
    const docs = readJSON<UploadedDocument>(DOCS_FILE);
    docs[doc.id] = doc;
    writeJSON(DOCS_FILE, docs);
  },

  getDocument(id: string): UploadedDocument | undefined {
    const docs = readJSON<UploadedDocument>(DOCS_FILE);
    return docs[id];
  },

  saveReport(report: Report) {
    const reports = readJSON<Report>(REPORTS_FILE);
    reports[report.id] = report;
    writeJSON(REPORTS_FILE, reports);
  },

  getReport(id: string): Report | undefined {
    const reports = readJSON<Report>(REPORTS_FILE);
    return reports[id];
  },

  getReportByDocumentId(docId: string): Report | undefined {
    const reports = readJSON<Report>(REPORTS_FILE);
    return Object.values(reports).find((r) => r.documentId === docId);
  },
};
