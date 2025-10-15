import React, { useState } from 'react';
import { CompleteKycData } from '../lib/types';
import { downloadAllPdfs, downloadPdf, generateAllPdfs } from '../lib/pdfGenerator';

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
  }>({});

  const handleGeneratePdfs = async () => {
    setIsGenerating(true);
    try {
      const pdfs = await generateAllPdfs(investor, kycData);
      setGeneratedPdfs(pdfs);
    } catch (error) {
      console.error('Error generating PDFs:', error);
      alert('Erro ao gerar PDFs. Por favor, verifique os dados e tente novamente.');
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
          Seus dados foram preenchidos automaticamente em todos os formulários necessários.
          Revise e baixe os documentos abaixo.
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleGeneratePdfs}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando PDFs...
              </span>
            ) : (
              'Visualizar PDFs'
            )}
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isGenerating ? 'Baixando...' : 'Baixar Todos os Documentos'}
          </button>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          <DocumentCard
            title="KYC Questionnaire"
            description="Questionário completo de conhecimento do cliente"
            icon="📋"
            pdfBytes={generatedPdfs.kycPdf}
            filename={`${investor.fullName.replace(/\s+/g, '_')}_KYC_Questionnaire.pdf`}
            onDownload={handleDownloadSingle}
          />

          <DocumentCard
            title="FATCA/CRS Self-Certification"
            description="Autocertificação de residência fiscal"
            icon="🏛️"
            pdfBytes={generatedPdfs.fatcaPdf}
            filename={`${investor.fullName.replace(/\s+/g, '_')}_FATCA_CRS.pdf`}
            onDownload={handleDownloadSingle}
          />

          <DocumentCard
            title="Source of Wealth and Funds"
            description="Declaração de origem de recursos e patrimônio"
            icon="💰"
            pdfBytes={generatedPdfs.sourceOfWealthPdf}
            filename={`${investor.fullName.replace(/\s+/g, '_')}_Source_of_Wealth.pdf`}
            onDownload={handleDownloadSingle}
          />
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Importante:</strong> Após baixar os documentos, revise cuidadosamente todas as informações.
                Você precisará assinar digitalmente cada documento antes de enviá-los.
              </p>
            </div>
          </div>
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
      className={`border border-gray-200 rounded-lg p-4 transition-all ${
        isHovered ? 'shadow-md border-blue-300' : ''
      }`}
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
                  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
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