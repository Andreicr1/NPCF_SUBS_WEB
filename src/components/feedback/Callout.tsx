import React from 'react'

type Props = {
  tone?: 'info' | 'sucesso' | 'alerta'
  children: React.ReactNode
}

export default function Callout({ tone = 'info', children }: Props) {
  const tones = {
    info: 'bg-brand-400/10 text-ink-700 border-brand-400/30',
    sucesso: 'bg-green-400/10 text-green-800 border-green-400/30',
    alerta: 'bg-yellow-400/10 text-yellow-800 border-yellow-400/30',
  }
  return <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>{children}</div>
}

