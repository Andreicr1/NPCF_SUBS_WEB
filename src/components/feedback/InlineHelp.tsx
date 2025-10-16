import React from 'react'

export default function InlineHelp({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-ink-500">{children}</span>
}

