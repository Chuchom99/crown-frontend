import React, { useEffect, useMemo, useState } from 'react'
import api from '../../api/client.js'

function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-4 sm:p-8">
          <div className="rounded-2xl bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-6">
              <div className="text-lg font-semibold">{title}</div>
              <button
                onClick={onClose}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 ' +
        (props.className || '')
      }
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 ' +
        (props.className || '')
      }
    />
  )
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={
        'rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orangeDark disabled:opacity-60 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  )
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={
        'rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  )
}

const emptyForm = {
  name: '',
  price: '',
  categoryId: '',
  description: '',
  stock: '',
  gram: '',
  inches: '',
  color: '',
}

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState('create') // create | edit
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [existingImages, setExistingImages] = useState([])
  const [deleteImages, setDeleteImages] = useState(new Set())
  const [newImages, setNewImages] = useState([])

  const categoryMap = useMemo(() => {
    const m = new Map()
    categories.forEach((c) => m.set(c.id, c))
    return m
  }, [categories])

  async function load(page = 1) {
    setLoading(true)
    setError('')
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/api/products/get-product', { params: { page, limit: 10, ...(q ? { search: q } : {}) } }),
        api.get('/api/categories'),
      ])
      setItems(pRes.data.products || [])
      setPagination(pRes.data.pagination || { currentPage: 1, totalPages: 1, totalItems: (pRes.data.products || []).length })
      setCategories(Array.isArray(cRes.data) ? cRes.data : [])
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openCreate() {
    setMode('create')
    setEditId(null)
    setForm({ ...emptyForm, categoryId: categories?.[0]?.id || '' })
    setExistingImages([])
    setDeleteImages(new Set())
    setNewImages([])
    setModalOpen(true)
  }

  function openEdit(p) {
    setMode('edit')
    setEditId(p.id)
    setForm({
      name: p.name || '',
      price: String(p.price ?? ''),
      categoryId: p.categoryId || '',
      description: p.description || '',
      stock: String(p.stock ?? ''),
      gram: String(p.gram ?? ''),
      inches: String(p.inches ?? ''),
      color: String(p.color ?? ''),
    })
    setExistingImages(p.ProductImages || p.ProductImage || p.productImages || p.Productimages || [])
    setDeleteImages(new Set())
    setNewImages([])
    setModalOpen(true)
  }

  async function onDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/api/products/delete-product/${id}`)
      await load(pagination.currentPage)
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to delete product')
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v === '' || v == null) return
        fd.append(k, v)
      })
      newImages.forEach((file) => fd.append('images', file))
      if (mode === 'edit' && deleteImages.size) {
        fd.append('deleteImages', JSON.stringify(Array.from(deleteImages)))
      }

      if (mode === 'create') {
        await api.post('/api/products/create-product', fd)
      } else {
        await api.put(`/api/products/update-product/${editId}`, fd)
      }
      setModalOpen(false)
      await load(pagination.currentPage)
    } catch (e2) {
      alert(e2?.response?.data?.error || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white shadow-soft p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-brand-orange">Catalog</div>
          <h2 className="mt-1 text-xl font-semibold">Products</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name…" />
          </div>
          <SecondaryButton onClick={() => load(1)} disabled={loading}>
            Search
          </SecondaryButton>
          <PrimaryButton onClick={openCreate}>New Product</PrimaryButton>
        </div>
      </div>

      {error ? <div className="rounded-2xl bg-white shadow-soft p-4 text-sm text-red-600">{error}</div> : null}

      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Stock</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={5}>
                    No products.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[32ch]">{p.description || '—'}</div>
                    </td>
                    <td className="px-4 py-3">{p.Category?.name || categoryMap.get(p.categoryId)?.name || '—'}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3">{p.stock ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <SecondaryButton onClick={() => openEdit(p)}>Edit</SecondaryButton>
                        <button
                          onClick={() => onDelete(p.id)}
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
          <div className="text-slate-600">
            Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total
          </div>
          <div className="flex gap-2">
            <SecondaryButton
              onClick={() => load(Math.max(1, pagination.currentPage - 1))}
              disabled={loading || pagination.currentPage <= 1}
            >
              Prev
            </SecondaryButton>
            <SecondaryButton
              onClick={() => load(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={loading || pagination.currentPage >= pagination.totalPages}
            >
              Next
            </SecondaryButton>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={mode === 'create' ? 'Create Product' : 'Edit Product'}
        onClose={() => (!saving ? setModalOpen(false) : null)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            </Field>
            <Field label="Price">
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                required
              />
            </Field>
            <Field label="Category">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30"
                value={form.categoryId}
                onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock">
              <TextInput type="number" min="0" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} />
            </Field>
            <Field label="Gram">
              <TextInput type="number" step="0.01" min="0" value={form.gram} onChange={(e) => setForm((s) => ({ ...s, gram: e.target.value }))} />
            </Field>
            <Field label="Inches">
              <TextInput type="number" step="0.01" min="0" value={form.inches} onChange={(e) => setForm((s) => ({ ...s, inches: e.target.value }))} />
            </Field>
            <Field label="Color">
              <TextInput value={form.color} onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))} />
            </Field>
          </div>

          <Field label="Description">
            <TextArea rows={4} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
          </Field>

          {mode === 'edit' && existingImages?.length ? (
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs font-medium text-slate-600">Existing images (tick to delete)</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {existingImages.map((img) => {
                  const id = img.id || img.imageId
                  const url = img.imageUrl || img.url
                  const checked = deleteImages.has(id)
                  return (
                    <label key={id || url} className="group relative block overflow-hidden rounded-xl border border-slate-200">
                      {url ? <img src={(import.meta.env.VITE_API_URL || 'http://localhost:3000') + url} className="h-24 w-full object-cover" /> : null}
                      <div className="flex items-center gap-2 p-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setDeleteImages((prev) => {
                              const next = new Set(prev)
                              if (e.target.checked) next.add(id)
                              else next.delete(id)
                              return next
                            })
                          }}
                        />
                        <span className="text-xs text-slate-600">Delete</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : null}

          <Field label="Add images (max 5)">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(Array.from(e.target.files || []).slice(0, 5))}
            />
            {newImages.length ? <div className="mt-2 text-xs text-slate-500">Selected: {newImages.map((f) => f.name).join(', ')}</div> : null}
          </Field>

          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : mode === 'create' ? 'Create' : 'Save Changes'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
