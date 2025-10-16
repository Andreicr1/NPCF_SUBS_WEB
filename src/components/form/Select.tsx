import React from 'react'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }

export default function Select({ className = '', invalid, children, ...props }: Props) {
  return (
    <select
      {...props}
      className={
        `w-full rounded-lg border bg-white px-3 py-2 text-ink-900 ` +
        `focus-ring ` +
        (invalid ? 'border-red-500' : 'border-muted-200 hover:border-muted-400') +
        (className ? ` ${className}` : '')
      }
    >
      {children}
    </select>
  )
}

