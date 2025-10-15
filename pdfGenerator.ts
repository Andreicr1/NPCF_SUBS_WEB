import { Investor } from '@prisma/client';
import { CompleteKycData } from './types';
import { generatePdfData } from './Fieldmapping';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Gera todos os PDFs necessários preenchidos com os dados do investidor
 */
export const generateAllPdfs = async (
  investor: Investor,
  kycData: CompleteKycData
): Promise<{
  kycPdf: Uint8Array;
  fatcaPdf: Uint8Array;
  sourceOfWealthPdf: Uint8Array;
  subscriptionPdf?: Uint8Array;
}> => {
  const [kycPdf, fatcaPdf, sourceOfWealthPdf] = await Promise.all([
    generateKycPdf(investor, kycData),
    generateFatcaPdf(investor, kycData),
    generateSourceOfWealthPdf(investor, kycData),
  ]);

  return {
    kycPdf,
    fatcaPdf,
    sourceOfWealthPdf,
  };
};

/**
 * Gera o PDF do KYC Questionnaire
 */
export const generateKycPdf = async (
  investor: Investor,
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
      console.warn(`Field ${fieldName} not found in PDF`);
    }
  });

  // Adicionar data de preenchimento
  const today = new Date().toLocaleDateString('pt-BR');
  try {
    const dateField = form.getTextField('Date');
    dateField.setText(today);
  } catch (error) {
    console.warn('Date field not found');
  }

  return await pdfDoc.save();
};

/**
 * Gera o PDF do FATCA/CRS
 */
export const generateFatcaPdf = async (
  investor: Investor,
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
      console.warn(`Field ${fieldName} not found in PDF`);
    }
  });

  // Preencher checkboxes de cidadania americana
  if (kycData.fatcaCrs.isUsCitizen) {
    try {
      const checkbox = form.getCheckBox('isUsCitizen_a');
      checkbox.check();
    } catch (error) {
      console.warn('US Citizen checkbox not found');
    }
  } else {
    try {
      const checkbox = form.getCheckBox('isUsCitizen_c');
      checkbox.check();
    } catch (error) {
      console.warn('Non-US Citizen checkbox not found');
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
      console.warn(`Tax residency field ${prefix} not found`);
    }
  });

  return await pdfDoc.save();
};

/**
 * Gera o PDF do Source of Wealth
 */
export const generateSourceOfWealthPdf = async (
  investor: Investor,
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
      console.warn(`Field ${fieldName} not found in PDF`);
    }
  });

  // Marcar checkboxes de categorias
  kycData.source.wealthCategories?.forEach((category) => {
    try {
      const checkbox = form.getCheckBox(`wealth_${category}`);
      checkbox.check();
    } catch (error) {
      console.warn(`Wealth category checkbox ${category} not found`);
    }
  });

  // Declarações obrigatórias
  if (kycData.source.assetsArePersonalProperty) {
    try {
      form.getCheckBox('declaration_personal_property').check();
    } catch (error) {
      console.warn('Personal property declaration checkbox not found');
    }
  }

  if (kycData.source.noAssetsFromCriminalActivity) {
    try {
      form.getCheckBox('declaration_no_criminal').check();
    } catch (error) {
      console.warn('No criminal activity declaration checkbox not found');
    }
  }

  return await pdfDoc.save();
};

/**
 * Salva PDFs gerados localmente (para download)
 */
export const downloadPdf = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Gera e baixa todos os PDFs
 */
export const downloadAllPdfs = async (
  investor: Investor,
  kycData: CompleteKycData
) => {
  const pdfs = await generateAllPdfs(investor, kycData);

  const investorName = investor.fullName.replace(/\s+/g, '_');
  
  downloadPdf(pdfs.kycPdf, `${investorName}_KYC_Questionnaire.pdf`);
  downloadPdf(pdfs.fatcaPdf, `${investorName}_FATCA_CRS.pdf`);
  downloadPdf(pdfs.sourceOfWealthPdf, `${investorName}_Source_of_Wealth.pdf`);
  
  if (pdfs.subscriptionPdf) {
    downloadPdf(pdfs.subscriptionPdf, `${investorName}_Subscription_Agreement.pdf`);
  }
};

export default {
  generateAllPdfs,
  generateKycPdf,
  generateFatcaPdf,
  generateSourceOfWealthPdf,
  downloadPdf,
  downloadAllPdfs,
};