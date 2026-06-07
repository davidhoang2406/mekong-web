import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

// Handles redirect from /api/v1/auth/{google|github}/callback.
// The API redirects here with ?token=<jwt> after successful OAuth.
export function AuthCallback() {
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) { window.location.replace('/login'); return }

    try {
      // JWT uses base64url — replace chars before atob + add padding
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4)
      const payload = JSON.parse(atob(padded))
      const name = payload.name || payload.email?.split('@')[0] || 'User'
      setAuth(token, { id: payload.sub, email: payload.email, name })
      window.location.replace('/')
    } catch {
      window.location.replace('/login')
    }
  }, [setAuth])

  return (
    <div className="min-h-screen bg-bg-muted grid place-items-center">
      <p className="text-[13px] text-fg-muted">Signing you in…</p>
    </div>
  )
}
