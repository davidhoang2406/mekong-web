import { Link } from 'react-router-dom'
import { LiveTickerBar } from '@/components/layout/LiveTickerBar'
import { useDigest } from '@/hooks/useDigest'
import { useSymbols } from '@/hooks/useSymbols'
import { isoDaysAgo, fmtNum, fmtPct } from '@/lib/format'
import type { DigestEntry } from '@/api/types'

function DigestTable({ entries, volFirst }: { entries: DigestEntry[]; volFirst?: boolean }) {
  return (
    <table className="tbl w-full text-[13px]">
      <thead>
        <tr className="text-[11px] uppercase tracking-wider text-fg-muted">
          <th className="text-left font-medium pl-5 py-2 w-8">#</th>
          <th className="text-left font-medium">Symbol</th>
          {volFirst
            ? <>
                <th className="text-right font-medium">Volume</th>
                <th className="text-right font-medium">Price</th>
                <th className="text-right font-medium pr-5">% Chg</th>
              </>
            : <>
                <th className="text-right font-medium">% Chg</th>
                <th className="text-right font-medium">Price</th>
                <th className="text-right font-medium pr-5">Volume</th>
              </>
          }
        </tr>
      </thead>
      <tbody className="font-mono">
        {entries.map((e) => (
          <tr key={`${e.category}-${e.rank}`}>
            <td className="pl-5 py-2 text-fg-muted">{e.rank}</td>
            <td>
              <Link to={`/symbol/${e.symbol}`} className="font-sans font-semibold hover:underline">{e.symbol}</Link>
            </td>
            {volFirst
              ? <>
                  <td className="text-right num">{fmtNum(e.volume)}</td>
                  <td className="text-right num">{fmtNum(e.close)}</td>
                  <td className={`text-right pr-5 ${e.pct_change >= 0 ? 'text-up' : 'text-down'}`}>
                    {e.pct_change >= 0 ? '▲' : '▼'} {fmtPct(e.pct_change)}
                  </td>
                </>
              : <>
                  <td className={`text-right ${e.pct_change >= 0 ? 'text-up' : 'text-down'}`}>
                    {e.pct_change >= 0 ? '▲' : '▼'} {fmtPct(e.pct_change)}
                  </td>
                  <td className="text-right num">{fmtNum(e.close)}</td>
                  <td className="text-right num pr-5">{fmtNum(e.volume)}</td>
                </>
            }
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TableCard({ title, entries, volFirst }: { title: string; entries: DigestEntry[]; volFirst?: boolean }) {
  return (
    <section className="card bg-bg border border-border rounded-lg">
      <header className="h-12 px-5 flex items-center justify-between border-b border-border">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <span className="text-[12px] text-fg-muted">Today</span>
      </header>
      {entries.length === 0
        ? <p className="p-5 text-[13px] text-fg-muted">No data available</p>
        : <DigestTable entries={entries} volFirst={volFirst} />
      }
    </section>
  )
}

export function Dashboard() {
  const date = isoDaysAgo(1)
  const digest = useDigest(date, undefined, 50)
  const symbols = useSymbols()

  const byCategory = (cat: string) =>
    (digest.data?.digest ?? []).filter((e) => e.category === cat).slice(0, 10)

  const today = new Date().toLocaleDateString('en-CA')

  return (
    <div>
      <LiveTickerBar />

      <div className="flex items-end justify-between mt-2 mb-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-fg-muted mt-1">Today, {today} · ICT close — HOSE 15:00 · Crypto 24/7</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <TableCard title="Top Gainers" entries={byCategory('gainer')} />
        <TableCard title="Top Losers"  entries={byCategory('loser')} />
        <TableCard title="Volume Leaders" entries={byCategory('volume')} volFirst />

        {/* Symbols card */}
        <section className="card bg-bg border border-border rounded-lg">
          <header className="h-12 px-5 flex items-center justify-between border-b border-border">
            <h2 className="text-[15px] font-semibold">
              Symbols{' '}
              <span className="ml-2 text-[11px] font-normal text-fg-muted">
                {symbols.data?.symbols?.length ?? 0} tracked
              </span>
            </h2>
          </header>
          <div className="p-4 space-y-1">
            {(symbols.data?.symbols ?? []).slice(0, 12).map((s) => (
              <Link
                key={`${s.symbol}-${s.asset_class}`}
                to={`/symbol/${s.symbol}`}
                className="flex items-center justify-between h-9 px-2 rounded hover:bg-bg-muted text-[13px]"
              >
                <span className="font-semibold">{s.symbol}</span>
                <span className="text-[11px] text-fg-muted font-mono">{s.exchange} · {s.asset_class}</span>
              </Link>
            ))}
            {(symbols.data?.symbols ?? []).length === 0 && (
              <p className="text-[13px] text-fg-muted p-1">No symbols loaded yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
