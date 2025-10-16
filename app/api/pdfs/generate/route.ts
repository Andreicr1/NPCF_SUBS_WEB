// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '../../../../lib/db';
import { generateAllPdfs } from '../../../../lib/pdfGenerator';
import { createSignatureRequest } from '../../../../lib/dropboxSign';
import { CompleteKycData } from '../../../../lib/types';

/**
 * POST /api/pdfs/generate
 * Gera todos os PDFs preenchidos e envia para Dropbox Sign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { investorId } = body;

    if (!investorId) {
      return NextResponse.json(
        { error: 'investorId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados do investidor
    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
      include: {
        documents: true,
      },
    });

    if (!investor) {
      return NextResponse.json(
        { error: 'Investidor não encontrado' },
        { status: 404 }
      );
    }

    // Parsear dados JSON
    const wealthCategories = investor.wealthCategories 
      ? JSON.parse(investor.wealthCategories) 
      : [];
    const taxResidencies = investor.taxResidencies 
      ? JSON.parse(investor.taxResidencies) 
      : [];

    // Montar objeto KYC completo
    const kycData: CompleteKycData = {
      pep: {
        isPep: investor.isPep,
        pepDetails: investor.pepDetails || '',
        pepPosition: investor.pepPosition || '',
        pepCountry: investor.pepCountry || '',
        isRca: investor.isRca,
        rcaRelationship: investor.rcaRelationship || '',
      },
      source: {
        sourceOfFunds: investor.sourceOfFunds || '',
        sourceOfWealth: investor.sourceOfWealth || '',
        wealthCategories,
        wealthDetails: investor.wealthDetails || '',
        transferringBank: investor.transferringBank || '',
        transferringBankCountry: investor.transferringBankCountry || '',
        employerName: investor.employerName || '',
        employerAddress: investor.employerAddress || '',
        assetsArePersonalProperty: investor.assetsArePersonalProperty,
        noAssetsFromCriminalActivity: investor.noAssetsFromCriminalActivity,
      },
      fatcaCrs: {
        isUsCitizen: investor.isUsCitizen,
        ustin: investor.ustin || '',
        usBirthplace: investor.usBirthplace || '',
        hasSurrenderedUsCitizenship: investor.hasSurrenderedUsCitizenship,
        taxResidencies,
      },
      subscription: {
        eligibleInvestorConfirmation: investor.eligibleInvestorConfirmation,
        nonUsPersonConfirmation: investor.nonUsPersonConfirmation,
        shareClassSelection: investor.shareClassSelection as any,
        subscriptionAmount: Number(investor.subscriptionAmount) || 0,
        subscriptionAmountWords: investor.subscriptionAmountWords || '',
        incorporationDate: investor.incorporationDate || undefined,
        incorporationPlace: investor.incorporationPlace || '',
        countryOfFormation: investor.countryOfFormation || '',
        incomingBankLocation: investor.transferringBankCountry || '',
        mailingAddress: investor.mailingAddress || '',
        signatoryCapacity: investor.signatoryCapacity || '',
      },
      purposeOfAccount: investor.purposeOfAccount || '',
      expectedActivity: investor.expectedActivity || '',
      fundingSource: investor.fundingSource || '',
    };

    // Gerar PDFs preenchidos
    console.log('📄 Gerando PDFs preenchidos...');
    const pdfs = await generateAllPdfs(investor, kycData);

    // Preparar buffers para Dropbox Sign
    const files = [
      Buffer.from(pdfs.kycPdf),
      Buffer.from(pdfs.fatcaPdf),
      Buffer.from(pdfs.sourceOfWealthPdf),
      Buffer.from(pdfs.subscriptionPdf),
    ];

    // Criar solicitação de assinatura
    console.log('✍️ Enviando para Dropbox Sign...');
    const signatureRequest = await createSignatureRequest({
      title: `NPCF Subscription Documents - ${investor.fullName}`,
      subject: 'Please sign your NPCF subscription documents',
      message: `Dear ${investor.fullName},\n\nPlease review and sign the following documents to complete your subscription to Netz Private Credit Fund:\n\n1. KYC Client Questionnaire\n2. FATCA/CRS Self-Certification\n3. Source of Funds and Wealth Form\n4. Subscription Agreement\n\nThank you.`,
      signers: [
        {
          emailAddress: investor.email,
          name: investor.fullName,
          order: 0,
        },
      ],
      files,
      testMode: process.env.DROPBOX_SIGN_TEST_MODE === 'true',
    });

    // Atualizar investidor com ID da solicitação
    await prisma.investor.update({
      where: { id: investorId },
      data: {
        signatureRequestId: signatureRequest.signature_request?.signature_request_id,
        signatureStatus: 'pending',
        updatedAt: new Date(),
      },
    });

    // Criar registros de assinatura
  await prisma.signature.createMany({
      data: [
        {
          investorId: investor.id,
          documentType: 'kyc',
          status: 'pending',
          signatureRequestId: signatureRequest.signature_request?.signature_request_id || '',
        },
        {
          investorId: investor.id,
          documentType: 'fatca',
          status: 'pending',
          signatureRequestId: signatureRequest.signature_request?.signature_request_id || '',
        },
        {
          investorId: investor.id,
          documentType: 'source_of_wealth',
          status: 'pending',
          signatureRequestId: signatureRequest.signature_request?.signature_request_id || '',
        },
        {
          investorId: investor.id,
          documentType: 'subscription',
          status: 'pending',
          signatureRequestId: signatureRequest.signature_request?.signature_request_id || '',
        },
      ],
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'generate_pdfs',
        entity: 'investor',
        entityId: investor.id,
        changes: JSON.stringify({
          signatureRequestId: signatureRequest.signature_request?.signature_request_id,
        }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      signatureRequestId: signatureRequest.signature_request?.signature_request_id,
      signUrl: signatureRequest.signature_request?.signatures?.[0]?.signature_url,
      message: 'PDFs gerados e enviados para assinatura com sucesso',
    });

  } catch (error: any) {
    console.error('❌ Error generating PDFs:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao gerar PDFs',
        details: error.body || error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pdfs/generate?investorId=xxx
 * Retorna o status da solicitação de assinatura
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const investorId = searchParams.get('investorId');

    if (!investorId) {
      return NextResponse.json(
        { error: 'investorId é obrigatório' },
        { status: 400 }
      );
    }

    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
      include: {
        signatures: true,
      },
    });

    if (!investor) {
      return NextResponse.json(
        { error: 'Investidor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      signatureRequestId: investor.signatureRequestId,
      signatureStatus: investor.signatureStatus,
      signatures: investor.signatures,
    });

  } catch (error: any) {
    console.error('Error fetching signature status:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar status de assinatura' },
      { status: 500 }
    );
  }
}
