// @ts-nocheck
'use client';

import React, { useState } from 'react';
import type { CompleteKycData } from '../lib/types';
import { generateAllPdfs, downloadPdf, downloadAllPdfs } from '../lib/pdfGenerator';

type InvestorData = Record<string, any>;

interface PdfPreviewProps {
  investor: InvestorData;
  kycData: CompleteKycData;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ investor, kycData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfs, setGeneratedPdfs] = useState<{
    kycPdf?: Uint8Array;
    fatcaPdf?: Uint8Array;
    sourceOfWealthPdf?: Uint8Array;
    subscriptionPdf?: Uint8Array;
  }>({});

  const handleGeneratePdfs = async () => {
    setIsGenerating(true);
    try {
      const pdfs = await generateAllPdfs(investor, kycData);
      setGeneratedPdfs(pdfs);
    } catch (error) {
      console.error('Error generating PDFs:', error);
      alert('Erro ao gerar PDFs. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsGenerating(true);
    try {
      await downloadAllPdfs(investor, kycData);
    } catch (error) {
      console.error('Error downloading PDFs:', error);
      alert('Erro ao baixar PDFs.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSingle = (pdfBytes: Uint8Array, filename: string) => {
    downloadPdf(pdfBytes, filename);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Documentos Gerados</h3>
        <p className="text-sm text-gray-600 mb-6">
          Seus dados foram preenchidos automaticamente nos formulários. Revise e baixe.
        </p>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleGeneratePdfs}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isGenerating ? 'Gerando PDFs...' : 'Visualizar PDFs'}
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isGenerating ? 'Baixando...' : 'Baixar Todos os Documentos'}
          </button>
        </div>

        <div className="space-y-3">
          <DocumentCard
            title="KYC Questionnaire"
            description="Questionário completo de conhecimento do cliente"
            icon="📋"
            pdfBytes={generatedPdfs.kycPdf}
            filename={`${(investor.fullName ?? 'investor').toString().replace(/\s+/g, '_')}_KYC_Questionnaire.pdf`}
            onDownload={handleDownloadSingle}
          />

          <DocumentCard
            title="FATCA/CRS Self-Certification"
            description="Autocertificação de residência fiscal"
            icon="🏛️"
            pdfBytes={generatedPdfs.fatcaPdf}
            filename={`${(investor.fullName ?? 'investor').toString().replace(/\s+/g, '_')}_FATCA_CRS.pdf`}
            onDownload={handleDownloadSingle}
          />

          <DocumentCard
            title="Source of Wealth and Funds"
            description="Declaração de origem de recursos e patrimônio"
            icon="💰"
            pdfBytes={generatedPdfs.sourceOfWealthPdf}
            filename={`${(investor.fullName ?? 'investor').toString().replace(/\s+/g, '_')}_Source_of_Wealth.pdf`}
            onDownload={handleDownloadSingle}
          />
        </div>

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>Importante:</strong> Após baixar, revise todas as informações e assine digitalmente.
          </p>
        </div>
      </div>
    </div>
  );
};

interface DocumentCardProps {
  title: string;
  description: string;
  icon: string;
  pdfBytes?: Uint8Array;
  filename: string;
  onDownload: (pdfBytes: Uint8Array, filename: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  icon,
  pdfBytes,
  filename,
  onDownload,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 transition-all ${isHovered ? 'shadow-md border-blue-300' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {pdfBytes ? (
            <>
              <button
                onClick={() => onDownload(pdfBytes, filename)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Baixar
              </button>
              <button
                onClick={() => {
                  // Corrigido: usar Uint8Array diretamente, sem .buffer
                        // Use DataView over the underlying buffer slice to avoid SharedArrayBuffer typing
                        const ab = pdfBytes.buffer.slice(
                          pdfBytes.byteOffset,
                          pdfBytes.byteOffset + pdfBytes.byteLength
                        );
                        const view = new DataView(ab as ArrayBuffer);
                        const blob = new Blob([view], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                  setTimeout(() => URL.revokeObjectURL(url), 60_000);
                }}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                Visualizar
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-400">Não gerado</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
