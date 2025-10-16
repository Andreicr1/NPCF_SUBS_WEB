import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Radio({ className = '', ...props }: Props) {
  return (
    <input
      type="radio"
      {...props}
      className={`h-4 w-4 border-muted-200 text-brand-600 focus:ring-brand-400 ${className}`}
    />
  )
}

