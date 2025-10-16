import React from 'react'
import { Link } from 'react-router-dom'
import { STEPS, StepId } from '../lib/steps'

type Props = { current: StepId }

export default function StepperTabs({ current }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)
  return (
    <nav aria-label="Etapas" className="bg-white rounded-2xl shadow-card p-4">
      <ol className="flex flex-wrap gap-3">
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex
          const isActive = i === currentIndex
          return (
            <li key={step.id} className="flex items-center gap-2">
              <Link
                to={`/subscribe/${step.id}`}
                className={
                  'flex items-center gap-2 px-3 py-2 rounded-lg focus-ring ' +
                  (isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700')
                }
              >
                <span
                  className={
                    'step-bullet ' +
                    (isActive ? 'step-bullet-active' : isDone ? 'step-bullet-done' : 'step-bullet-future')
                  }
                  aria-hidden
                >
                  {isDone ? '✓' : i + 1}
                </span>
                <span className="text-sm font-medium tracking-tight">{step.title}</span>
              </Link>
              {i !== STEPS.length - 1 && <span className="text-muted-400">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

