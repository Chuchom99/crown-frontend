import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client.js'

function Card({ title, value, subtitle, to }) {
  const inner = (
    <div className="rounded-2xl bg-white shadow-soft p-5">
      <div className="text-sm font-medium text-slate-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {subtitle ? <div className="mt-2 text-xs text-slate-500">{subtitle}</div> : null}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: '—', categories: '—', users: '—', orders: '—' })
  const [note, setNote] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [pRes, cRes, uRes, oRes] = await Promise.allSettled([
          api.get('/api/products/get-product', { params: { page: 1, limit: 1 } }),
          api.get('/api/categories'),
          api.get('/api/users'),
          api.get('/api/orders'),
        ])

        const next = { ...stats }

        if (pRes.status === 'fulfilled') {
          next.products = pRes.value.data?.pagination?.totalItems ?? pRes.value.data?.products?.length ?? '—'
        }
        if (cRes.status === 'fulfilled') {
          next.categories = Array.isArray(cRes.value.data) ? cRes.value.data.length : '—'
        }
        if (uRes.status === 'fulfilled') {
          next.users = Array.isArray(uRes.value.data) ? uRes.value.data.length : '—'
        }
        if (oRes.status === 'fulfilled') {
          next.orders = Array.isArray(oRes.value.data) ? oRes.value.data.length : '—'
        } else {
          // The backend zip you shared has a mismatch: orderRoutes expects getAllOrders but controller exports are different.
          setNote('If Orders shows “—”, make sure your backend exposes GET /api/orders for admin users.')
        }

        if (!cancelled) setStats(next)
      } catch {
        // ignore
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white shadow-soft p-6">
        <div className="text-sm font-medium text-brand-orange">Overview</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage products, categories, users and orders in one place.</p>
        {note ? <p className="mt-3 text-xs text-slate-500">{note}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Products" value={stats.products} subtitle="Create, edit, delete" to="/admin/products" />
        <Card title="Categories" value={stats.categories} subtitle="Organize your catalog" to="/admin/categories" />
        <Card title="Orders" value={stats.orders} subtitle="View order history" to="/admin/orders" />
        <Card title="Users" value={stats.users} subtitle="Manage accounts" to="/admin/users" />
      </div>

      <div className="rounded-2xl bg-white shadow-soft p-6">
        <div className="text-sm font-medium">Quick actions</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white" to="/admin/products">
            Add / Edit Products
          </Link>
          <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/admin/categories">
            Manage Categories
          </Link>
          <Link className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/admin/orders">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
