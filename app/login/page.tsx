// @ts-nocheck
'use client';

import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se já autenticado, ir para dashboard
    if (auth.isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Se não está carregando e não está autenticado, redirecionar para Cognito
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.isLoading, auth, router]);

  // Tela de loading enquanto redireciona
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Redirecionando para login seguro...</p>
        <p className="text-blue-200 text-sm mt-2">AWS Cognito</p>
      </div>
    </div>
  );
}
