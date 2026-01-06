import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { formatMoney } from '../utils/format.js'

export default function Cart() {
  const { items, update, remove, subtotal, clear } = useCart()
  const navigate = useNavigate()

  const total = subtotal()

  if (items.length === 0) {
    return (
      <div className="container py-10">
        <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-soft text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-orange/10 text-brand-orange grid place-items-center">
            <ShoppingBag size={20} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-slate-600">Add products to your cart and come back here to checkout.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft"
          >
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="text-sm font-medium text-brand-orange">Cart</div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Review your items</h1>
          <p className="mt-2 text-slate-600">Adjust quantities and proceed to checkout.</p>
        </div>
        <button
          onClick={clear}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-100 bg-white shadow-soft overflow-hidden">
          <div className="divide-y divide-slate-100">
            {items.map((it) => (
              <div key={it.id} className="p-4 sm:p-5 flex gap-4">
                <div className="h-20 w-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      {it.category ? <div className="text-sm text-slate-500">{it.category}</div> : null}
                    </div>
                    <div className="font-semibold">{formatMoney(it.price)}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
                      <button
                        onClick={() => update(it.id, it.quantity - 1)}
                        className="h-9 w-9 rounded-lg hover:bg-slate-50 grid place-items-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="min-w-10 text-center text-sm font-medium">{it.quantity}</div>
                      <button
                        onClick={() => update(it.id, it.quantity + 1)}
                        className="h-9 w-9 rounded-lg hover:bg-slate-50 grid place-items-center"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => remove(it.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft h-fit">
          <div className="font-semibold">Order summary</div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">{formatMoney(total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Delivery</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatMoney(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-5 w-full rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft"
          >
            Checkout
          </button>

          <Link
            to="/products"
            className="mt-3 block text-center rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium hover:bg-slate-50 transition"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
