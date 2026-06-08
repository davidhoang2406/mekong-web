import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlists, useCreateWatchlist, useUpdateWatchlist, useDeleteWatchlist } from '@/hooks/useWatchlists'
import { useSymbols } from '@/hooks/useSymbols'
import { useAuthStore } from '@/stores/authStore'
import { SymbolIcon } from '@/components/common/SymbolIcon'
import type { Watchlist } from '@/api/types'

function SymbolPicker({
  watchlist,
  allSymbols,
  onClose,
}: {
  watchlist: Watchlist
  allSymbols: string[]
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const update = useUpdateWatchlist()

  const current = new Set(watchlist.symbols)
  const filtered = allSymbols.filter(s =>
    s.toLowerCase().includes(query.toLowerCase()),
  ).slice(0, 30)

  function toggle(symbol: string) {
    const next = current.has(symbol)
      ? watchlist.symbols.filter(s => s !== symbol)
      : [...watchlist.symbols, symbol]
    update.mutate({ id: watchlist.id, symbols: next })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-bg border border-border rounded-xl shadow-xl w-[420px] max-h-[560px] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-semibold">{watchlist.name}</h3>
          <button onClick={onClose} className="text-fg-muted hover:text-fg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-4 py-2 border-b border-border">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search symbols…"
            className="w-full bg-bg-muted rounded-md px-3 py-2 text-[13px] outline-none placeholder-fg-muted"
          />
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {filtered.map(s => (
            <button
              key={s}
              onClick={() => toggle(s)}
              className="w-full flex items-center justify-between px-5 py-2 text-[13px] hover:bg-bg-muted"
            >
              <span className="font-semibold font-sans">{s}</span>
              {current.has(s)
                ? <span className="text-[11px] text-up font-medium">Added ✓</span>
                : <span className="text-[11px] text-fg-muted">Add</span>
              }
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-5 py-4 text-[13px] text-fg-muted">No symbols match</p>
          )}
        </div>
      </div>
    </div>
  )
}

function WatchlistCard({
  watchlist,
  allSymbols,
}: {
  watchlist: Watchlist
  allSymbols: string[]
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const update = useUpdateWatchlist()
  const del = useDeleteWatchlist()

  function removeSymbol(symbol: string) {
    update.mutate({ id: watchlist.id, symbols: watchlist.symbols.filter(s => s !== symbol) })
  }

  return (
    <>
      <section className="card bg-bg border border-border rounded-lg">
        <header className="h-12 px-5 flex items-center justify-between border-b border-border">
          <h2 className="text-[15px] font-semibold">{watchlist.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPickerOpen(true)}
              className="h-7 px-3 rounded-md text-[12px] bg-bg-muted hover:bg-border text-fg"
            >
              + Add symbols
            </button>
            <button
              onClick={() => { if (confirm(`Delete "${watchlist.name}"?`)) del.mutate(watchlist.id) }}
              className="h-7 w-7 grid place-items-center rounded-md text-fg-muted hover:bg-bg-muted hover:text-down"
              title="Delete watchlist"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
            </button>
          </div>
        </header>

        {watchlist.symbols.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-fg-muted">No symbols yet — click "+ Add symbols"</p>
        ) : (
          <table className="tbl w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-fg-muted">
                <th className="text-left font-medium pl-5 py-2">Symbol</th>
                <th className="text-right font-medium pr-5">Remove</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.symbols.map(s => (
                <tr key={s}>
                  <td className="pl-5 py-2">
                    <div className="flex items-center gap-2">
                      <SymbolIcon symbol={s} size={18} />
                      <Link to={`/symbol/${s}`} className="font-semibold font-sans hover:underline">{s}</Link>
                    </div>
                  </td>
                  <td className="text-right pr-5">
                    <button
                      onClick={() => removeSymbol(s)}
                      className="text-fg-muted hover:text-down text-[11px]"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {pickerOpen && (
        <SymbolPicker
          watchlist={watchlist}
          allSymbols={allSymbols}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </>
  )
}

export function Watchlists() {
  const [newName, setNewName] = useState('')
  const { user } = useAuthStore()
  const { data: watchlists, isLoading } = useWatchlists()
  const { data: symbolsData } = useSymbols()
  const create = useCreateWatchlist()

  const allSymbols = (symbolsData?.symbols ?? []).map(s => s.symbol)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    create.mutate(name, { onSuccess: () => setNewName('') })
  }

  if (!user) {
    return (
      <div className="mt-20 text-center">
        <p className="text-[15px] text-fg-muted mb-4">Sign in to manage your watchlists</p>
        <Link to="/login" className="h-9 px-4 rounded-md bg-fg text-bg text-[13px] font-semibold hover:opacity-90 inline-flex items-center">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-end justify-between mt-5 mb-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Watchlists</h1>
          <p className="text-[13px] text-fg-muted mt-1">Track symbols you care about</p>
        </div>

        <form onSubmit={handleCreate} className="flex items-center gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New watchlist name…"
            className="h-9 px-3 rounded-md border border-border bg-bg text-[13px] outline-none focus:border-fg-muted w-52"
          />
          <button
            type="submit"
            disabled={!newName.trim() || create.isPending}
            className="h-9 px-4 rounded-md bg-fg text-bg text-[13px] font-semibold hover:opacity-90 disabled:opacity-40"
          >
            Create
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5">
          {[0, 1].map(i => (
            <div key={i} className="card bg-bg border border-border rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : (watchlists ?? []).length === 0 ? (
        <div className="mt-12 text-center text-fg-muted text-[14px]">
          No watchlists yet — create one above
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {(watchlists ?? []).map(w => (
            <WatchlistCard key={w.id} watchlist={w} allSymbols={allSymbols} />
          ))}
        </div>
      )}
    </div>
  )
}
