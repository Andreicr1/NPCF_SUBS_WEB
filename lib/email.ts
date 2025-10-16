// @ts-nocheck
/**
 * Serviço de envio de emails
 * Suporta Resend (recomendado) e SendGrid
 */

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'resend'; // 'resend' | 'sendgrid'
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@npcf.fund';
const FROM_NAME = process.env.FROM_NAME || 'Netz Private Credit Fund';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Envia email usando Resend
 */
async function sendWithResend(options: EmailOptions) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não configurada');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Envia email usando SendGrid
 */
async function sendWithSendGrid(options: EmailOptions) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY não configurada');
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: options.to }],
          subject: options.subject,
        },
      ],
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      content: [
        {
          type: 'text/html',
          value: options.html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  return { success: true };
}

/**
 * Envia email (escolhe o provider automaticamente)
 */
export async function sendEmail(options: EmailOptions) {
  try {
    if (EMAIL_PROVIDER === 'sendgrid') {
      return await sendWithSendGrid(options);
    } else {
      return await sendWithResend(options);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw error;
  }
}

/**
 * Template de email para código de verificação
 */
export function getVerificationEmailTemplate(code: string, expiresInMinutes: number = 5) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificação - NPCF</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .code-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .code {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 8px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .expiry {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 10px;
    }
    .info {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
    .warning {
      color: #e53e3e;
      font-size: 14px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>🔒 Netz Private Credit Fund</h1>
    </div>
    
    <h2 style="color: #1a1a1a; margin-bottom: 20px;">Seu Código de Verificação</h2>
    
    <p>Você solicitou acesso ao portal de investidores. Use o código abaixo para completar o login:</p>
    
    <div class="code-box">
      <div style="font-size: 16px; opacity: 0.9;">Código de Verificação</div>
      <div class="code">${code}</div>
      <div class="expiry">⏱️ Expira em ${expiresInMinutes} minutos</div>
    </div>
    
    <div class="info">
      <strong>🛡️ Dicas de Segurança:</strong>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Nunca compartilhe este código com ninguém</li>
        <li>Nosso time nunca pedirá este código por telefone ou email</li>
        <li>Se você não solicitou este código, ignore este email</li>
      </ul>
    </div>
    
    <p style="margin-top: 30px;">
      Se você tiver alguma dúvida ou não solicitou este código, entre em contato conosco imediatamente.
    </p>
    
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} Netz Private Credit Fund. Todos os direitos reservados.<br>
        Este é um email automático, por favor não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Netz Private Credit Fund - Código de Verificação

Seu código de verificação é: ${code}

Este código expira em ${expiresInMinutes} minutos.

Nunca compartilhe este código com ninguém.

Se você não solicitou este código, ignore este email.

© ${new Date().getFullYear()} Netz Private Credit Fund
  `.trim();

  return { html, text };
}

/**
 * Envia código de verificação por email
 */
export async function sendVerificationCode(email: string, code: string) {
  const { html, text } = getVerificationEmailTemplate(code);

  return await sendEmail({
    to: email,
    subject: `Seu código de verificação: ${code}`,
    html,
    text,
  });
}

/**
 * Envia email de boas-vindas
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bem-vindo - NPCF</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Bem-vindo ao Netz Private Credit Fund!</h1>
  
  <p>Olá ${name},</p>
  
  <p>É um prazer tê-lo(a) conosco. Sua conta foi criada com sucesso.</p>
  
  <p>Você já pode acessar o portal de investidores e começar o processo de subscrição.</p>
  
  <p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Acessar Dashboard
    </a>
  </p>
  
  <p>Se tiver alguma dúvida, estamos à disposição.</p>
  
  <p>Atenciosamente,<br>Equipe NPCF</p>
  
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Netz Private Credit Fund</p>
</body>
</html>
  `;

  return await sendEmail({
    to: email,
    subject: 'Bem-vindo ao Netz Private Credit Fund',
    html,
  });
}
