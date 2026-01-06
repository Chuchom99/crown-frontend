import React from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client.js'
import { formatMoney } from '../utils/format.js'
import { useCart } from '../context/CartContext.jsx'
import { ChevronLeft } from 'lucide-react'

function imgUrl(img, apiBase) {
  if (!img) return null
  return img.startsWith('http') ? img : `${apiBase}${img}`
}

export default function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const [product, setProduct] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [active, setActive] = React.useState(0)
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

  React.useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const { data } = await api.get(`/api/products/get-product/${id}`)
        if (!alive) return
        setProduct(data)
        setActive(0)
      } catch (err) {
        if (!alive) return
        setError(err?.response?.data?.error || err.message || 'Failed to load product')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
          <div className="mt-4 grid lg:grid-cols-2 gap-6">
            <div className="aspect-[4/3] bg-slate-100 rounded-2xl animate-pulse" />
            <div>
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="mt-2 h-8 w-64 bg-slate-100 rounded animate-pulse" />
              <div className="mt-4 h-24 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="font-semibold">Could not load product</div>
          <div className="mt-2 text-slate-600 text-sm">{error || 'Product not found'}</div>
          <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-brand-orange font-medium hover:underline">
            <ChevronLeft size={16} /> Back to products
          </Link>
        </div>
      </div>
    )
  }

  const images = (product.ProductImages || []).map((x) => x.imageUrl)
  const activeImg = imgUrl(images[active], apiBase)

  return (
    <div className="container py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-brand-orange font-medium hover:underline">
        <ChevronLeft size={16} /> Back to products
      </Link>

      <div className="mt-4 rounded-3xl border border-slate-100 bg-white shadow-soft overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="bg-slate-50 p-4 sm:p-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-100">
              {activeImg ? (
                <img src={activeImg} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-slate-400">No image</div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-auto pb-2">
                {images.map((u, i) => (
                  <button
                    key={u}
                    onClick={() => setActive(i)}
                    className={`h-16 w-20 rounded-xl overflow-hidden border ${
                      i === active ? 'border-brand-orange' : 'border-slate-200'
                    } bg-white`}
                  >
                    <img src={imgUrl(u, apiBase)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-sm text-slate-500">{product?.Category?.name || 'Solar product'}</div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">{product.name}</h1>
            <div className="mt-3 text-xl font-semibold">{formatMoney(product.price)}</div>

            <div className="mt-4 text-slate-600 leading-relaxed">
              {product.description || 'No description yet. Add a description from your admin panel.'}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm">
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Stock</div>
                <div className="mt-1 font-semibold">{product.stock ?? 0}</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">Color</div>
                <div className="mt-1 font-semibold">{product.color || '—'}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                disabled={(product.stock ?? 0) <= 0}
                onClick={() =>
                  add({ id: product.id, name: product.name, price: product.price, imageUrl: activeImg, category: product?.Category?.name }, 1)
                }
                className="flex-1 rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to cart
              </button>
              <Link
                to="/cart"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50 transition text-center"
              >
                View cart
              </Link>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Tip: Use the <code>/api/products/update-product/:id</code> endpoint to update images and details.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
