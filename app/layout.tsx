import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Netz Private Credit Fund — Subscriptions',
  description: 'Portal de subscrição do Netz Private Credit Fund',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
