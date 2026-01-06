import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatMoney } from '../utils/format.js'
import { useCart } from '../context/CartContext.jsx'

function firstImage(product, apiBase) {
  const img = product?.ProductImages?.[0]?.imageUrl || product?.images?.[0]?.imageUrl || product?.ProductImage?.[0]?.imageUrl
  if (!img) return null
  // Backend returns /Uploads/xxx
  return img.startsWith('http') ? img : `${apiBase}${img}`
}

export default function ProductCard({ product, apiBase }) {
  const { add } = useCart()
  const img = firstImage(product, apiBase)

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white shadow-soft overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-slate-50 overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-slate-400">
              <div className="text-center">
                <div className="text-sm font-medium">No image</div>
                <div className="text-xs">Upload product images</div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{product?.Category?.name || product?.category?.name || 'Solar product'}</p>
            <h3 className="mt-1 font-semibold leading-tight">{product.name}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{formatMoney(product.price)}</div>
            <div className="text-xs text-slate-500">{(product.stock ?? 0) > 0 ? 'In stock' : 'Out of stock'}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            disabled={(product.stock ?? 0) <= 0}
            onClick={() => add({ id: product.id, name: product.name, price: product.price, imageUrl: img, category: product?.Category?.name }, 1)}
            className="flex-1 rounded-xl bg-brand-orange text-white px-4 py-2 text-sm font-medium hover:bg-brand-orangeDark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
          >
            View <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
