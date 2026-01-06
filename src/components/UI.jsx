import React from 'react'

export function Pill({ children }) {
  return <span className="inline-flex items-center rounded-full bg-brand-orange/10 text-brand-orange px-3 py-1 text-xs font-medium">{children}</span>
}

export function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <div className="text-sm font-medium text-brand-orange">{eyebrow}</div> : null}
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-3 text-slate-600">{subtitle}</p> : null}
    </div>
  )
}
