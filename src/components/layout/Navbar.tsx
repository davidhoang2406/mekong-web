import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useTickerStore } from '@/stores/tickerStore'

const WS_DOT: Record<string, string> = {
  connected:    'bg-up',
  reconnecting: 'bg-yellow-400 live-dot',
  connecting:   'bg-yellow-400 live-dot',
  disconnected: 'bg-fg-muted',
}
const WS_LABEL: Record<string, string> = {
  connected:    'Live',
  reconnecting: 'Reconnecting',
  connecting:   'Connecting',
  disconnected: 'Offline',
}

export function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()
  const connectionState = useTickerStore(s => s.connectionState)

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
        {/* WS connection status */}
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-fg-muted px-2">
          <span className={`h-1.5 w-1.5 rounded-full ${WS_DOT[connectionState] ?? 'bg-fg-muted'}`} />
          {WS_LABEL[connectionState] ?? 'Offline'}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="h-9 w-9 grid place-items-center rounded-md hover:bg-bg-muted"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          )}
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
