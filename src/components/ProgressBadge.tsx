import React from 'react'

type Props = { children: React.ReactNode }

export default function ProgressBadge({ children }: Props) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted-200 px-2.5 py-1 text-xs font-medium text-ink-700">
      {children}
    </span>
  )
}

