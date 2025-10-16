import React from 'react'
import HeaderBar from './HeaderBar'

type AppShellProps = {
  sidebar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AppShell({ sidebar, children, footer }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-50 text-ink-700">
      <HeaderBar />
      <div className="container-max w-full flex-1 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {sidebar ? (
            <aside className="lg:col-span-4 xl:col-span-3">
              {sidebar}
            </aside>
          ) : null}
          <main className={sidebar ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}>
            {children}
          </main>
        </div>
      </div>
      <footer className="border-t border-muted-200 bg-white">
        <div className="container-max py-4 text-sm text-ink-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Netz Asset — Offshore</span>
          {footer}
        </div>
      </footer>
    </div>
  )
}
