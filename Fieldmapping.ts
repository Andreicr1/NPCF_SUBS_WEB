import { Investor } from '@prisma/client';
import { CompleteKycData, TaxResidency } from './types';

/**
 * Campo universal que aparece em múltiplos formulários
 */
export interface UniversalField {
  uiField: keyof Investor | string; // Campo no banco/UI
  pdfMappings: {
    formName: 'kyc' | 'fatca' | 'sourceOfWealth' | 'subscription';
    pdfField: string; // Nome do campo no PDF
  }[];
}

/**
 * Mapeamento de campos universais
 * Um campo preenchido na UI → preenche múltiplos PDFs
 */
export const universalFieldMappings: UniversalField[] = [
  // Nome
  {
    uiField: 'fullName',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Full legal name' },
      { formName: 'fatca', pdfField: 'Account Holder Name' },
      { formName: 'sourceOfWealth', pdfField: 'Name of Individual/Entity' },
      { formName: 'subscription', pdfField: 'Investor Name' },
    ],
  },

  // Data de Nascimento
  {
    uiField: 'birthDate',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Date of birth' },
      { formName: 'fatca', pdfField: 'Date of Birth (dd/mm/yyyy)' },
    ],
  },

  // Endereço Residencial
  {
    uiField: 'address',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Current Residential Address' },
      { formName: 'fatca', pdfField: 'Permanent Residence Address' },
    ],
  },

  // Nacionalidade
  {
    uiField: 'nationality',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Nationality(ies)' },
    ],
  },

  // País de Nascimento
  {
    uiField: 'countryOfBirth',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Country of birth' },
      { formName: 'fatca', pdfField: 'Place and Country of Birth' },
    ],
  },

  // Ocupação
  {
    uiField: 'occupation',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Occupation / legal form' },
    ],
  },

  // Email
  {
    uiField: 'email',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Email' },
    ],
  },

  // Telefone
  {
    uiField: 'phone',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Phone number(s)' },
    ],
  },

  // Source of Funds
  {
    uiField: 'sourceOfFunds',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Source of Funds' },
      { formName: 'sourceOfWealth', pdfField: 'Source of funds' },
    ],
  },

  // Source of Wealth
  {
    uiField: 'sourceOfWealth',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'Source of Wealth' },
      { formName: 'sourceOfWealth', pdfField: 'Source of wealth' },
    ],
  },

  // Employer Name
  {
    uiField: 'employerName',
    pdfMappings: [
      { formName: 'sourceOfWealth', pdfField: 'Name of transferring bank or asset custodian' },
    ],
  },

  // PEP Status
  {
    uiField: 'isPep',
    pdfMappings: [
      { formName: 'kyc', pdfField: 'PEP Status' },
    ],
  },

  // US Citizen
  {
    uiField: 'isUsCitizen',
    pdfMappings: [
      { formName: 'fatca', pdfField: 'US Citizen Checkbox' },
    ],
  },

  // US TIN
  {
    uiField: 'ustin',
    pdfMappings: [
      { formName: 'fatca', pdfField: 'U.S. TIN' },
    ],
  },
];

/**
 * Extrai dados universais de um investidor
 */
export const extractUniversalData = (investor: Investor): Record<string, any> => {
  const data: Record<string, any> = {};

  universalFieldMappings.forEach((mapping) => {
    const value = investor[mapping.uiField as keyof Investor];
    if (value !== null && value !== undefined) {
      data[mapping.uiField] = value;
    }
  });

  return data;
};

/**
 * Gera dados para preencher um PDF específico
 */
export const generatePdfData = (
  investor: Investor,
  kycData: CompleteKycData,
  formName: 'kyc' | 'fatca' | 'sourceOfWealth' | 'subscription'
): Record<string, any> => {
  const pdfData: Record<string, any> = {};

  // Mapear campos universais
  universalFieldMappings.forEach((mapping) => {
    const relevantMapping = mapping.pdfMappings.find((m) => m.formName === formName);
    if (relevantMapping) {
      const value = investor[mapping.uiField as keyof Investor];
      if (value !== null && value !== undefined) {
        pdfData[relevantMapping.pdfField] = value;
      }
    }
  });

  // Adicionar campos específicos do formulário
  switch (formName) {
    case 'kyc':
      return {
        ...pdfData,
        'PEP Details': kycData.pep.pepDetails,
        'PEP Position': kycData.pep.pepPosition,
        'PEP Country': kycData.pep.pepCountry,
      };

    case 'fatca':
      return {
        ...pdfData,
        'Tax Residencies': formatTaxResidencies(kycData.fatcaCrs.taxResidencies),
      };

    case 'sourceOfWealth':
      return {
        ...pdfData,
        'Wealth Categories': formatWealthCategories(kycData.source.wealthCategories),
        'Wealth Details': kycData.source.wealthDetails,
        'Transferring Bank': kycData.source.transferringBank,
        'Bank Country': kycData.source.transferringBankCountry,
      };

    case 'subscription':
      return {
        ...pdfData,
        // Adicionar campos específicos do subscription agreement
      };

    default:
      return pdfData;
  }
};

/**
 * Formata residências fiscais para o PDF
 */
const formatTaxResidencies = (residencies: TaxResidency[]): string => {
  return residencies
    .map(
      (r) =>
        `${r.country}: ${r.taxReferenceNumberType} ${r.taxReferenceNumber}${
          r.reasonForNoTin ? ` (${r.reasonForNoTin})` : ''
        }`
    )
    .join('\n');
};

/**
 * Formata categorias de wealth para o PDF
 */
const formatWealthCategories = (categories: string[]): string => {
  return categories.join(', ');
};

/**
 * Valida se todos os campos obrigatórios foram preenchidos
 */
export const validateRequiredFields = (
  investor: Investor,
  kycData: CompleteKycData
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  // Campos obrigatórios universais
  const requiredFields: (keyof Investor)[] = [
    'fullName',
    'birthDate',
    'nationality',
    'address',
    'email',
    'phone',
  ];

  requiredFields.forEach((field) => {
    if (!investor[field]) {
      missingFields.push(field);
    }
  });

  // Validar Source of Wealth
  if (!kycData.source.sourceOfWealth) {
    missingFields.push('sourceOfWealth');
  }

  if (!kycData.source.sourceOfFunds) {
    missingFields.push('sourceOfFunds');
  }

  // Validar FATCA/CRS
  if (kycData.fatcaCrs.isUsCitizen && !kycData.fatcaCrs.ustin) {
    missingFields.push('ustin');
  }

  if (kycData.fatcaCrs.taxResidencies.length === 0) {
    missingFields.push('taxResidencies');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export default {
  universalFieldMappings,
  extractUniversalData,
  generatePdfData,
  validateRequiredFields,
};