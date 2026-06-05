import { Link } from 'react-router-dom'

export function Login() {
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

          <form className="mt-6 space-y-4" onSubmit={e => e.preventDefault()}>
            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Email</span>
              <input type="email" placeholder="you@example.com" autoComplete="email"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium">Password</span>
                <a href="#" className="text-[12px] text-fg-muted hover:text-fg">Forgot?</a>
              </div>
              <input type="password" placeholder="••••••••••" autoComplete="current-password"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
            </label>

            <label className="flex items-center gap-2 text-[12px] text-fg-muted">
              <input type="checkbox" className="h-4 w-4 rounded border-border" />
              Keep me signed in on this device
            </label>

            <button type="submit"
              className="w-full h-11 rounded-md bg-fg text-bg text-[14px] font-semibold hover:opacity-90 transition-opacity">
              Sign in
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
