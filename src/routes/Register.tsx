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

        <div className="bg-bg border border-border rounded-xl px-8 py-5 card mt-3 space-y-3">
          <p className="text-[12px] text-fg-muted text-center">Or sign up with</p>
          <div className="flex gap-3">
            <a href="/api/v1/auth/google"
              className="flex-1 h-10 flex items-center justify-center gap-2 rounded-md border border-border text-[13px] hover:bg-bg-muted transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </a>
            <a href="/api/v1/auth/facebook"
              className="flex-1 h-10 flex items-center justify-center gap-2 rounded-md border border-border text-[13px] hover:bg-bg-muted transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
          </div>
        </div>

        <p className="text-center text-[13px] text-fg-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-fg font-medium hover:underline">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
