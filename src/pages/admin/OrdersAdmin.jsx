import React, { useEffect, useState } from 'react'
import api from '../../api/client.js'

export default function AdminOrders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/orders')
      setItems(Array.isArray(data) ? data : (data.orders || []))
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          'Failed to load orders. Make sure your backend exposes GET /api/orders for admin users.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white shadow-soft p-5">
        <div className="text-sm font-medium text-brand-orange">Sales</div>
        <h2 className="mt-1 text-xl font-semibold">Orders</h2>
        <p className="mt-2 text-sm text-slate-600">View and track orders.</p>
      </div>

      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Order</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Total</th>
                <th className="text-left px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6">Loading…</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6">No orders.</td>
                </tr>
              ) : (
                items.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3 text-slate-600">{o.email || o.User?.email || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange">
                        {o.status || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{o.total_amount || o.total || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
