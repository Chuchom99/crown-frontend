import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-14">
      <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-soft text-center">
        <div className="text-sm font-medium text-brand-orange">404</div>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested doesn’t exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft">
          Go home
        </Link>
      </div>
    </div>
  )
}
