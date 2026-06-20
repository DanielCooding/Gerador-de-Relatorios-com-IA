import { Message } from '@/types';

/**
 * Interface base para providers de IA.
 * Implemente esta interface para adicionar suporte a outro provider (OpenAI, Gemini, etc.)
 */
export interface AIProvider {
  /**
   * Recebe o texto extraído do documento e retorna um resumo estruturado.
   */
  summarize(text: string, fileName: string): Promise<{ summary: string; keyPoints: string[] }>;

  /**
   * Recebe o histórico de mensagens e o contexto do documento,
   * e retorna um ReadableStream com a resposta da IA.
   */
  chat(history: Message[], context: string): Promise<ReadableStream<Uint8Array>>;
}
