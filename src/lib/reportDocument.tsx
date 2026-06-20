import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Report } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 24,
    borderBottom: '2px solid #0ea5e9',
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 11,
    color: '#1e293b',
    lineHeight: 1.6,
  },
  keyPointItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 11,
    color: '#0ea5e9',
    marginRight: 6,
    marginTop: 1,
  },
  keyPointText: {
    fontSize: 11,
    color: '#1e293b',
    flex: 1,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 8,
  },
});

interface Props {
  report: Report;
}

export function ReportDocument({ report }: Props) {
  const date = new Date(report.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document title={`Relatório - ${report.documentName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório Gerado por IA</Text>
          <Text style={styles.subtitle}>
            Documento: {report.documentName} • Gerado em {date}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo Executivo</Text>
        <Text style={styles.summaryText}>{report.summary}</Text>

        <Text style={styles.sectionTitle}>Pontos-Chave</Text>
        {report.keyPoints.map((point, i) => (
          <View key={i} style={styles.keyPointItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Gerado automaticamente pelo Gerador de Relatórios com IA
        </Text>
      </Page>
    </Document>
  );
}
