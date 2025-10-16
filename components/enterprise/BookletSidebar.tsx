"use client";
import Link from 'next/link'
import { STEPS, StepId } from '@/src/lib/steps'

type ProgressMap = Partial<Record<StepId, number>>

type Props = {
  current: StepId
  progress: ProgressMap
}

export default function BookletSidebar({ current, progress }: Props) {
  const totalPct = Math.round(
    STEPS.reduce((acc, s) => acc + (progress[s.id] ?? 0), 0) / STEPS.length
  )
  return (
    <aside className="sticky top-24">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink-900 tracking-tight">Table of Contents</h3>
          <span className="text-sm text-ink-500">{totalPct}%</span>
        </div>
        <ol className="mt-4 space-y-2">
          {STEPS.map((s, idx) => {
            const pct = progress[s.id] ?? 0
            const isActive = s.id === current
            const done = pct >= 100
            return (
              <li key={s.id}>
                <Link
                  href={`/subscribe/${s.id}`}
                  className={
                    'group flex items-center gap-3 rounded-lg px-3 py-2 focus-ring ' +
                    (isActive ? 'bg-muted-200' : 'hover:bg-muted-200')
                  }
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={
                      'step-bullet text-xs ' +
                      (done ? 'step-bullet-done' : isActive ? 'step-bullet-active' : 'step-bullet-future')
                    }
                    aria-hidden
                  >
                    {done ? '✓' : idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-ink-900 tracking-tight">{s.title}</div>
                    <div className="h-1.5 bg-muted-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-brand-600"
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <span className="text-xs text-ink-500 w-10 text-right">{pct}%</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

