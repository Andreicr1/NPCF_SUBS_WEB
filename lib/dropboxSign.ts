import * as DropboxSign from '@dropbox/sign';
import * as fs from 'fs';

const apiKey = process.env.DROPBOX_SIGN_API_KEY;
const testMode = process.env.DROPBOX_SIGN_TEST_MODE === 'true';

if (!apiKey) {
  throw new Error('DROPBOX_SIGN_API_KEY não está configurado');
}

// Configurar cliente da API
const signatureRequestApi = new DropboxSign.SignatureRequestApi();
signatureRequestApi.username = apiKey;

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
}

export async function createSignatureRequest(
  request: SignatureRequest
): Promise<any> {
  try {
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