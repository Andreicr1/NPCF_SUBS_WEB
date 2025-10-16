// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import {
  verifyCode,
  createSession,
  logAuditEvent,
} from '../../../../lib/auth';

/**
 * POST /api/auth/verify
 * Verifica código e cria sessão
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    // Validação
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'userId e code são obrigatórios' },
        { status: 400 }
      );
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código deve ter 6 dígitos' },
        { status: 400 }
      );
    }

    // Verificar código
    const result = await verifyCode(userId, code);

    if (!result.success) {
      // Log de tentativa falha
      await logAuditEvent(
        'login_failed',
        userId,
        { reason: result.error },
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        request.headers.get('user-agent')
      );

      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Criar sessão
    const { token, session } = await createSession(
      userId,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    // Log de sucesso
    await logAuditEvent(
      'login_success',
      userId,
      { sessionId: session.id },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    // Configurar cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('❌ Erro na verificação:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar código' },
      { status: 500 }
    );
  }
}
