import type { Metadata } from 'next';
import './globals.css';
import CognitoAuthProvider from '@/components/CognitoAuthProvider';

export const metadata: Metadata = {
  title: 'Netz Private Credit Fund — Subscriptions',
  description: 'Portal de subscrição do Netz Private Credit Fund',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen text-neutral-900 antialiased">
        <CognitoAuthProvider>
          {children}
        </CognitoAuthProvider>
      </body>
    </html>
  );
}
