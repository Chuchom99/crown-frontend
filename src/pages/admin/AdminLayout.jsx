import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import AdminDashboard from './Dashboard.jsx'
import AdminProducts from './ProductsAdmin.jsx'
import AdminCategories from './CategoriesAdmin.jsx'
import AdminOrders from './OrdersAdmin.jsx'
import AdminUsers from './UsersAdmin.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-brand-orange text-white shadow-soft' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="rounded-2xl bg-white shadow-soft p-4 sticky top-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Admin Panel</div>
                  <div className="text-sm font-semibold">{user?.name || user?.email}</div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-brand-orange/10 text-brand-orange grid place-items-center font-bold">A</div>
              </div>

              <nav className="mt-4 space-y-1">
                <Item to="/admin">Dashboard</Item>
                <Item to="/admin/products">Products</Item>
                <Item to="/admin/categories">Categories</Item>
                <Item to="/admin/orders">Orders</Item>
                <Item to="/admin/users">Users</Item>
              </nav>

              <button
                onClick={logout}
                className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main */}
          <section className="flex-1">
            {/* Mobile header */}
            <div className="md:hidden rounded-2xl bg-white shadow-soft p-4 mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Admin Panel</div>
                <div className="text-sm font-semibold">{user?.name || user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="rounded-xl bg-brand-orange px-3 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </div>

            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/categories" element={<AdminCategories />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="*" element={<div className="p-6">Not found</div>} />
            </Routes>
          </section>
        </div>
      </div>
    </div>
  )
}
