import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [ok, setOk] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', password: '' })

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOk(false)
    try {
      await register(form)
      setOk(true)
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
        <div className="text-sm font-medium text-brand-orange">Get started</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-slate-600">Sign up to save your details and checkout faster.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="text-sm text-slate-600">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          <button
            disabled={loading}
            className="rounded-2xl bg-brand-orange text-white px-6 py-3 font-medium hover:bg-brand-orangeDark transition shadow-soft disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-orange font-medium hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
