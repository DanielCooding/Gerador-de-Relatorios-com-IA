import Papa from 'papaparse';

export function parseCSV(content: string): string {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields || [];
  const rows = result.data as Record<string, string>[];

  // Converte CSV para texto legível pela IA
  const lines = rows.map((row) =>
    headers.map((h) => `${h}: ${row[h] ?? ''}`).join(' | ')
  );

  return [
    `Arquivo CSV com ${rows.length} registros.`,
    `Colunas: ${headers.join(', ')}`,
    '',
    ...lines,
  ].join('\n');
}
