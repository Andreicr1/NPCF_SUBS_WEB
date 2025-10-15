import Link from 'next/link';
import { ShieldCheck, BarChart3, Globe } from 'lucide-react';

function CornerDecoration() {
  return (
    <>
      <svg className="pointer-events-none absolute right-2 top-2 w-40 h-40 opacity-40 text-neutral-300" viewBox="0 0 100 100" fill="none">
        <path d="M100 20 C60 20, 60 60, 20 60" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 10 C55 10, 55 55, 10 55" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 5 C52 5, 52 52, 5 52" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
      <svg className="pointer-events-none absolute left-2 bottom-2 w-40 h-40 opacity-40 rotate-180 text-neutral-300" viewBox="0 0 100 100" fill="none">
        <path d="M100 20 C60 20, 60 60, 20 60" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 10 C55 10, 55 55, 10 55" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M100 5 C52 5, 52 52, 5 52" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </>
  );
}

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-hero-grad">
      <CornerDecoration />

      <section className="relative z-10 mx-auto flex min-h-[75vh] max-w-5xl flex-col items-center px-6 py-20 text-center animate-fadeUp">
        {/* Logo + OFFSHORE */}
        <div className="mb-12">
          <div className="mx-auto flex items-end justify-center gap-3">
            <span className="font-display text-[56px] leading-none text-primary">Netz</span>
            <span className="font-display text-[56px] leading-none text-secondary">asset</span>
          </div>
          <div className="mt-2 text-[16px] tracking-[4px] text-neutral-600">OFFSHORE</div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 font-display text-5xl font-bold text-primary">Netz Private Credit Fund</h1>
        <p className="mb-10 text-[20px] text-neutral-600">Portal de subscrição profissional e seguro</p>

        {/* CTA */}
        <Link href="/subscribe" className="btn-primary w-[200px] h-[56px]">
          Iniciar Subscrição
        </Link>

        {/* Divider */}
        <div className="my-16 h-[2px] w-20 bg-accent mx-auto rounded" />
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto mb-20 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<ShieldCheck size={48} className="text-accent" />}
          title="Segurança e Compliance"
          description="Regulado pelas Ilhas Cayman com compliance internacional completo"
        />
        <FeatureCard
          icon={<BarChart3 size={48} className="text-accent" />}
          title="Investimento Profissional"
          description="Acesso exclusivo para investidores qualificados e sofisticados"
        />
        <FeatureCard
          icon={<Globe size={48} className="text-accent" />}
          title="Processo Digital"
          description="Subscrição 100% online com validação em 5 passos"
        />
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-xl border-2 border-neutral-300 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200/60 mx-auto">{icon}</div>
      <h3 className="mb-2 font-display text-xl font-semibold text-neutral-900">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
}
