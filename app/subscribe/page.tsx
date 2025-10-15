'use client';

import { useCallback, useState } from 'react';
import { InvestmentWizard, InvestmentWizardData } from '../../components/InvestmentWizard';

export default function SubscribePage() {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = useCallback(async (data: InvestmentWizardData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investorData: data.investor, kycData: data.kycData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Falha ao submeter');
      setSubmittedId(json.investorId ?? null);
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao submeter seus dados.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Subscrição</h1>
      {submittedId ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-green-800">Dados enviados com sucesso. Protocolo: {submittedId}</p>
        </div>
      ) : (
        <InvestmentWizard fundId="npcf" onComplete={handleComplete} />
      )}
      {submitting && (
        <p className="mt-4 text-sm text-gray-500">Enviando dados, aguarde…</p>
      )}
    </main>
  );
}

