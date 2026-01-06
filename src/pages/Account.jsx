import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { user } = useAuth()

  return (
    <div className="container py-10">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="text-sm font-medium text-brand-orange">Account</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Hello, {user?.name || 'Customer'} 👋</h1>
        <p className="mt-2 text-slate-600">
          Your backend has admin-only endpoints for orders and management. If you want an admin dashboard on the frontend,
          tell me what screens you want and I’ll add it.
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="text-xs text-slate-500">Email</div>
            <div className="mt-1 font-medium">{user?.email}</div>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <div className="text-xs text-slate-500">Role</div>
            <div className="mt-1 font-medium">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
