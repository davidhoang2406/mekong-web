import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDigest } from '@/hooks/useDigest'
import { isoDaysAgo, fmtNum, fmtPct } from '@/lib/format'
import type { DigestEntry } from '@/api/types'

type Tab = 'gainer' | 'loser' | 'volume'

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
  const date = isoDaysAgo(1)
  const { data, isLoading } = useDigest(date, tab, 10)
  const entries = data?.digest ?? []

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
        <button className="h-9 px-3 rounded-md border border-border text-[13px] hover:bg-bg-muted flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className="font-mono">{date}</span>
        </button>
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
              {t.id === 'gainer' && <span className="text-up">▲</span>}
              {t.id === 'loser'  && <span className="text-down">▼</span>}
              {t.label}
              <span className="text-[11px] opacity-70">({entries.length})</span>
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
                <th className="text-right font-medium">Close</th>
                <th className="text-right font-medium">Volume</th>
                <th className="text-right font-medium pr-5">% Change ▾</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {entries.length === 0
                ? <tr><td colSpan={7} className="p-6 text-[13px] text-fg-muted text-center">No data for {date}</td></tr>
                : entries.map(e => <DigestRow key={`${e.category}-${e.rank}`} e={e} />)
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
