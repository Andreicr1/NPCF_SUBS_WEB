import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export default function Input({ className = '', invalid, ...props }: Props) {
  return (
    <input
      {...props}
      className={
        `w-full rounded-lg border bg-white px-3 py-2 text-ink-900 placeholder-ink-500/60 ` +
        `focus-ring ` +
        (invalid ? 'border-red-500' : 'border-muted-200 hover:border-muted-400') +
        (className ? ` ${className}` : '')
      }
    />
  )
}

