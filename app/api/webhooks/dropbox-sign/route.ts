// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '../../../../lib/db';
import crypto from 'crypto';

/**
 * POST /api/webhooks/dropbox-sign
 * Webhook para receber eventos do Dropbox Sign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar assinatura do webhook (segurança)
    const apiKey = process.env.DROPBOX_SIGN_API_KEY;
    if (apiKey) {
      const signature = request.headers.get('x-hellosign-signature');
      if (signature) {
        // Verificar HMAC
        const eventJson = JSON.stringify(body.event);
        const expectedSignature = crypto
          .createHmac('sha256', apiKey)
          .update(eventJson)
          .digest('hex');
        
        if (signature !== expectedSignature) {
          console.error('⚠️ Invalid webhook signature');
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          );
        }
      }
    }

    const event = body.event;
    const eventType = event.event_type;
    
    console.log(`📨 Dropbox Sign Webhook: ${eventType}`);

    // Processar diferentes tipos de eventos
    switch (eventType) {
      case 'signature_request_signed':
        await handleSignatureRequestSigned(event);
        break;
      
      case 'signature_request_all_signed':
        await handleSignatureRequestAllSigned(event);
        break;
      
      case 'signature_request_declined':
        await handleSignatureRequestDeclined(event);
        break;
      
      case 'signature_request_expired':
        await handleSignatureRequestExpired(event);
        break;
      
      case 'signature_request_sent':
        console.log('✉️ Signature request sent');
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    // Retornar "Hello API Event Received" conforme documentação
    return NextResponse.json({ 
      success: true,
      message: 'Hello API Event Received' 
    });

  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar webhook',
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * Um signatário assinou
 */
async function handleSignatureRequestSigned(event: any) {
  const signatureRequestId = event.signature_request?.signature_request_id;
  const signature = event.signature_request?.signatures?.[0];
  
  if (!signatureRequestId) return;

  console.log(`✍️ Signature signed by ${signature?.signer_email_address}`);

  // Atualizar assinatura no banco
  await prisma.signature.updateMany({
    where: {
      signatureRequestId,
      status: 'pending',
    },
    data: {
      status: 'signed',
      signedAt: new Date(),
      ipAddress: signature?.last_viewed_at ? undefined : signature?.status_code,
    },
  });

  // Log de auditoria
  const investor = await prisma.investor.findFirst({
    where: { signatureRequestId },
  });

  if (investor) {
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'signature_signed',
        entity: 'signature',
        entityId: signatureRequestId,
        changes: JSON.stringify(event),
      },
    });
  }
}

/**
 * Todos os signatários assinaram
 */
async function handleSignatureRequestAllSigned(event: any) {
  const signatureRequestId = event.signature_request?.signature_request_id;
  
  if (!signatureRequestId) return;

  console.log(`✅ All signatures completed for request ${signatureRequestId}`);

  // Atualizar investidor
  await prisma.investor.updateMany({
    where: { signatureRequestId },
    data: {
      signatureStatus: 'signed',
      status: 'submitted',
    },
  });

  // Atualizar todas as assinaturas
  await prisma.signature.updateMany({
    where: { signatureRequestId },
    data: {
      status: 'signed',
      signedAt: new Date(),
    },
  });

  // Log de auditoria
  const investor = await prisma.investor.findFirst({
    where: { signatureRequestId },
  });

  if (investor) {
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'all_signatures_completed',
        entity: 'investor',
        entityId: investor.id,
        changes: JSON.stringify(event),
      },
    });
  }
}

/**
 * Assinatura recusada
 */
async function handleSignatureRequestDeclined(event: any) {
  const signatureRequestId = event.signature_request?.signature_request_id;
  const signature = event.signature_request?.signatures?.[0];
  
  if (!signatureRequestId) return;

  console.log(`❌ Signature declined by ${signature?.signer_email_address}`);

  // Atualizar investidor
  await prisma.investor.updateMany({
    where: { signatureRequestId },
    data: {
      signatureStatus: 'declined',
    },
  });

  // Atualizar assinaturas
  await prisma.signature.updateMany({
    where: { signatureRequestId },
    data: {
      status: 'declined',
      declinedAt: new Date(),
      declineReason: signature?.decline_reason || 'No reason provided',
    },
  });

  // Log de auditoria
  const investor = await prisma.investor.findFirst({
    where: { signatureRequestId },
  });

  if (investor) {
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'signature_declined',
        entity: 'signature',
        entityId: signatureRequestId,
        changes: JSON.stringify(event),
      },
    });
  }
}

/**
 * Solicitação expirada
 */
async function handleSignatureRequestExpired(event: any) {
  const signatureRequestId = event.signature_request?.signature_request_id;
  
  if (!signatureRequestId) return;

  console.log(`⏰ Signature request expired: ${signatureRequestId}`);

  // Atualizar investidor
  await prisma.investor.updateMany({
    where: { signatureRequestId },
    data: {
      signatureStatus: 'expired',
    },
  });

  // Atualizar assinaturas
  await prisma.signature.updateMany({
    where: { signatureRequestId },
    data: {
      status: 'expired',
    },
  });

  // Log de auditoria
  const investor = await prisma.investor.findFirst({
    where: { signatureRequestId },
  });

  if (investor) {
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'signature_expired',
        entity: 'signature',
        entityId: signatureRequestId,
        changes: JSON.stringify(event),
      },
    });
  }
}

/**
 * GET /api/webhooks/dropbox-sign
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Dropbox Sign webhook endpoint is active',
  });
}
