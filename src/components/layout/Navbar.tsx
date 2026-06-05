import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const s = query.trim().toUpperCase()
    if (s) { navigate(`/symbol/${s}`); setQuery('') }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-[60px] bg-bg border-b border-border flex items-center px-5">
      <Link to="/" className="text-[20px] font-semibold tracking-tight text-fg">Mekong</Link>

      <form onSubmit={handleSearch} className="ml-12 flex items-center w-[480px] h-9 bg-bg-muted rounded-md border border-border px-3 text-fg-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="bg-transparent flex-1 outline-none text-[14px] placeholder-fg-muted text-fg"
          placeholder="Search symbols — VCB, BTC-USDT, FPT..."
        />
        <kbd className="ml-2 text-[11px] font-mono px-1.5 py-0.5 rounded border border-border text-fg-muted">⌘K</kbd>
      </form>

      <div className="ml-auto flex items-center gap-2 text-fg-muted">
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-md hover:bg-bg-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
        </button>
        <button className="h-9 px-2 flex items-center gap-2 rounded-md hover:bg-bg-muted">
          <span className="h-7 w-7 rounded-full bg-fg text-bg grid place-items-center text-[11px] font-semibold">D</span>
          <span className="text-[13px] text-fg">david</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </header>
  )
}
