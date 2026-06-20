export type FileType = 'pdf' | 'csv';

export interface UploadedDocument {
  id: string;
  name: string;
  type: FileType;
  content: string;       // texto extraído do arquivo
  uploadedAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Report {
  id: string;
  documentId: string;
  documentName: string;
  summary: string;
  keyPoints: string[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  documentId: string;
  messages: Message[];
}
