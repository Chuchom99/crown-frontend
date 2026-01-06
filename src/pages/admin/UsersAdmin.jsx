import React, { useEffect, useState } from 'react'
import api from '../../api/client.js'

function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
          <div className="rounded-2xl bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-6">
              <div className="text-lg font-semibold">{title}</div>
              <button onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState({ email: '', name: '', password: '' })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/users')
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openEdit(u) {
    setEdit(u)
    setForm({ email: u.email || '', name: u.name || '', password: '' })
    setOpen(true)
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {}
      if (form.email && form.email !== edit.email) payload.email = form.email
      if (form.name && form.name !== edit.name) payload.name = form.name
      if (form.password) payload.password = form.password

      await api.put(`/api/users/${edit.id}`, payload)
      setOpen(false)
      await load()
    } catch (e2) {
      alert(e2?.response?.data?.error || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/api/users/${id}`)
      await load()
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to delete user')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white shadow-soft p-5">
        <div className="text-sm font-medium text-brand-orange">Access</div>
        <h2 className="mt-1 text-xl font-semibold">Users</h2>
        <p className="mt-2 text-sm text-slate-600">View and manage registered users (admin-only).</p>
      </div>

      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
        {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6">Loading…</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6">No users.</td>
                </tr>
              ) : (
                items.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">{u.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{u.role || 'user'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(u.id)}
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title="Edit User" onClose={() => (!saving ? setOpen(false) : null)}>
        <form onSubmit={save} className="space-y-3">
          <label className="block">
            <div className="text-xs font-medium text-slate-600">Name</div>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
          </label>
          <label className="block">
            <div className="text-xs font-medium text-slate-600">Email</div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
            />
          </label>
          <label className="block">
            <div className="text-xs font-medium text-slate-600">New password</div>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
              placeholder="leave empty to keep current"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orangeDark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
