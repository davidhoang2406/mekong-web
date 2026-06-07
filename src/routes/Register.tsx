import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '@/api/client'
import { useAuthStore } from '@/stores/authStore'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await apiPost('/auth/register', { name, email, password })
      const res = await apiPost<{ token: string; user: { id: string; email: string; name: string } }>(
        '/auth/login', { email, password }
      )
      setAuth(res.token, res.user)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg transition-colors"

  return (
    <div className="min-h-screen bg-bg-muted py-12 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-[28px] font-bold tracking-tight text-fg">Mekong</Link>
          <p className="text-[13px] text-fg-muted mt-1">Free during beta · no credit card required</p>
        </div>

        <div className="bg-bg border border-border rounded-xl p-8 card">
          <h1 className="text-[20px] font-semibold tracking-tight">Create your account</h1>
          <p className="text-[13px] text-fg-muted mt-1">Start tracking VN stocks &amp; crypto in 30 seconds</p>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 text-[13px]">{error}</div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Full name</span>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Nguyen Van A" autoComplete="name" required className={inputCls} />
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required className={inputCls} />
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Password</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="new-password" required className={inputCls} />
              <p className="mt-1.5 text-[11px] text-fg-muted">Minimum 8 characters</p>
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Confirm password</span>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••" autoComplete="new-password" required className={inputCls} />
            </label>

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-md bg-fg text-bg text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-fg-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-fg font-medium hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
