import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On refresh: if token exists, keep user from localStorage if present.
    const cached = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (token && cached) {
      try {
        setUser(JSON.parse(cached))
      } catch {
        // ignore
      }
    }
    setLoading(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { data } = await api.post('/api/users/login', { email, password })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        const { data } = await api.post('/api/users/register', payload)
        return data
      },
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
