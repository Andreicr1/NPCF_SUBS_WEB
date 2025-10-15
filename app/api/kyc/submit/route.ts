import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '../../../../lib/db';
import { CompleteKycData } from '../../../../lib/types';

// POST /api/kyc/submit - Submeter dados KYC completos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { investorData, kycData } = body as { investorData: any; kycData: CompleteKycData };

    // Validação básica
    if (!investorData.cpfCnpj || !investorData.fullName || !investorData.email) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Preparar dados para salvar
    const dataToSave = {
      ...investorData,
      // PEP/AML
      isPep: kycData.pep.isPep,
      pepDetails: kycData.pep.pepDetails,
      pepPosition: kycData.pep.pepPosition,
      pepCountry: kycData.pep.pepCountry,
      isRca: kycData.pep.isRca,
      rcaRelationship: kycData.pep.rcaRelationship,
      
      // Source of Wealth
      sourceOfFunds: kycData.source.sourceOfFunds,
      sourceOfWealth: kycData.source.sourceOfWealth,
      wealthCategories: JSON.stringify(kycData.source.wealthCategories),
      wealthDetails: kycData.source.wealthDetails,
      transferringBank: kycData.source.transferringBank,
      transferringBankCountry: kycData.source.transferringBankCountry,
      employerName: kycData.source.employerName,
      employerAddress: kycData.source.employerAddress,
      
      // FATCA/CRS
      isUsCitizen: kycData.fatcaCrs.isUsCitizen,
      ustin: kycData.fatcaCrs.ustin,
      usBirthplace: kycData.fatcaCrs.usBirthplace,
      hasSurrenderedUsCitizenship: kycData.fatcaCrs.hasSurrenderedUsCitizenship,
      taxResidencies: JSON.stringify(kycData.fatcaCrs.taxResidencies),
      
      // Subscription Agreement
      eligibleInvestorConfirmation: kycData.subscription.eligibleInvestorConfirmation,
      nonUsPersonConfirmation: kycData.subscription.nonUsPersonConfirmation,
      shareClassSelection: kycData.subscription.shareClassSelection,
      subscriptionAmountWords: kycData.subscription.subscriptionAmountWords,
      
      status: 'submitted',
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    // Criar ou atualizar investidor
    const investor = await prisma.investor.upsert({
      where: { cpfCnpj: investorData.cpfCnpj },
      create: dataToSave,
      update: dataToSave,
    });

    // Criar log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'submit',
        entity: 'investor',
        entityId: investor.id,
        changes: JSON.stringify({ investorData, kycData }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      investorId: investor.id,
      investor,
    });

  } catch (error: any) {
    console.error('Error submitting KYC:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao submeter dados KYC' },
      { status: 500 }
    );
  }
}

// GET /api/kyc/submit?investorId=xxx - Buscar dados KYC de um investidor
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
        documents: true,
        signatures: true,
      },
    });

    if (!investor) {
      return NextResponse.json(
        { error: 'Investidor não encontrado' },
        { status: 404 }
      );
    }

    // Parsear JSON fields
    const investorData = {
      ...investor,
      wealthCategories: investor.wealthCategories ? JSON.parse(investor.wealthCategories) : [],
      taxResidencies: investor.taxResidencies ? JSON.parse(investor.taxResidencies) : [],
    };

    return NextResponse.json(investorData);

  } catch (error: any) {
    console.error('Error fetching KYC data:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar dados KYC' },
      { status: 500 }
    );
  }
}
