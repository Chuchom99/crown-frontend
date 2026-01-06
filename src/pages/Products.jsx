import React from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/client.js'
import ProductCard from '../components/ProductCard.jsx'
import { SectionTitle } from '../components/UI.jsx'

export default function Products() {
  const [sp, setSp] = useSearchParams()
  const [categories, setCategories] = React.useState([])
  const [data, setData] = React.useState({ products: [], pagination: { currentPage: 1, totalPages: 1 } })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

  const q = sp.get('q') || ''
  const categoryId = sp.get('categoryId') || ''
  const page = Number(sp.get('page') || '1')
  const limit = Number(sp.get('limit') || '12')

  React.useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [cats, prods] = await Promise.all([
          api.get('/api/categories').catch(() => ({ data: [] })),
          api.get('/api/products/get-product', {
            params: {
              ...(q ? { search: q } : {}),
              ...(categoryId ? { categoryId } : {}),
              page,
              limit,
            },
          }),
        ])

        if (!alive) return
        setCategories(Array.isArray(cats.data) ? cats.data : [])
        setData(prods.data)
      } catch (err) {
        if (!alive) return
        setError(err?.response?.data?.error || err.message || 'Failed to load products')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [q, categoryId, page, limit])

  function setParam(key, value) {
    const next = new URLSearchParams(sp)
    if (!value) next.delete(key)
    else next.set(key, String(value))
    // reset pagination on filter/search changes
    if (key !== 'page') next.set('page', '1')
    setSp(next)
  }

  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 }
  const products = data?.products || []

  return (
    <div className="container py-10">
      <SectionTitle
        eyebrow="Catalogue"
        title="Products"
        subtitle="Search and filter products. Clean UI optimized for conversion."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft h-fit">
          <div className="font-semibold">Filters</div>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm text-slate-600">Search</label>
              <input
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Search products..."
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setParam('categoryId', e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-600">Items per page</label>
              <select
                value={limit}
                onChange={(e) => setParam('limit', e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              >
                {[8, 12, 16, 24].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSp(new URLSearchParams())}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
            >
              Reset
            </button>
          </div>
        </aside>

        <section>
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                  <div className="aspect-[4/3] bg-slate-100 rounded-xl animate-pulse" />
                  <div className="mt-4 h-4 bg-slate-100 rounded animate-pulse" />
                  <div className="mt-2 h-4 bg-slate-100 rounded animate-pulse w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="font-semibold">Could not load products</div>
              <div className="mt-2 text-slate-600 text-sm">{error}</div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
              <div className="font-semibold">No products found</div>
              <div className="mt-2 text-slate-600 text-sm">Try removing filters or searching something else.</div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} apiBase={apiBase} />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  disabled={pagination.currentPage <= 1}
                  onClick={() => setParam('page', pagination.currentPage - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="text-sm text-slate-600">
                  Page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </div>
                <button
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => setParam('page', pagination.currentPage + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
