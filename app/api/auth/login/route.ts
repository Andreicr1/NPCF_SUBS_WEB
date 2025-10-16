// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import {
  findOrCreateUser,
  createVerificationCode,
  logAuditEvent,
  checkUserLockout,
} from '../../../../lib/auth';
import { sendVerificationCode } from '../../../../lib/email';

/**
 * POST /api/auth/login
 * Envia código de verificação por email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validação
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Buscar ou criar usuário
    const user = await findOrCreateUser(normalizedEmail);

    // Verificar se está bloqueado
    const isLocked = await checkUserLockout(user.id);
    if (isLocked) {
      await logAuditEvent(
        'login_blocked',
        user.id,
        { email: normalizedEmail },
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        request.headers.get('user-agent')
      );

      return NextResponse.json(
        { 
          error: 'Conta temporariamente bloqueada devido a múltiplas tentativas. Tente novamente em 15 minutos.',
        },
        { status: 429 }
      );
    }

    // Criar código de verificação
    const verificationCode = await createVerificationCode(
      user.id,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    // Enviar email
    try {
      await sendVerificationCode(normalizedEmail, verificationCode.code);
    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError);
      
      // Se falhar, ainda assim retornar sucesso (mas logar o erro)
      await logAuditEvent(
        'email_send_failed',
        user.id,
        { error: emailError.message },
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        request.headers.get('user-agent')
      );
      
      // Em desenvolvimento, retornar o código no console
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Código de verificação (DEV):', verificationCode.code);
      }
    }

    // Log de auditoria
    await logAuditEvent(
      'code_sent',
      user.id,
      { email: normalizedEmail },
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request.headers.get('user-agent')
    );

    return NextResponse.json({
      success: true,
      message: 'Código de verificação enviado para seu email',
      userId: user.id,
      email: normalizedEmail,
      // Em desenvolvimento, retornar o código
      ...(process.env.NODE_ENV === 'development' && { devCode: verificationCode.code }),
    });

  } catch (error: any) {
    console.error('❌ Erro no login:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar login' },
      { status: 500 }
    );
  }
}
