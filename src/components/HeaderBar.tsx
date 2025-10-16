import React from 'react'
import { Link } from 'react-router-dom'

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-muted-200">
      <div className="container-max h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 focus-ring">
          <span className="text-lg font-semibold tracking-tight text-ink-900">Netz Asset</span>
          <span className="text-[11px] uppercase tracking-widest text-brand-600">Offshore</span>
        </Link>
        <div className="text-sm text-ink-500">Minha Conta</div>
      </div>
    </header>
  )
}
