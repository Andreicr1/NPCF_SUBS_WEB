// Lista de países comuns para seleção
export const commonCountries = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Espanha' },
  { code: 'FR', name: 'França' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'IT', name: 'Itália' },
  { code: 'CA', name: 'Canadá' },
  { code: 'AU', name: 'Austrália' },
  { code: 'NZ', name: 'Nova Zelândia' },
  { code: 'JP', name: 'Japão' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'Índia' },
  { code: 'SG', name: 'Singapura' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'CH', name: 'Suíça' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'NL', name: 'Holanda' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colômbia' },
  { code: 'UY', name: 'Uruguai' },
];

// Motivos para não ter TIN
export const reasonsForNoTin = [
  'O país não emite TINs para residentes',
  'Incapaz de obter TIN (explicar no campo de observações)',
  'Não sou residente fiscal deste país',
  'Outro motivo (especificar)',
];

// Validação de CPF
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

// Validação de SSN (formato básico)
export function validateSSN(ssn: string): boolean {
  const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
  return ssnPattern.test(ssn);
}

// Validação de EIN (formato básico)
export function validateEIN(ein: string): boolean {
  const einPattern = /^\d{2}-\d{7}$/;
  return einPattern.test(ein);
}
