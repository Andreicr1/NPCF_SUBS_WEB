import { FatcaCrsData, TaxResidency } from './types';

/**
 * Valida dados FATCA/CRS
 */
export const validateFatcaCrs = (data: FatcaCrsData): string[] => {
  const errors: string[] = [];

  // Se é cidadão americano, precisa de TIN
  if (data.isUsCitizen && !data.ustin) {
    errors.push('U.S. TIN is required for U.S. citizens');
  }

  // Validar formato do TIN (SSN: XXX-XX-XXXX ou EIN: XX-XXXXXXX)
  if (data.ustin) {
    const tinClean = data.ustin.replace(/[^\d]/g, '');
    if (tinClean.length !== 9) {
      errors.push('Invalid U.S. TIN format');
    }
  }

  // Deve ter pelo menos uma residência fiscal
  if (!data.taxResidencies || data.taxResidencies.length === 0) {
    errors.push('At least one tax residency is required');
  }

  // Validar cada residência fiscal
  data.taxResidencies?.forEach((residency, index) => {
    if (!residency.country) {
      errors.push(`Tax residency ${index + 1}: Country is required`);
    }

    if (!residency.taxReferenceNumber && !residency.reasonForNoTin) {
      errors.push(
        `Tax residency ${index + 1}: Tax reference number or reason for no TIN is required`
      );
    }
  });

  return errors;
};

/**
 * Valida TIN específico de um país
 */
export const validateCountryTin = (
  country: string,
  tin: string
): boolean => {
  const tinClean = tin.replace(/[^\d]/g, '');

  switch (country.toUpperCase()) {
    case 'BR': // Brasil - CPF (11 dígitos) ou CNPJ (14 dígitos)
      return tinClean.length === 11 || tinClean.length === 14;
    
    case 'US': // Estados Unidos - SSN ou EIN (9 dígitos)
      return tinClean.length === 9;
    
    case 'GB': // Reino Unido - NINO (formato específico)
      return /^[A-Z]{2}\d{6}[A-D]$/.test(tin.toUpperCase());
    
    default:
      // Para outros países, aceitar se não estiver vazio
      return tin.length > 0;
  }
};

/**
 * Formata TIN de acordo com o país
 */
export const formatTin = (country: string, tin: string): string => {
  const tinClean = tin.replace(/[^\d]/g, '');

  switch (country.toUpperCase()) {
    case 'BR':
      if (tinClean.length === 11) {
        // CPF: XXX.XXX.XXX-XX
        return tinClean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (tinClean.length === 14) {
        // CNPJ: XX.XXX.XXX/XXXX-XX
        return tinClean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      return tin;
    
    case 'US':
      // SSN: XXX-XX-XXXX
      if (tinClean.length === 9) {
        return tinClean.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      }
      return tin;
    
    default:
      return tin;
  }
};

/**
 * Lista de países comuns para seleção
 */
export const commonCountries = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CA', name: 'Canadá' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'IT', name: 'Itália' },
  { code: 'ES', name: 'Espanha' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CH', name: 'Suíça' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'KY', name: 'Ilhas Cayman' },
  { code: 'BM', name: 'Bermudas' },
];

/**
 * Razões válidas para não ter TIN
 */
export const reasonsForNoTin = [
  'Country does not issue TINs',
  'Unable to obtain TIN',
  'TIN not required in country of residence',
  'Awaiting TIN issuance',
  'Other (please specify)',
];

export default {
  validateFatcaCrs,
  validateCountryTin,
  formatTin,
  commonCountries,
  reasonsForNoTin,
};