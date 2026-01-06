import React, { useEffect, useState } from 'react'
import api from '../../api/client.js'

function RowBtn({ children, tone = 'gray', ...props }) {
  const base = 'rounded-xl px-4 py-2 text-sm font-semibold transition'
  const tones = {
    orange: 'bg-brand-orange text-white hover:bg-brand-orangeDark',
    gray: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    red: 'border border-red-200 text-red-700 hover:bg-red-50',
  }
  return (
    <button {...props} className={`${base} ${tones[tone]} ${props.className || ''}`}> 
      {children}
    </button>
  )
}

const empty = { name: '', slug: '', description: '' }

export default function AdminCategories() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/categories')
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditing(null)
    setForm(empty)
  }

  function startEdit(c) {
    setEditing(c)
    setForm({ name: c.name || '', slug: c.slug || '', description: c.description || '' })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (!form.slug) {
        // quick auto-slug
        const slug = form.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        form.slug = slug
      }
      if (editing) {
        await api.put(`/api/categories/update-category/${editing.id}`, form)
      } else {
        await api.post('/api/categories/create-category', form)
      }
      startCreate()
      await load()
    } catch (e2) {
      alert(e2?.response?.data?.error || 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/api/categories/${id}`)
      await load()
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to delete category')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white shadow-soft p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-brand-orange">Catalog</div>
          <h2 className="mt-1 text-xl font-semibold">Categories</h2>
        </div>
        <RowBtn tone="gray" onClick={startCreate}>New Category</RowBtn>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-soft p-5">
          <div className="text-sm font-semibold">{editing ? 'Edit Category' : 'Create Category'}</div>
          <form onSubmit={save} className="mt-4 space-y-3">
            <label className="block">
              <div className="text-xs font-medium text-slate-600">Name</div>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
                required
              />
            </label>
            <label className="block">
              <div className="text-xs font-medium text-slate-600">Slug</div>
              <input
                value={form.slug}
                onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
                placeholder="auto-generated if empty"
              />
            </label>
            <label className="block">
              <div className="text-xs font-medium text-slate-600">Description</div>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
              />
            </label>
            <div className="flex justify-end gap-2">
              {editing ? (
                <RowBtn tone="gray" type="button" onClick={startCreate} disabled={saving}>
                  Cancel
                </RowBtn>
              ) : null}
              <RowBtn tone="orange" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save' : 'Create'}
              </RowBtn>
            </div>
            <p className="text-xs text-slate-500">Note: create/update/delete are admin-only endpoints.</p>
          </form>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white shadow-soft overflow-hidden">
          {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold">Products</th>
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
                    <td colSpan={4} className="px-4 py-6">No categories.</td>
                  </tr>
                ) : (
                  items.map((c) => (
                    <tr key={c.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600">{c.slug}</td>
                      <td className="px-4 py-3 text-slate-600">{Array.isArray(c.Products) ? c.Products.length : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <RowBtn tone="gray" onClick={() => startEdit(c)}>Edit</RowBtn>
                          <RowBtn tone="red" onClick={() => remove(c.id)}>Delete</RowBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
