// @ts-nocheck
'use client';

import { useAuth } from 'react-oidc-context';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function CallbackPage() {
  const auth = useAuth();
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const href = typeof window !== 'undefined' ? window.location.href : '';
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const search = url ? url.searchParams : null;
    const hasAuthParams = !!(search && (search.get('code') || search.get('id_token') || search.get('access_token')));

    const run = async () => {
      try {
        if (hasAuthParams && typeof auth.signinRedirectCallback === 'function') {
          // Pass the current URL explicitly so the library parses the code/state
          await auth.signinRedirectCallback(href || undefined);
          router.replace('/dashboard');
          return;
        }

        if (auth.isAuthenticated) {
          router.replace('/dashboard');
          return;
        }

        if (auth.error) {
          console.error('Callback error:', auth.error);
          router.replace('/login');
        }
      } catch (e) {
        console.error('signinRedirectCallback error:', e);
        router.replace('/login');
      }
    };

    // Fallback timeout: if the callback doesn't resolve (e.g., missing state), send to /login
    const timeout = setTimeout(() => {
      if (!auth.isAuthenticated) {
        router.replace('/login');
      }
    }, 3000);

    run().finally(() => clearTimeout(timeout));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Autenticando...</p>
        <p className="text-sm text-gray-300 mt-2">Aguarde enquanto validamos suas credenciais</p>
      </div>
    </div>
  );
}
