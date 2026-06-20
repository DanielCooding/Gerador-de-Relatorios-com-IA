import Groq from 'groq-sdk';
import { AIProvider } from '../aiProvider';
import { Message } from '@/types';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

export const groqProvider: AIProvider = {
  async summarize(text: string, fileName: string) {
    const prompt = `Você é um assistente especializado em análise de documentos.

Analise o seguinte documento chamado "${fileName}" e forneça:
1. Um resumo executivo claro e objetivo (máximo 3 parágrafos)
2. Entre 5 e 8 pontos-chave mais importantes do documento

Responda OBRIGATORIAMENTE no seguinte formato JSON (sem markdown):
{
  "summary": "resumo aqui...",
  "keyPoints": ["ponto 1", "ponto 2", "ponto 3"]
}

Documento:
---
${text.slice(0, 12000)}
---`;

    const response = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);

    return {
      summary: parsed.summary || 'Resumo não disponível.',
      keyPoints: parsed.keyPoints || [],
    };
  },

  async chat(history: Message[], context: string) {
    const systemPrompt = `Você é um assistente inteligente que responde perguntas sobre um documento.
Responda sempre em português, de forma clara e objetiva.
Base todas as suas respostas APENAS no conteúdo do documento abaixo.
Se a resposta não estiver no documento, diga isso claramente.

CONTEÚDO DO DOCUMENTO:
---
${context.slice(0, 10000)}
---`;

    const stream = await groqClient.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.5,
      stream: true,
    });

    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });
  },
};
