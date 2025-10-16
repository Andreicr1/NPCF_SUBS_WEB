import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Checkbox({ className = '', ...props }: Props) {
  return (
    <input
      type="checkbox"
      {...props}
      className={`h-4 w-4 rounded border-muted-200 text-brand-600 focus:ring-brand-400 ${className}`}
    />
  )
}

