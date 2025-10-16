import React from 'react'

type FeatureCardProps = {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="card p-8 h-full">
      <div className="flex items-start gap-4">
        {icon ? <div className="text-brand-600">{icon}</div> : null}
        <div>
          <h3 className="text-lg font-semibold text-ink-900 tracking-tight">{title}</h3>
          <p className="mt-2 text-ink-500 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

