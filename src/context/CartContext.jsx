import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => safeParse(localStorage.getItem('cart') || '[]', []))

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const value = useMemo(
    () => ({
      items,
      add(item, qty = 1) {
        setItems((prev) => {
          const idx = prev.findIndex((x) => x.id === item.id)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
            return copy
          }
          return [...prev, { ...item, quantity: qty }]
        })
      },
      update(id, quantity) {
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, quantity } : x)).filter((x) => x.quantity > 0))
      },
      remove(id) {
        setItems((prev) => prev.filter((x) => x.id !== id))
      },
      clear() {
        setItems([])
      },
      subtotal() {
        return items.reduce((sum, x) => sum + Number(x.price || 0) * x.quantity, 0)
      },
      count() {
        return items.reduce((sum, x) => sum + x.quantity, 0)
      },
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
