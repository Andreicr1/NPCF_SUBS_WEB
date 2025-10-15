import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { validateCPF, validateCNPJ } from '../../../lib/validation';

// GET /api/investors - Listar todos os investidores (com filtros)
// GET /api/investors?email=xxx - Buscar por email
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const cpfCnpj = searchParams.get('cpfCnpj');
    const status = searchParams.get('status');

    // Buscar por filtros
    if (email || cpfCnpj) {
      const investor = await prisma.investor.findFirst({
        where: {
          ...(email && { email }),
          ...(cpfCnpj && { cpfCnpj }),
        },
        include: {
          documents: true,
          signatures: true,
        },
      });

      if (!investor) {
        return NextResponse.json(
          { error: 'Investor not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(investor);
    }

    // Listar todos (com filtro de status)
    const investors = await prisma.investor.findMany({
      where: {
        ...(status && { status }),
      },
      include: {
        documents: {
          select: {
            id: true,
            documentType: true,
            status: true,
          },
        },
        signatures: {
          select: {
            id: true,
            status: true,
            signedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(investors);
  } catch (error: any) {
    console.error('Error fetching investors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investors', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/investors - Criar novo investidor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validações
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!body.cpfCnpj) {
      return NextResponse.json(
        { error: 'CPF/CNPJ is required' },
        { status: 400 }
      );
    }

    // Validar CPF ou CNPJ
    const cpfCnpjClean = body.cpfCnpj.replace(/[^\d]/g, '');
    if (cpfCnpjClean.length === 11) {
      if (!validateCPF(cpfCnpjClean)) {
        return NextResponse.json(
          { error: 'Invalid CPF' },
          { status: 400 }
        );
      }
    } else if (cpfCnpjClean.length === 14) {
      if (!validateCNPJ(cpfCnpjClean)) {
        return NextResponse.json(
          { error: 'Invalid CNPJ' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'CPF/CNPJ must be 11 or 14 digits' },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const existingInvestor = await prisma.investor.findFirst({
      where: {
        OR: [
          { email: body.email },
          { cpfCnpj: body.cpfCnpj },
        ],
      },
    });

    if (existingInvestor) {
      return NextResponse.json(
        { error: 'Investor with this email or CPF/CNPJ already exists' },
        { status: 409 }
      );
    }

    // Criar investidor
    const investor = await prisma.investor.create({
      data: {
        investorType: body.investorType || 'individual',
        fullName: body.fullName,
        legalName: body.legalName,
        cpfCnpj: body.cpfCnpj,
        rg: body.rg,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        nationality: body.nationality,
        maritalStatus: body.maritalStatus,
        profession: body.profession,
        
        address: body.address,
        addressNumber: body.addressNumber,
        complement: body.complement,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        country: body.country || 'Brasil',
        
        email: body.email,
        phone: body.phone,
        cellphone: body.cellphone,
        
        isQualified: body.isQualified || false,
        qualificationType: body.qualificationType,
        
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        bankAccount: body.bankAccount,
        bankAccountType: body.bankAccountType,
        
        subscriptionAmount: body.subscriptionAmount,
        numberOfQuotas: body.numberOfQuotas,
        quotaValue: body.quotaValue,
        
        isPep: body.isPep || false,
        pepDetails: body.pepDetails,
        
        status: 'draft',
      },
    });

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: investor.id,
        action: 'create',
        entity: 'investor',
        entityId: investor.id,
        changes: JSON.stringify({ created: true }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json(investor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating investor:', error);
    return NextResponse.json(
      { error: 'Failed to create investor', details: error.message },
      { status: 500 }
    );
  }
}