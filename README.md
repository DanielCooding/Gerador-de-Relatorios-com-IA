# 📊 Gerador de Relatórios com IA

Um gerador de relatórios inteligente que aceita arquivos **PDF** e **CSV**, utiliza IA para resumir os dados, exportar relatórios e criar um chat interativo com o documento.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)
![GROQ](https://img.shields.io/badge/GROQ-AI-f55036?style=for-the-badge)

## ✨ Funcionalidades

- 📁 **Upload de arquivos** PDF e CSV com drag & drop
- 🤖 **Resumo automático** com IA (padrão: GROQ com Llama 3)
- 📄 **Exportação de relatório** em PDF formatado
- 💬 **Chat com o documento** com streaming em tempo real
- 🔌 **Suporte a múltiplos providers de IA** (plugável)

## 🚀 Como usar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta gratuita no [GROQ](https://console.groq.com) para obter a API Key

### Instalação

```bash
# Clone o repositório
git clone https://github.com/DanielCooding/Gerador-de-Relatorios-com-IA.git
cd Gerador-de-Relatorios-com-IA

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com sua API Key

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔌 Usando outro provider de IA

O projeto foi desenvolvido com uma interface agnóstica de IA. Para usar outro provider (OpenAI, Gemini, etc.), crie um arquivo em `src/lib/providers/` implementando a interface `AIProvider`:

```typescript
import { AIProvider } from '../aiProvider';

export const myProvider: AIProvider = {
  async summarize(text: string) {
    // sua implementação aqui
  },
  async chat(history, context) {
    // sua implementação aqui
  },
};
```

Depois, altere o import em `src/lib/providers/index.ts`.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                  # Página inicial com upload
│   ├── report/[id]/page.tsx      # Visualização do relatório
│   └── chat/[id]/page.tsx        # Chat com o documento
├── api/
│   ├── upload/route.ts           # Recebe e processa arquivos
│   ├── summarize/route.ts        # Gera resumo com IA
│   ├── export/route.ts           # Exporta relatório em PDF
│   └── chat/route.ts             # Chat com streaming
├── components/
│   ├── UploadArea.tsx
│   ├── ReportViewer.tsx
│   ├── ChatWindow.tsx
│   └── ExportButton.tsx
└── lib/
    ├── aiProvider.ts             # Interface base de IA
    ├── providers/
    │   └── groq.ts               # Provider GROQ (padrão)
    └── parsers/
        ├── pdfParser.ts
        └── csvParser.ts
```

## 🛠️ Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|---|---|---|
| `GROQ_API_KEY` | Chave da API GROQ | Sim (se usar GROQ) |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | Não |

## 📦 Deploy

### Vercel (Recomendado)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DanielCooding/Gerador-de-Relatorios-com-IA)

### Railway
Importe o repositório no [Railway](https://railway.app) e configure as variáveis de ambiente.

## 📝 Licença

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro.
