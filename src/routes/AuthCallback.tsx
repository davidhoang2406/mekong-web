import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// Handles the redirect from /api/v1/auth/google/callback and /api/v1/auth/facebook/callback.
// The API redirects here with ?token=<jwt> after successful OAuth.
export function AuthCallback() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) { navigate('/login'); return }

    // Decode the JWT payload to get user info (no signature verification needed client-side)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setAuth(token, { id: payload.sub, email: payload.email, name: payload.email.split('@')[0] })
      navigate('/')
    } catch {
      navigate('/login')
    }
  }, [navigate, setAuth])

  return (
    <div className="min-h-screen bg-bg-muted grid place-items-center">
      <p className="text-[13px] text-fg-muted">Signing you in…</p>
    </div>
  )
}
