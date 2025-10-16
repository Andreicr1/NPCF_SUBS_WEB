// @ts-nocheck
'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  const handleSignOut = () => {
    const clientId = "2amt18k5uhrjtkklvpcotbtp8n";
    const logoutUri = encodeURIComponent(window.location.origin);
    const cognitoDomain = "https://us-east-12tppesefc.auth.us-east-1.amazoncognito.com";
    
    // Remover usuário localmente
    auth.removeUser();
    
    // Redirecionar para logout do Cognito
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null; // useEffect vai redirecionar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Portal do Investidor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Bem-vindo, {auth.user?.profile.email || 'Investidor'}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações da Conta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-indigo-600">
                {auth.user?.profile.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="text-lg font-semibold text-gray-900">
                {auth.user?.profile.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="text-lg font-semibold text-gray-900">
                {auth.user?.profile.phone_number || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">
                ✅ Autenticado
              </p>
            </div>
          </div>
        </div>

        {/* Menu de Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Continuar/Nova Subscrição */}
          <button
            onClick={() => router.push('/subscribe')}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-8 hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">
                Nova Subscrição
              </h3>
              <p className="text-indigo-100">
                Inicie uma nova subscrição de cotas
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>

          {/* Meus Documentos */}
          <button
            className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-8 hover:border-indigo-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Meus Documentos
              </h3>
              <p className="text-gray-600">
                Visualize e gerencie seus documentos
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </button>

          {/* Perfil */}
          <button
            className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-8 hover:border-indigo-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Perfil
              </h3>
              <p className="text-gray-600">
                Atualize suas informações pessoais
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </button>

          {/* Suporte */}
          <button
            className="bg-white border-2 border-gray-200 rounded-xl shadow-sm p-8 hover:border-indigo-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Suporte
              </h3>
              <p className="text-gray-600">
                Precisa de ajuda? Entre em contato
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Debug Info (Dev Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <summary className="cursor-pointer font-bold text-gray-900 mb-4">
              🔍 Debug Info (Dev Only)
            </summary>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                <p className="text-xs text-gray-600 mb-2">User Profile:</p>
                <pre className="text-xs text-gray-800">{JSON.stringify(auth.user?.profile, null, 2)}</pre>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
                <p className="text-xs text-gray-600 mb-2">ID Token (truncated):</p>
                <pre className="text-xs text-gray-800 break-all whitespace-pre-wrap">
                  {auth.user?.id_token?.substring(0, 100)}...
                </pre>
              </div>
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
