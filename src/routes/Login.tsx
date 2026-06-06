import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '@/api/client'
import { useAuthStore } from '@/stores/authStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiPost<{ token: string; user: { id: string; email: string; name: string } }>(
        '/auth/login', { email, password }
      )
      setAuth(res.token, res.user)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-[28px] font-bold tracking-tight text-fg">Mekong</Link>
          <p className="text-[13px] text-fg-muted mt-1">Vietnam market data · real-time + historical</p>
        </div>

        <div className="bg-bg border border-border rounded-xl p-8 card">
          <h1 className="text-[20px] font-semibold tracking-tight">Sign in to your account</h1>
          <p className="text-[13px] text-fg-muted mt-1">Enter your credentials below</p>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 text-[13px]">{error}</div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg transition-colors" />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium">Password</span>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••" autoComplete="current-password" required
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg transition-colors" />
            </label>

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-md bg-fg text-bg text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-fg-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-fg font-medium hover:underline">Create one →</Link>
        </p>
      </div>
    </div>
  )
}
