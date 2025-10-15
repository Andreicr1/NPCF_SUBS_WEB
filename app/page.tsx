import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Netz Private Credit Fund</h1>
      <p className="text-gray-600 mb-8">
        Portal de subscrição. Para iniciar, clique no botão abaixo.
      </p>
      <Link
        href="/subscribe"
        className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
      >
        Iniciar Subscrição
      </Link>
    </main>
  );
}

