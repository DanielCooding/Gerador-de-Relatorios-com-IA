import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gerador de Relatórios com IA',
  description: 'Faça upload de PDF ou CSV e deixe a IA resumir, analisar e conversar com seu documento.',
  keywords: ['relatório', 'IA', 'PDF', 'CSV', 'GROQ', 'análise de documentos'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
