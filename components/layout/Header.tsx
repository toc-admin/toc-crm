'use client'

import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export default function Header({ title, description, action }: HeaderProps) {
  return (
    <>
      <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-slate-600">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button - Bottom Right */}
      {action && (
        <div className="fixed bottom-8 right-8 z-20">
          {action}
        </div>
      )}
    </>
  )
}
