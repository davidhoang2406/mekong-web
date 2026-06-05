import { Link } from 'react-router-dom'
import { useScreener } from '@/hooks/useScreener'

function fmt(n: number | null | undefined, decimals = 1) {
  if (n == null) return '—'
  return n.toFixed(decimals)
}

export function Screener() {
  const now = new Date()
  const year = String(now.getFullYear())
  const week = String(getISOWeek(now)).padStart(2, '0')
  const { data, isLoading } = useScreener(year, week)
  const results = data?.results ?? []

  return (
    <div>
      <div className="flex items-end justify-between mt-5 mb-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Fundamental Screener</h1>
          <p className="text-[13px] text-fg-muted mt-1">
            Weekly P/E, P/B, ROE, EPS, D/E filter — refreshed every Monday 08:00 ICT
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 mb-4">
        <button className="h-9 px-3 rounded-md border border-border text-[13px] hover:bg-bg-muted flex items-center gap-1.5">
          Year <b>{year}</b>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <button className="h-9 px-3 rounded-md border border-border text-[13px] hover:bg-bg-muted flex items-center gap-1.5">
          Week <b>{week}</b>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>

      <div className="card bg-bg border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-[13px] text-fg-muted">Loading…</p>
        ) : (
          <table className="tbl w-full text-[13px]">
            <thead className="bg-bg-muted text-[11px] uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left font-medium pl-5 py-3">Symbol</th>
                <th className="text-right font-medium">P/E</th>
                <th className="text-right font-medium">P/B</th>
                <th className="text-right font-medium">ROE %</th>
                <th className="text-right font-medium">EPS</th>
                <th className="text-right font-medium">D/E</th>
                <th className="text-right font-medium pr-5">Curr Ratio</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {results.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-[13px] text-fg-muted text-center">No screener data for week {year}-W{week}</td></tr>
              ) : results.map(r => (
                <tr key={r.symbol}>
                  <td className="pl-5 py-3">
                    <Link to={`/symbol/${r.symbol}`} className="font-sans font-semibold hover:underline">{r.symbol}</Link>
                  </td>
                  <td className="text-right num">{fmt(r.pe_ratio)}</td>
                  <td className="text-right num">{fmt(r.pb_ratio)}</td>
                  <td className={`text-right num ${(r.roe ?? 0) >= 15 ? 'text-up' : ''}`}>{fmt(r.roe)}</td>
                  <td className="text-right num">{fmt(r.eps, 0)}</td>
                  <td className="text-right num">{fmt(r.de_ratio)}</td>
                  <td className="text-right num pr-5">{fmt(r.current_ratio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function getISOWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
