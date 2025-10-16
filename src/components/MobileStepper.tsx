import React from 'react'
import { STEPS, StepId, stepIndex } from '../lib/steps'

export default function MobileStepper({ current }: { current: StepId }) {
  const idx = stepIndex(current)
  return (
    <div className="sm:hidden flex items-center justify-between text-sm text-ink-700">
      <span>
        Etapa {idx + 1} de {STEPS.length}
      </span>
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <span key={s.id} className={`h-1.5 w-6 rounded-full ${i <= idx ? 'bg-brand-600' : 'bg-muted-200'}`} />
        ))}
      </div>
    </div>
  )
}

