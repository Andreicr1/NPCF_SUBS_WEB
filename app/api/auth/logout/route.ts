// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { invalidateSession, logAuditEvent, verifyToken } from '../../../../lib/auth';

/**
 * POST /api/auth/logout
 * Invalida sessão atual
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar usuário
    const user = await verifyToken(token);

    // Invalidar sessão
    await invalidateSession(token);

    // Log de auditoria
    if (user) {
      await logAuditEvent(
        'logout',
        user.id,
        {},
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        request.headers.get('user-agent')
      );
    }

    // Remover cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });

    response.cookies.delete('session_token');

    return response;

  } catch (error: any) {
    console.error('❌ Erro no logout:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
