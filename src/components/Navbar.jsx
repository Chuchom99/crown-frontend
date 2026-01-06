import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Menu, X, Sun } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../assets/Logot (1).png";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive
      ? "text-brand-orange"
      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
  }`;

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  React.useEffect(() => {
    setQ(sp.get("q") || "");
  }, [sp]);

  const cartCount = useMemo(() => count(), [count]);

  function onSearch(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange text-white shadow-soft">
              <Sun size={18} />
            </span>
            <span className="tracking-tight">
              Crown<span className="text-brand-orange">Solar</span>
            </span>
          </Link> */}

          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Crown Solar Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            {user ? (
              <NavLink to="/account" className={navLinkClass}>
                Account
              </NavLink>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={onSearch} className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-72 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Search panels, inverters, batteries..."
                aria-label="Search"
              />
            </form>

            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-brand-orange text-white text-xs grid place-items-center">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {user ? (
              <button
                onClick={() => logout()}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/register"
                className="rounded-xl bg-brand-orange text-white px-4 py-2 text-sm font-medium hover:bg-brand-orangeDark transition shadow-soft"
              >
                Create account
              </Link>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open ? (
          <div className="md:hidden pb-4">
            <form onSubmit={onSearch} className="mt-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                placeholder="Search products..."
              />
            </form>
            <div className="mt-3 grid gap-1">
              <NavLink
                onClick={() => setOpen(false)}
                to="/"
                className={navLinkClass}
                end
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/products"
                className={navLinkClass}
              >
                Products
              </NavLink>
              <NavLink
                onClick={() => setOpen(false)}
                to="/cart"
                className={navLinkClass}
              >
                Cart ({cartCount})
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/account"
                    className={navLinkClass}
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="mt-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/login"
                    className={navLinkClass}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    onClick={() => setOpen(false)}
                    to="/register"
                    className="mt-2 rounded-xl bg-brand-orange text-white px-4 py-2 text-sm font-medium hover:bg-brand-orangeDark transition text-center shadow-soft"
                  >
                    Create account
                  </NavLink>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
