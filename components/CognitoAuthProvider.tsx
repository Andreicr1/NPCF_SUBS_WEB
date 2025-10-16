// @ts-nocheck
'use client';

import { AuthProvider } from 'react-oidc-context';
import { ReactNode } from 'react';

const domain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '').replace(/\/$/, '');
const authority = (process.env.NEXT_PUBLIC_COGNITO_AUTHORITY || 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_2tPpeSefC').replace(/\/$/, '');

const cognitoAuthConfig = {
  authority,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "2amt18k5uhrjtkklvpcotbtp8n",
  redirect_uri: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI ||
    (typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}/callback`
      : 'http://localhost:3000/callback'),
  post_logout_redirect_uri: typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:3000',
  response_type: "code",
  response_mode: "query",
  scope: process.env.NEXT_PUBLIC_COGNITO_SCOPE || "email openid phone",
  // Provide explicit metadata using Hosted UI domain to avoid discovery issues
  metadata: domain
    ? {
        issuer: authority,
        authorization_endpoint: `${domain}/oauth2/authorize`,
        token_endpoint: `${domain}/oauth2/token`,
        userinfo_endpoint: `${domain}/oauth2/userInfo`,
        end_session_endpoint: `${domain}/logout`,
        jwks_uri: `${authority}/.well-known/jwks.json`,
      }
    : undefined,
};

interface CognitoAuthProviderProps {
  children: ReactNode;
}

export default function CognitoAuthProvider({ children }: CognitoAuthProviderProps) {
  return (
    <AuthProvider
      {...cognitoAuthConfig}
      onSigninCallback={() => {
        // Limpa os parâmetros da URL após o callback do OIDC
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
          // Redireciona para o dashboard após login concluído
          window.location.replace('/dashboard');
        }
      }}
      automaticSilentRenew={true}
      monitorSession={true}
    >
      {children}
    </AuthProvider>
  );
}
