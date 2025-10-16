// @ts-nocheck
import { SignJWT, jwtVerify } from 'jose';
import prisma from './db';
import crypto from 'crypto';

// Chaves secretas
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias
const CODE_EXPIRY = 5 * 60 * 1000; // 5 minutos
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

/**
 * Gera um código de verificação de 6 dígitos
 */
export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Cria ou atualiza um usuário baseado no email
 */
export async function findOrCreateUser(email: string, name?: string) {
  const normalizedEmail = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { investor: true },
  });

  if (!user) {
    // Verificar se já existe um investidor com esse email
    const investor = await prisma.investor.findUnique({
      where: { email: normalizedEmail },
    });

    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || investor?.fullName,
        investorId: investor?.id,
      },
      include: { investor: true },
    });
  }

  return user;
}

/**
 * Verifica se o usuário está bloqueado por muitas tentativas
 */
export async function checkUserLockout(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return true; // Ainda bloqueado
  }

  // Se passou o tempo de bloqueio, resetar
  if (user.lockedUntil && user.lockedUntil <= new Date()) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  return false;
}

/**
 * Incrementa tentativas de login e bloqueia se necessário
 */
export async function incrementLoginAttempts(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  const attempts = user.loginAttempts + 1;

  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: attempts,
      lockedUntil: attempts >= MAX_LOGIN_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_DURATION)
        : null,
    },
  });
}

/**
 * Cria um código de verificação
 */
export async function createVerificationCode(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY);

  // Invalidar códigos anteriores não usados
  await prisma.verificationCode.updateMany({
    where: {
      userId,
      used: false,
    },
    data: {
      used: true,
    },
  });

  // Criar novo código
  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId,
      code,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return verificationCode;
}

/**
 * Verifica um código de verificação
 */
export async function verifyCode(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  // Verificar se o usuário está bloqueado
  const isLocked = await checkUserLockout(userId);
  if (isLocked) {
    return {
      success: false,
      error: 'Conta temporariamente bloqueada. Tente novamente em 15 minutos.',
    };
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      userId,
      code,
      used: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!verificationCode) {
    await incrementLoginAttempts(userId);
    return {
      success: false,
      error: 'Código inválido.',
    };
  }

  // Verificar expiração
  if (verificationCode.expiresAt < new Date()) {
    return {
      success: false,
      error: 'Código expirado. Solicite um novo código.',
    };
  }

  // Marcar código como usado
  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: {
      used: true,
      usedAt: new Date(),
    },
  });

  // Resetar tentativas de login
  await prisma.user.update({
    where: { id: userId },
    data: {
      loginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  return { success: true };
}

/**
 * Cria uma sessão JWT
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Criar token JWT
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  // Salvar sessão no banco
  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return { token, session };
}

/**
 * Verifica se um token JWT é válido
 */
export async function verifyToken(token: string) {
  try {
      await jwtVerify(token, JWT_SECRET);
    
    // Verificar se a sessão ainda existe e é válida
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { include: { investor: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    // Atualizar última atividade
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    return session.user;
  } catch {
    return null;
  }
}

/**
 * Invalida uma sessão (logout)
 */
export async function invalidateSession(token: string) {
  await prisma.session.delete({
    where: { token },
  });
}

/**
 * Invalida todas as sessões de um usuário
 */
export async function invalidateAllUserSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  });
}

/**
 * Limpa códigos e sessões expiradas
 */
export async function cleanupExpiredData() {
  const now = new Date();

  // Deletar códigos expirados
  await prisma.verificationCode.deleteMany({
    where: {
      expiresAt: { lt: now },
    },
  });

  // Deletar sessões expiradas
  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: now },
    },
  });
}

/**
 * Registra evento de auditoria
 */
export async function logAuditEvent(
  action: string,
  userId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.userAuditLog.create({
    data: {
      userId,
      action,
      details: details ? JSON.stringify(details) : null,
      ipAddress,
      userAgent,
    },
  });
}
