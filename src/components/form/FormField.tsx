import React from 'react'

type Props = {
  label: string
  htmlFor: string
  required?: boolean
  help?: string
  error?: string
  children: React.ReactNode
}

export default function FormField({ label, htmlFor, required, help, error, children }: Props) {
  const describedBy: string[] = []
  if (help) describedBy.push(`${htmlFor}-help`)
  if (error) describedBy.push(`${htmlFor}-error`)

  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-900">
        {label} {required ? <span className="text-brand-600">*</span> : null}
      </label>
      <div className="mt-1">{children}</div>
      {help ? (
        <p id={`${htmlFor}-help`} className="mt-1 text-xs text-ink-500">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

