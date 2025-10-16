// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { verifyToken } from '../../../../lib/auth';

/**
 * GET /api/auth/me
 * Retorna dados do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      );
    }

    // Retornar dados do usuário (sem informações sensíveis)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      investor: user.investor ? {
        id: user.investor.id,
        fullName: user.investor.fullName,
        status: user.investor.status,
        signatureStatus: user.investor.signatureStatus,
      } : null,
    });

  } catch (error: any) {
    console.error('❌ Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar dados do usuário' },
      { status: 500 }
    );
  }
}
