// FATCA/CRS Types
export interface TaxResidency {
  country: string;
  taxReferenceNumberType: string;
  taxReferenceNumber: string;
  reasonForNoTin?: string; // If TIN not available
}

export interface FatcaCrsData {
  // U.S. Status
  isUsCitizen: boolean;
  ustin?: string;
  usBirthplace?: string;
  hasSurrenderedUsCitizenship?: boolean;
  
  // Tax Residencies
  taxResidencies: TaxResidency[];
}

// PEP Types
export interface PepData {
  isPep: boolean;
  pepDetails?: string;
  pepPosition?: string; // e.g., "Minister of Finance"
  pepCountry?: string;
  pepStartDate?: Date;
  pepEndDate?: Date;
  
  // Related Close Associate
  isRca: boolean;
  rcaRelationship?: string; // e.g., "Spouse of", "Business partner of"
  rcaPepName?: string;
}

// Source of Funds/Wealth
export interface SourceData {
  sourceOfFunds: string; // e.g., "Salary", "Business income", "Inheritance"
  sourceOfWealth: string; // e.g., "Employment", "Investments", "Real estate"
  
  // Categories from ZEDRA form
  wealthCategories: WealthCategory[];
  wealthDetails: string; // Full explanation
  
  // Bank/Transfer info
  transferringBank?: string;
  transferringBankCountry?: string;
  
  // Employment
  employerName?: string;
  employerAddress?: string;
  employmentYears?: number;
  annualIncome?: number;
  netWorth?: number;
  
  // Declarations
  assetsArePersonalProperty: boolean;
  noAssetsFromCriminalActivity: boolean;
}

export type WealthCategory = 
  | 'savings'
  | 'investment_activity'
  | 'sale_of_asset'
  | 'divorce_settlement'
  | 'salary'
  | 'insurance_claim'
  | 'corporate_profit'
  | 'court'
  | 'inheritance'
  | 'life_assurance'
  | 'gift'
  | 'other';

export const wealthCategoryLabels: Record<WealthCategory, string> = {
  savings: 'Savings',
  investment_activity: 'Investment Activity',
  sale_of_asset: 'Sale of Asset',
  divorce_settlement: 'Divorce Settlement',
  salary: 'Salary from professional activity',
  insurance_claim: 'Insurance Claim',
  corporate_profit: 'Corporate Profit/Earnings',
  court: 'Court',
  inheritance: 'Inheritance',
  life_assurance: 'Maturity of Life Assurance Policy',
  gift: 'Gift',
  other: 'Other'
};

// Beneficial Ownership
export interface BeneficialOwner {
  fullName: string;
  residentialAddress: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  occupation: string;
  ownershipPercentage?: number;
  controlType?: string; // "Direct ownership", "Indirect ownership", "Control"
}

export interface BeneficialOwnershipDeclaration {
  hasNoBeneficialOwner: boolean;
  beneficialOwners: BeneficialOwner[];
}

// Complete KYC Data
export interface CompleteKycData {
  // Personal Data (already in Investor model)
  
  // PEP
  pep: PepData;
  
  // Source
  source: SourceData;
  
  // FATCA/CRS
  fatcaCrs: FatcaCrsData;
  
  // Beneficial Ownership
  beneficialOwnership?: BeneficialOwnershipDeclaration;
  
  // Additional
  purposeOfAccount: string;
  expectedActivity: string;
  fundingSource: string;
}

export default CompleteKycData;