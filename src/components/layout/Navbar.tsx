import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useTickerStore } from '@/stores/tickerStore'
import { useSymbols } from '@/hooks/useSymbols'

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

const ASSET_BADGE: Record<string, string> = {
  crypto: 'text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700',
  stock:  'text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700',
}

export function Navbar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()
  const connectionState = useTickerStore(s => s.connectionState)
  const { data: symbolsData } = useSymbols()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const matches = useMemo(() => {
    const q = query.trim().toUpperCase()
    if (!q || !symbolsData?.symbols) return []
    return symbolsData.symbols
      .filter(s => s.symbol.includes(q) || s.exchange.toUpperCase().includes(q))
      .slice(0, 8)
  }, [query, symbolsData])

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
    setActiveIdx(-1)
  }

  function navigate_to(symbol: string) {
    navigate(`/symbol/${symbol}`)
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || matches.length === 0) {
      if (e.key === 'Enter') {
        const s = query.trim().toUpperCase()
        if (s) navigate_to(s)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0) navigate_to(matches[activeIdx].symbol)
      else if (query.trim()) navigate_to(query.trim().toUpperCase())
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 h-[60px] bg-bg border-b border-border flex items-center px-5">
      <Link to="/" className="text-[20px] font-semibold tracking-tight text-fg">Mekong</Link>

      {/* Search */}
      <div ref={wrapperRef} className="ml-12 relative w-[480px]">
        <div className="flex items-center h-9 bg-bg-muted rounded-md border border-border focus-within:border-border px-3 text-fg-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            value={query}
            onChange={handleInput}
            onFocus={() => query.trim() && setOpen(true)}
            onKeyDown={handleKeyDown}
            className="search-input bg-transparent flex-1 outline-none focus:outline-none focus-visible:outline-none text-[14px] placeholder-fg-muted text-fg"
            placeholder="Search symbols — VCB, BTC-USDT, FPT..."
          />
          {query && (
            <button onClick={() => { setQuery(''); setOpen(false) }} className="ml-1 text-fg-muted hover:text-fg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
          {!query && <kbd className="ml-2 text-[11px] font-mono px-1.5 py-0.5 rounded border border-border text-fg-muted">⌘K</kbd>}
        </div>

        {open && matches.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-bg border border-border rounded-lg shadow-lg overflow-hidden z-50">
            {matches.map((s, i) => (
              <button
                key={s.symbol}
                onMouseDown={() => navigate_to(s.symbol)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors ${
                  i === activeIdx ? 'bg-bg-muted' : 'hover:bg-bg-muted'
                }`}
              >
                <span className="font-semibold font-sans text-fg w-28 truncate">{s.symbol}</span>
                <span className="text-fg-muted text-[12px] flex-1 truncate">{s.exchange}</span>
                <span className={ASSET_BADGE[s.asset_class] ?? 'text-[10px] px-1.5 py-0.5 rounded bg-bg-muted text-fg-muted'}>
                  {s.asset_class}
                </span>
              </button>
            ))}
          </div>
        )}

        {open && query.trim() && matches.length === 0 && (
          <div className="absolute top-full mt-1 w-full bg-bg border border-border rounded-lg shadow-lg px-4 py-3 text-[13px] text-fg-muted z-50">
            No symbols match "{query}"
          </div>
        )}
      </div>

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
