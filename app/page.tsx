'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    // Se já autenticado, ir direto para dashboard
    if (auth.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [auth.isAuthenticated, router]);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Netz Private Credit Fund
            </h1>
            <div className="h-1 w-32 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-blue-200 font-light">
              Portal do Investidor
            </p>
          </div>

          {/* Description */}
          <div className="mb-12 space-y-4">
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Bem-vindo ao portal exclusivo para investidores do Netz Private Credit Fund.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Acesse sua conta para gerenciar subscrições, visualizar documentos e acompanhar seus investimentos.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleLogin}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Acessar Portal</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-2">Seguro</h3>
              <p className="text-gray-300 text-sm">Autenticação AWS Cognito com criptografia enterprise-grade</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-2">Digital</h3>
              <p className="text-gray-300 text-sm">Assinatura eletrônica via Dropbox Sign integrada</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Rápido</h3>
              <p className="text-gray-300 text-sm">Processo de subscrição 100% online em minutos</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>© 2024 Netz Private Credit Fund. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
