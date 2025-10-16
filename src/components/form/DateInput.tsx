import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export default function DateInput({ className = '', invalid, ...props }: Props) {
  return (
    <div className="relative">
      <input
        type="date"
        {...props}
        className={
          `w-full rounded-lg border bg-white px-3 py-2 text-ink-900 placeholder-ink-500/60 ` +
          `focus-ring ` +
          (invalid ? 'border-red-500' : 'border-muted-200 hover:border-muted-400') +
          (className ? ` ${className}` : '')
        }
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden>
        📅
      </span>
    </div>
  )
}

