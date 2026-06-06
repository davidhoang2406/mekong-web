import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDigest, useDigestLive } from '@/hooks/useDigest'
import { isoDaysAgo, fmtNum, fmtPct } from '@/lib/format'
import type { DigestEntry } from '@/api/types'

type Tab = 'gainer' | 'loser' | 'volume'
type Mode = 'live' | 'history'

const TABS: { id: Tab; label: string }[] = [
  { id: 'gainer', label: 'Top Gainers' },
  { id: 'loser',  label: 'Top Losers' },
  { id: 'volume', label: 'Volume Leaders' },
]

function DigestRow({ e }: { e: DigestEntry }) {
  const up = e.pct_change >= 0
  return (
    <tr>
      <td className="pl-5 py-3 text-fg-muted">{e.rank}</td>
      <td><Link to={`/symbol/${e.symbol}`} className="font-sans font-semibold hover:underline">{e.symbol}</Link></td>
      <td className="font-sans text-fg-muted">{e.exchange}</td>
      <td className="text-right num">{fmtNum(e.open)}</td>
      <td className="text-right num">{fmtNum(e.close)}</td>
      <td className="text-right num">{fmtNum(e.volume)}</td>
      <td className="text-right pr-5">
        <span className={`font-semibold ${up ? 'text-up' : 'text-down'}`}>
          {up ? '▲' : '▼'} {fmtPct(Math.abs(e.pct_change))} %
        </span>
      </td>
    </tr>
  )
}

export function Digest() {
  const [tab, setTab] = useState<Tab>('gainer')
  const [mode, setMode] = useState<Mode>('live')
  const [historyDate, setHistoryDate] = useState(isoDaysAgo(1))

  // Fetch all categories at once so every tab has its own accurate count
  const { data: historyData, isLoading: historyLoading } = useDigest(historyDate, undefined, 30)
  const { data: liveData, isLoading: liveLoading } = useDigestLive(undefined, 10)

  const isLive = mode === 'live'
  const isFallback = !isLive && historyData?.fallback === true
  // When fallback, treat as no data — don't show data from a different date
  const allDigest: DigestEntry[] = (isLive ? (liveData?.digest ?? []) : (isFallback ? [] : (historyData?.digest ?? [])))
  const entries = allDigest.filter(e => e.category === tab)
  const countFor = (cat: Tab) => allDigest.filter(e => e.category === cat).length

  const isLoading = isLive ? liveLoading : historyLoading
  const asOf = isLive && liveData?.as_of ? new Date(liveData.as_of).toLocaleTimeString() : null

  return (
    <div>
      <div className="flex items-end justify-between mt-5 mb-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Daily Market Digest</h1>
          <p className="text-[13px] text-fg-muted mt-1">
            Top movers per category — refreshed daily at HOSE close (15:00 ICT)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {/* Mode toggle */}
        <div className="flex items-center rounded-md border border-border text-[13px] overflow-hidden">
          <button
            onClick={() => setMode('live')}
            className={`h-9 px-3 flex items-center gap-1.5 transition-colors ${
              isLive ? 'bg-fg text-bg font-semibold' : 'text-fg-muted hover:bg-bg-muted'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-up live-dot' : 'bg-fg-muted'}`} />
            Live
          </button>
          <button
            onClick={() => setMode('history')}
            className={`h-9 px-3 flex items-center gap-1.5 border-l border-border transition-colors ${
              !isLive ? 'bg-fg text-bg font-semibold' : 'text-fg-muted hover:bg-bg-muted'
            }`}
          >
            History
          </button>
        </div>

        {/* Date / time badge */}
        {isLive && asOf && (
          <span className="h-9 px-3 rounded-md border border-border text-[13px] flex items-center gap-1.5 font-mono text-fg-muted">
            as of {asOf}
          </span>
        )}
        {!isLive && (
          <input
            type="date"
            value={historyDate}
            max={isoDaysAgo(0)}
            onChange={e => e.target.value && setHistoryDate(e.target.value)}
            className="h-9 px-3 rounded-md border border-border text-[13px] font-mono bg-bg text-fg cursor-pointer hover:bg-bg-muted focus:outline-none"
          />
        )}
      </div>

      <div className="card bg-bg border border-border rounded-lg overflow-hidden">
        <div role="tablist" className="h-12 border-b border-border flex items-center px-2 gap-1 text-[13px]">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={tab === t.id
                ? 'h-9 px-4 rounded bg-fg text-bg font-semibold flex items-center gap-1.5'
                : 'h-9 px-4 rounded text-fg-muted hover:bg-bg-muted flex items-center gap-1.5'
              }
            >
              {t.id === 'gainer' && <span className={tab === t.id ? '' : 'text-up'}>▲</span>}
              {t.id === 'loser'  && <span className={tab === t.id ? '' : 'text-down'}>▼</span>}
              {t.label}
              <span className="text-[11px] opacity-70">({countFor(t.id)})</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="p-6 text-[13px] text-fg-muted">Loading…</p>
        ) : (
          <table className="tbl w-full text-[13px]">
            <thead className="bg-bg-muted text-[11px] uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left font-medium pl-5 py-3 w-12">#</th>
                <th className="text-left font-medium">Symbol</th>
                <th className="text-left font-medium">Exchange</th>
                <th className="text-right font-medium">Open</th>
                <th className="text-right font-medium">{isLive ? 'Price' : 'Close'}</th>
                <th className="text-right font-medium">Volume</th>
                <th className="text-right font-medium pr-5">% Change ▾</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {entries.length === 0
                ? <tr><td colSpan={7} className="p-6 text-[13px] text-fg-muted text-center">
                    {isLive ? 'No live data yet — waiting for ticks' : `No data for ${historyDate}`}
                  </td></tr>
                : entries.map(e => <DigestRow key={`${e.category}-${e.rank}`} e={e} />)
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
