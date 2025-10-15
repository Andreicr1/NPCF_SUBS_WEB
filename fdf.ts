import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { fieldMapping } from './i18n';

export interface FormData {
  [key: string]: string | number | boolean | null | undefined;
}

export class FDFService {
  private templatePath: string;

  constructor(templatePath?: string) {
    this.templatePath = templatePath || process.env.PDF_TEMPLATE_PATH || './public/documents/subscription_agreement_template.pdf';
  }

  /**
   * Mapeia campos PT → EN usando o fieldMapping
   */
  private mapFields(data: FormData): Record<string, any> {
    const mapped: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      const mappedKey = fieldMapping[key] || key;
      mapped[mappedKey] = value;
    });

    return mapped;
  }

  /**
   * Preenche o PDF template com os dados fornecidos
   */
  async fillPDF(data: FormData, outputPath: string): Promise<string> {
    try {
      // Ler o template PDF
      const templateBuffer = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBuffer);
      
      // Obter o formulário
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      
      console.log(`📄 PDF Template has ${fields.length} form fields`);

      // Mapear dados PT → EN
      const mappedData = this.mapFields(data);

      // Preencher cada campo
      fields.forEach((field) => {
        const fieldName = field.getName();
        const value = mappedData[fieldName];

        if (value !== undefined && value !== null) {
          try {
            if (field instanceof PDFTextField) {
              const textField = field as PDFTextField;
              textField.setText(String(value));
            } else if (field instanceof PDFCheckBox) {
              const checkBox = field as PDFCheckBox;
              if (value === true || value === 'true' || value === 'yes' || value === 1) {
                checkBox.check();
              } else {
                checkBox.uncheck();
              }
            }
          } catch (error) {
            console.warn(`⚠️  Could not fill field '${fieldName}':`, error);
          }
        }
      });

      // Flatten the form (tornar os campos não editáveis)
      form.flatten();

      // Salvar o PDF preenchido
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(outputPath, pdfBytes);

      console.log(`✅ PDF filled and saved to: ${outputPath}`);
      return outputPath;

    } catch (error) {
      console.error('❌ Error filling PDF:', error);
      throw new Error(`Failed to fill PDF: ${error}`);
    }
  }

  /**
   * Extrai campos do template PDF para debugging
   */
  async extractFields(): Promise<string[]> {
    try {
      const templateBuffer = await fs.readFile(this.templatePath);
      const pdfDoc = await PDFDocument.load(templateBuffer);
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      return fields.map(field => field.getName());
    } catch (error) {
      console.error('❌ Error extracting PDF fields:', error);
      throw error;
    }
  }

  /**
   * Cria FDF data string (formato alternativo)
   */
  private createFDFData(data: FormData): string {
    const mappedData = this.mapFields(data);
    
    let fdfData = '%FDF-1.2\n';
    fdfData += '1 0 obj\n<<\n/FDF << /Fields [\n';

    Object.entries(mappedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        fdfData += `<< /T (${key}) /V (${escapedValue}) >>\n`;
      }
    });

    fdfData += '] >> >>\nendobj\n';
    fdfData += 'trailer\n<<\n/Root 1 0 R\n>>\n';
    fdfData += '%%EOF';

    return fdfData;
  }

  /**
   * Salva FDF file (para uso com pdftk se necessário)
   */
  async saveFDF(data: FormData, outputPath: string): Promise<string> {
    try {
      const fdfData = this.createFDFData(data);
      await fs.writeFile(outputPath, fdfData);
      console.log(`✅ FDF file saved to: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error saving FDF:', error);
      throw error;
    }
  }

  /**
   * Converte dados do Investor para formato do PDF
   */
  static investorToPDFData(investor: any): FormData {
    return {
      // Dados Pessoais
      nomeCompleto: investor.fullName,
      razaoSocial: investor.legalName,
      cpfCnpj: investor.cpfCnpj,
      rg: investor.rg,
      dataNascimento: investor.birthDate ? new Date(investor.birthDate).toLocaleDateString('pt-BR') : '',
      nacionalidade: investor.nationality,
      estadoCivil: investor.maritalStatus,
      profissao: investor.profession,
      
      // Endereço
      endereco: investor.address,
      numero: investor.addressNumber,
      complemento: investor.complement,
      bairro: investor.neighborhood,
      cidade: investor.city,
      estado: investor.state,
      cep: investor.zipCode,
      pais: investor.country,
      
      // Contato
      email: investor.email,
      telefone: investor.phone,
      celular: investor.cellphone,
      
      // Banco
      banco: investor.bankName,
      agencia: investor.bankBranch,
      conta: investor.bankAccount,
      tipoConta: investor.bankAccountType === 'checking' ? 'Corrente' : 'Poupança',
      
      // Subscrição
      valorSubscricao: investor.subscriptionAmount?.toString(),
      numeroCotas: investor.numberOfQuotas?.toString(),
      valorCota: investor.quotaValue?.toString(),
      
      // AML
      pep: investor.isPep ? 'Sim' : 'Não',
      detalhesPep: investor.pepDetails || '',
      origemRecursos: investor.originOfFunds || '',
      
      // Data de assinatura
      dataAssinatura: new Date().toLocaleDateString('pt-BR'),
    };
  }
}

export default FDFService;