// @ts-nocheck
import * as DropboxSign from '@dropbox/sign';
// import * as fs from 'fs';

const apiKey = process.env.DROPBOX_SIGN_API_KEY;
const testMode = process.env.DROPBOX_SIGN_TEST_MODE === 'true';

if (!apiKey) {
  throw new Error('DROPBOX_SIGN_API_KEY não está configurado');
}

// Configurar cliente da API
const signatureRequestApi = new DropboxSign.SignatureRequestApi();
signatureRequestApi.username = apiKey;

export interface SignatureField {
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type?: 'signature' | 'date' | 'text';
  name?: string;
}

export interface DocumentSignatureFields {
  documentIndex: number;
  fields: SignatureField[];
}

export interface SignatureRequest {
  title: string;
  subject: string;
  message: string;
  signers: Array<{
    emailAddress: string;
    name: string;
    order?: number;
  }>;
  files: Buffer[];
  testMode?: boolean;
  signatureFields?: DocumentSignatureFields[];
  useTextTags?: boolean;
  hideTextTags?: boolean;
}

/**
 * Coordenadas de assinatura para cada documento
 * Baseado nas páginas finais de cada template PDF
 */
export const DEFAULT_SIGNATURE_FIELDS: Record<string, DocumentSignatureFields> = {
  kyc: {
    documentIndex: 0,
    fields: [
      { page: 0, x: 100, y: 700, width: 200, height: 40, type: 'signature', name: 'signature' },
      { page: 0, x: 100, y: 740, width: 150, height: 20, type: 'date', name: 'date' },
    ],
  },
  fatca: {
    documentIndex: 1,
    fields: [
      { page: 0, x: 100, y: 650, width: 200, height: 40, type: 'signature', name: 'signature' },
      { page: 0, x: 100, y: 690, width: 150, height: 20, type: 'date', name: 'date' },
    ],
  },
  sourceOfWealth: {
    documentIndex: 2,
    fields: [
      { page: 0, x: 100, y: 600, width: 200, height: 40, type: 'signature', name: 'signature' },
      { page: 0, x: 100, y: 640, width: 150, height: 20, type: 'date', name: 'date' },
    ],
  },
  subscription: {
    documentIndex: 3,
    fields: [
      { page: 0, x: 100, y: 550, width: 200, height: 40, type: 'signature', name: 'signature' },
      { page: 0, x: 100, y: 590, width: 150, height: 20, type: 'date', name: 'date' },
    ],
  },
};

export async function createSignatureRequest(
  request: SignatureRequest
): Promise<any> {
  try {
    // Construir campos de assinatura se especificados
    const formFieldsPerDocument: any[] = [];
    
    if (request.signatureFields && request.signatureFields.length > 0) {
      request.signatureFields.forEach((docFields) => {
        const fields = docFields.fields.map((field, index) => {
          const fieldType = field.type === 'signature' ? 'signature' : 
                           field.type === 'date' ? 'date_signed' : 'text';
          
          return {
            api_id: `${fieldType}_${docFields.documentIndex}_${index}`,
            name: field.name || `${fieldType}_${index}`,
            type: fieldType,
            x: field.x,
            y: field.y,
            width: field.width || 200,
            height: field.height || 40,
            required: true,
            signer: 0, // Primeiro signatário
            page: field.page,
          };
        });

        formFieldsPerDocument.push({
          document_index: docFields.documentIndex,
          form_fields: fields,
        });
      });
    } else {
      // Usar campos padrão para os 4 documentos
      Object.values(DEFAULT_SIGNATURE_FIELDS).forEach((docFields) => {
        const fields = docFields.fields.map((field, index) => {
          const fieldType = field.type === 'signature' ? 'signature' : 
                           field.type === 'date' ? 'date_signed' : 'text';
          
          return {
            api_id: `${fieldType}_${docFields.documentIndex}_${index}`,
            name: field.name || `${fieldType}_${index}`,
            type: fieldType,
            x: field.x,
            y: field.y,
            width: field.width || 200,
            height: field.height || 40,
            required: true,
            signer: 0,
            page: field.page,
          };
        });

        formFieldsPerDocument.push({
          document_index: docFields.documentIndex,
          form_fields: fields,
        });
      });
    }

    const data: DropboxSign.SignatureRequestSendRequest = {
      title: request.title,
      subject: request.subject,
      message: request.message,
      signers: request.signers.map((signer, index) => ({
        emailAddress: signer.emailAddress,
        name: signer.name,
        order: signer.order ?? index,
      })),
      files: request.files as any[],
      testMode: request.testMode ?? testMode,
      formFieldsPerDocument: formFieldsPerDocument.length > 0 ? formFieldsPerDocument : undefined,
      useTextTags: request.useTextTags ?? false,
      hideTextTags: request.hideTextTags ?? true,
    };

    const result = await signatureRequestApi.signatureRequestSend(data);
    return result.body;
  } catch (error) {
    console.error('Erro ao criar solicitação de assinatura:', error);
    throw error;
  }
}

export async function getSignatureRequest(requestId: string): Promise<any> {
  try {
    const result = await signatureRequestApi.signatureRequestGet(requestId);
    return result.body;
  } catch (error) {
    console.error('Erro ao buscar solicitação de assinatura:', error);
    throw error;
  }
}

export async function cancelSignatureRequest(requestId: string): Promise<void> {
  try {
    await signatureRequestApi.signatureRequestCancel(requestId);
  } catch (error) {
    console.error('Erro ao cancelar solicitação de assinatura:', error);
    throw error;
  }
}

export { signatureRequestApi };