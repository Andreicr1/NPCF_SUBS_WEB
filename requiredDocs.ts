export interface RequiredDocument {
  type: string;
  label: string;
  description: string;
  maxSize?: number; // em MB
  acceptedFormats?: string[];
}

export const requiredDocuments: Record<string, RequiredDocument[]> = {
  individual: [
    {
      type: 'cpf',
      label: 'CPF',
      description: 'Documento de identificação fiscal',
      maxSize: 5,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    {
      type: 'rg',
      label: 'RG ou CNH',
      description: 'Documento de identidade com foto (frente e verso)',
      maxSize: 5,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    {
      type: 'proofOfAddress',
      label: 'Comprovante de Residência',
      description: 'Conta de luz, água, telefone ou gás com data dos últimos 90 dias',
      maxSize: 5,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    {
      type: 'proofOfIncome',
      label: 'Comprovante de Renda',
      description: 'Declaração de Imposto de Renda, holerite ou extrato de investimentos',
      maxSize: 10,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
  ],
  entity: [
    {
      type: 'cnpj',
      label: 'Cartão CNPJ',
      description: 'Documento de identificação fiscal da empresa atualizado',
      maxSize: 5,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    {
      type: 'contractSocial',
      label: 'Contrato Social',
      description: 'Contrato social com última alteração consolidada e registrada',
      maxSize: 10,
      acceptedFormats: ['.pdf'],
    },
    {
      type: 'proofOfAddress',
      label: 'Comprovante de Endereço Empresarial',
      description: 'Conta de luz, água ou telefone em nome da empresa',
      maxSize: 5,
      acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
    },
    {
      type: 'bankStatement',
      label: 'Extrato Bancário',
      description: 'Extrato bancário dos últimos 3 meses',
      maxSize: 10,
      acceptedFormats: ['.pdf'],
    },
    {
      type: 'documentsPartners',
      label: 'Documentos dos Sócios',
      description: 'CPF, RG e comprovante de residência de cada sócio',
      maxSize: 15,
      acceptedFormats: ['.pdf', '.zip'],
    },
  ],
};

export const getRequiredDocuments = (investorType: string): RequiredDocument[] => {
  return requiredDocuments[investorType] || requiredDocuments.individual;
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileFormat = (file: File, acceptedFormats: string[]): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return acceptedFormats.includes(fileExtension);
};