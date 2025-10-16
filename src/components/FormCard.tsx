import React from 'react'

type FormCardProps = {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function FormCard({ title, description, children, footer }: FormCardProps) {
  return (
    <section className="card p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-ink-500">{description}</p>
        ) : null}
      </div>
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-8 pt-6 border-t border-muted-200">{footer}</div> : null}
    </section>
  )
}

