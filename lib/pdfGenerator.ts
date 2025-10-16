import { CompleteKycData } from './types';
import { generatePdfData } from './fieldMapping';
import { PDFDocument } from 'pdf-lib';

type InvestorData = Record<string, any>;

/**
 * Gera todos os PDFs necessários preenchidos com os dados do investidor
 */
export const generateAllPdfs = async (
  investor: InvestorData,
  kycData: CompleteKycData
): Promise<{
  kycPdf: Uint8Array;
  fatcaPdf: Uint8Array;
  sourceOfWealthPdf: Uint8Array;
  subscriptionPdf: Uint8Array;
}> => {
  const [kycPdf, fatcaPdf, sourceOfWealthPdf, subscriptionPdf] = await Promise.all([
    generateKycPdf(investor, kycData),
    generateFatcaPdf(investor, kycData),
    generateSourceOfWealthPdf(investor, kycData),
    generateSubscriptionPdf(investor, kycData),
  ]);

  return {
    kycPdf,
    fatcaPdf,
    sourceOfWealthPdf,
    subscriptionPdf,
  };
};

/**
 * Gera o PDF do KYC Questionnaire
 */
export const generateKycPdf = async (
  investor: InvestorData,
  kycData: CompleteKycData
): Promise<Uint8Array> => {
  // Carregar o template PDF vazio
  const templatePath = '/templates/KYC_Client_Questionnaire_-_Feb_2022.pdf';
  const templateBytes = await fetch(templatePath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Mapear dados para campos do PDF
  const pdfData = generatePdfData(investor, kycData, 'kyc');

  // Preencher campos
  Object.entries(pdfData).forEach(([fieldName, value]) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
    } catch (error) {
      console.warn(`Field ${fieldName} not found in PDF`, error);
    }
  });

  // Adicionar data de preenchimento
  const today = new Date().toLocaleDateString('pt-BR');
  try {
    const dateField = form.getTextField('Date');
    dateField.setText(today);
  } catch (error) {
    console.warn('Date field not found', error);
  }

  return await pdfDoc.save();
};

/**
 * Gera o PDF do FATCA/CRS
 */
export const generateFatcaPdf = async (
  investor: InvestorData,
  kycData: CompleteKycData
): Promise<Uint8Array> => {
  const templatePath = '/templates/FATCA_CRS_individual_self_cert_final_Dec_15.pdf';
  const templateBytes = await fetch(templatePath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const pdfData = generatePdfData(investor, kycData, 'fatca');

  // Preencher campos básicos
  Object.entries(pdfData).forEach(([fieldName, value]) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
    } catch (error) {
      console.warn(`Field ${fieldName} not found in PDF`, error);
    }
  });

  // Preencher checkboxes de cidadania americana
  if (kycData.fatcaCrs.isUsCitizen) {
    try {
      const checkbox = form.getCheckBox('isUsCitizen_a');
      checkbox.check();
    } catch (error) {
      console.warn('US Citizen checkbox not found', error);
    }
  } else {
    try {
      const checkbox = form.getCheckBox('isUsCitizen_c');
      checkbox.check();
    } catch (error) {
      console.warn('Non-US Citizen checkbox not found', error);
    }
  }

  // Preencher residências fiscais (dinâmico)
  kycData.fatcaCrs.taxResidencies.forEach((residency, index) => {
    const prefix = `taxResidency${index + 1}`;
    
    try {
      form.getTextField(`${prefix}_country`).setText(residency.country);
      form.getTextField(`${prefix}_tin_type`).setText(residency.taxReferenceNumberType);
      form.getTextField(`${prefix}_tin`).setText(residency.taxReferenceNumber);
      
      if (residency.reasonForNoTin) {
        form.getTextField(`${prefix}_reason`).setText(residency.reasonForNoTin);
      }
    } catch (error) {
      console.warn(`Tax residency field ${prefix} not found`, error);
    }
  });

  return await pdfDoc.save();
};

/**
 * Gera o PDF do Source of Wealth
 */
export const generateSourceOfWealthPdf = async (
  investor: InvestorData,
  kycData: CompleteKycData
): Promise<Uint8Array> => {
  const templatePath = '/templates/Source_of_Funds_and_Wealth_Form.pdf';
  const templateBytes = await fetch(templatePath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const pdfData = generatePdfData(investor, kycData, 'sourceOfWealth');

  // Preencher campos básicos
  Object.entries(pdfData).forEach(([fieldName, value]) => {
    try {
      const field = form.getTextField(fieldName);
      field.setText(String(value));
    } catch (error) {
      console.warn(`Field ${fieldName} not found in PDF`, error);
    }
  });

  // Marcar checkboxes de categorias
  kycData.source.wealthCategories?.forEach((category) => {
    try {
      const checkbox = form.getCheckBox(`wealth_${category}`);
      checkbox.check();
    } catch (error) {
      console.warn(`Wealth category checkbox ${category} not found`, error);
    }
  });

  // Declarações obrigatórias
  if (kycData.source.assetsArePersonalProperty) {
    try {
      form.getCheckBox('declaration_personal_property').check();
    } catch (error) {
      console.warn('Personal property declaration checkbox not found', error);
    }
  }

  if (kycData.source.noAssetsFromCriminalActivity) {
    try {
      form.getCheckBox('declaration_no_criminal').check();
    } catch (error) {
      console.warn('No criminal activity declaration checkbox not found', error);
    }
  }

  return await pdfDoc.save();
};

/**
 * Gera o PDF do Subscription Agreement
 */
export const generateSubscriptionPdf = async (
  investor: InvestorData,
  kycData: CompleteKycData
): Promise<Uint8Array> => {
  const templatePath = '/templates/Netz_Private_Credit_Fund_-_Main_Subscription_Documents_-_FINAL_Compacted.pdf';
  const templateBytes = await fetch(templatePath).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Dados básicos do investidor
  try {
    form.getTextField('Investor_Name').setText(investor.fullName);
    form.getTextField('Investor_Address').setText(investor.address || '');
    form.getTextField('Investor_Email').setText(investor.email);
    form.getTextField('Investor_Phone').setText(investor.phone || '');
  } catch (error) {
    console.warn('Basic investor fields not found', error);
  }

  // Subscription Details
  try {
    form.getTextField('Share_Class').setText(kycData.subscription.shareClassSelection);
    form.getTextField('Subscription_Amount').setText(
      kycData.subscription.subscriptionAmount?.toString() || ''
    );
    form.getTextField('Subscription_Amount_Words').setText(
      kycData.subscription.subscriptionAmountWords || ''
    );
  } catch (error) {
    console.warn('Subscription detail fields not found', error);
  }

  // Entity Information (if applicable)
  if (kycData.subscription.incorporationDate) {
    try {
      form.getTextField('Incorporation_Date').setText(
        kycData.subscription.incorporationDate.toLocaleDateString()
      );
      form.getTextField('Incorporation_Place').setText(kycData.subscription.incorporationPlace || '');
      form.getTextField('Country_Of_Formation').setText(kycData.subscription.countryOfFormation || '');
    } catch (error) {
      console.warn('Entity information fields not found', error);
    }
  }

  // Banking
  try {
    form.getTextField('Incoming_Bank_Location').setText(kycData.subscription.incomingBankLocation);
  } catch (error) {
    console.warn('Bank location field not found', error);
  }

  // Confirmations
  try {
    if (kycData.subscription.eligibleInvestorConfirmation) {
      form.getCheckBox('Eligible_Investor_Confirmation').check();
    }
    if (kycData.subscription.nonUsPersonConfirmation) {
      form.getCheckBox('Non_US_Person_Confirmation').check();
    }
  } catch (error) {
    console.warn('Confirmation checkboxes not found', error);
  }

  // Mailing Address
  if (kycData.subscription.mailingAddress) {
    try {
      form.getTextField('Mailing_Address').setText(kycData.subscription.mailingAddress);
    } catch (error) {
      console.warn('Mailing address field not found', error);
    }
  }

  // Signatory Capacity
  if (kycData.subscription.signatoryCapacity) {
    try {
      form.getTextField('Signatory_Capacity').setText(kycData.subscription.signatoryCapacity);
    } catch (error) {
      console.warn('Signatory capacity field not found', error);
    }
  }

  return await pdfDoc.save();
};

/**
 * Salva PDFs gerados localmente (para download)
 */
export function downloadPdf(bytes: Uint8Array, filename: string) {
  // Normalize to an ArrayBuffer slice and wrap in DataView to satisfy BlobPart typing
  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const view = new DataView(ab as ArrayBuffer);
  const blob = new Blob([view], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Gera e baixa todos os PDFs
 */
export async function downloadAllPdfs(investor: Record<string, any>, kycData: any) {
  const pdfs = await generateAllPdfs(investor, kycData);
  if (pdfs.kycPdf) downloadPdf(pdfs.kycPdf, `${(investor.fullName ?? 'investor')}_KYC_Questionnaire.pdf`);
  if (pdfs.fatcaPdf) downloadPdf(pdfs.fatcaPdf, `${(investor.fullName ?? 'investor')}_FATCA_CRS.pdf`);
  if (pdfs.sourceOfWealthPdf) downloadPdf(pdfs.sourceOfWealthPdf, `${(investor.fullName ?? 'investor')}_Source_of_Wealth.pdf`);
}

const pdfGenerator = {
  generateAllPdfs,
  generateKycPdf,
  generateFatcaPdf,
  generateSourceOfWealthPdf,
  downloadPdf,
  downloadAllPdfs,
};

export default pdfGenerator;
