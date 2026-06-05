import { Link } from 'react-router-dom'

export function Register() {
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

          <form className="mt-6 space-y-4" onSubmit={e => e.preventDefault()}>
            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Full name</span>
              <input type="text" placeholder="Nguyen Van A" autoComplete="name"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Email</span>
              <input type="email" placeholder="you@example.com" autoComplete="email"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Password</span>
              <input type="password" placeholder="••••••••••••" autoComplete="new-password"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
              <p className="mt-1.5 text-[11px] text-fg-muted">Min 12 chars · 1 number · 1 symbol</p>
            </label>

            <label className="block">
              <span className="block text-[12px] font-medium mb-1.5">Confirm password</span>
              <input type="password" placeholder="••••••••••••" autoComplete="new-password"
                className="w-full h-11 px-3 rounded-md border border-border text-[14px] bg-bg outline-none focus:border-fg focus:ring-1 focus:ring-fg" />
            </label>

            <label className="flex items-start gap-2 text-[12px] text-fg-muted leading-relaxed">
              <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border" />
              I agree to the <a href="#" className="text-fg underline">Terms of Service</a> and{' '}
              <a href="#" className="text-fg underline">Privacy Policy</a>.
            </label>

            <button type="submit"
              className="w-full h-11 rounded-md bg-fg text-bg text-[14px] font-semibold hover:opacity-90 transition-opacity">
              Create account
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
