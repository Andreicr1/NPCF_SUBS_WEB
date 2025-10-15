import * as DropboxSign from '@dropbox/sign';
import * as fs from 'fs';

export interface EmbeddedSignRequest {
  investorId: string;
  investorEmail: string;
  investorName: string;
  pdfFilePath: string;
  clientId: string;
}

export interface SignatureResponse {
  signatureRequestId: string;
  signUrl: string;
  expiresAt: Date;
}

export class DropboxSignService {
  private signatureRequestApi: DropboxSign.SignatureRequestApi;
  private embeddedApi: DropboxSign.EmbeddedApi;
  private testMode: boolean;

  constructor() {
    const apiKey = process.env.DROPBOX_SIGN_API_KEY;
    
    if (!apiKey) {
      throw new Error('DROPBOX_SIGN_API_KEY is not configured');
    }

    // Configurar autenticação
    this.signatureRequestApi = new DropboxSign.SignatureRequestApi();
    this.signatureRequestApi.username = apiKey;
    
    this.embeddedApi = new DropboxSign.EmbeddedApi();
    this.embeddedApi.username = apiKey;
    
    this.testMode = process.env.DROPBOX_SIGN_TEST_MODE === 'true';
  }

  /**
   * Cria uma solicitação de assinatura embutida
   */
  async createEmbeddedSignRequest(
    request: EmbeddedSignRequest
  ): Promise<SignatureResponse> {
    try {
      console.log('📝 Creating embedded signature request for:', request.investorEmail);

      const signer: DropboxSign.SubSignatureRequestSigner = {
        emailAddress: request.investorEmail,
        name: request.investorName,
        order: 0,
      };

      const signingOptions: DropboxSign.SubSigningOptions = {
        draw: true,
        type: true,
        upload: true,
        phone: false,
        defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw,
      };

      const data: DropboxSign.SignatureRequestCreateEmbeddedRequest = {
        clientId: request.clientId,
        title: 'Subscription Agreement - Netz Private Credit Fund',
        subject: 'Por favor, assine o Subscription Agreement',
        message: 'Prezado(a) investidor(a), por favor revise e assine o documento abaixo.',
        signers: [signer],
        files: [fs.createReadStream(request.pdfFilePath)],
        testMode: this.testMode,
        signingOptions,
        metadata: {
          investorId: request.investorId,
          documentType: 'subscription_agreement',
          createdAt: new Date().toISOString(),
        },
      };

      // Criar a solicitação
      const response = await this.signatureRequestApi.signatureRequestCreateEmbedded(data);
      
      const signatureRequestId = response.body.signatureRequest?.signatureRequestId;
      
      if (!signatureRequestId) {
        throw new Error('Signature request ID not returned');
      }

      // Obter URL de assinatura embutida
      const signatureId = response.body.signatureRequest?.signatures?.[0]?.signatureId;
      
      if (!signatureId) {
        throw new Error('Signature ID not returned');
      }

      const embeddedResponse = await this.embeddedApi.embeddedSignUrl(signatureId);
      
      const signUrl = embeddedResponse.body.embedded?.signUrl;
      const expiresAt = embeddedResponse.body.embedded?.expiresAt;

      if (!signUrl) {
        throw new Error('Sign URL not returned');
      }

      console.log('✅ Signature request created:', signatureRequestId);

      return {
        signatureRequestId,
        signUrl,
        expiresAt: expiresAt ? new Date(expiresAt * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

    } catch (error: any) {
      console.error('❌ Error creating signature request:', error);
      
      if (error.response) {
        console.error('API Error Response:', error.response.body);
      }
      
      throw new Error(`Failed to create signature request: ${error.message}`);
    }
  }

  /**
   * Obtém o status de uma solicitação de assinatura
   */
  async getSignatureRequestStatus(signatureRequestId: string) {
    try {
      const response = await this.signatureRequestApi.signatureRequestGet(signatureRequestId);
      return response.body.signatureRequest;
    } catch (error: any) {
      console.error('❌ Error getting signature status:', error);
      throw error;
    }
  }

  /**
   * Baixa o documento assinado
   */
  async downloadSignedDocument(signatureRequestId: string, outputPath: string): Promise<string> {
    try {
      console.log('⬇️  Downloading signed document:', signatureRequestId);

      const response = await this.signatureRequestApi.signatureRequestFiles(
        signatureRequestId,
        'pdf'
      );

      // Salvar o arquivo
      const fsPromises = require('fs/promises');
      await fsPromises.writeFile(outputPath, response.body);

      console.log('✅ Signed document saved to:', outputPath);
      return outputPath;

    } catch (error: any) {
      console.error('❌ Error downloading signed document:', error);
      throw error;
    }
  }

  /**
   * Cancela uma solicitação de assinatura
   */
  async cancelSignatureRequest(signatureRequestId: string): Promise<void> {
    try {
      await this.signatureRequestApi.signatureRequestCancel(signatureRequestId);
      console.log('✅ Signature request cancelled:', signatureRequestId);
    } catch (error: any) {
      console.error('❌ Error cancelling signature request:', error);
      throw error;
    }
  }

  /**
   * Reenvia o email de solicitação de assinatura
   */
  async remindSignatureRequest(signatureRequestId: string, emailAddress: string): Promise<void> {
    try {
      await this.signatureRequestApi.signatureRequestRemind(signatureRequestId, {
        emailAddress,
      });
      console.log('✅ Reminder sent for signature request:', signatureRequestId);
    } catch (error: any) {
      console.error('❌ Error sending reminder:', error);
      throw error;
    }
  }

  /**
   * Valida webhook callback
   */
  validateWebhookCallback(event: any): boolean {
    // Implementar validação do webhook
    // https://developers.hellosign.com/api/reference/webhook-callbacks/
    
    const apiKey = process.env.DROPBOX_SIGN_API_KEY;
    if (!apiKey) return false;

    // TODO: Implementar validação de hash do evento
    // const expectedHash = crypto.createHmac('sha256', apiKey).update(JSON.stringify(event)).digest('hex');
    // return expectedHash === event.event.event_hash;

    return true; // Temporário - implementar validação real
  }
}

export default DropboxSignService;