import { Link } from 'react-router-dom'
import { useSymbols } from '@/hooks/useSymbols'

export function Symbols() {
  const { data, isLoading } = useSymbols()
  const symbols = data?.symbols ?? []

  return (
    <div>
      <div className="mt-5 mb-5">
        <h1 className="text-[24px] font-semibold tracking-tight">Symbols</h1>
        <p className="text-[13px] text-fg-muted mt-1">{symbols.length} tracked symbols</p>
      </div>

      <div className="card bg-bg border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-[13px] text-fg-muted">Loading…</p>
        ) : (
          <table className="tbl w-full text-[13px]">
            <thead className="bg-bg-muted text-[11px] uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="text-left font-medium pl-5 py-3">Symbol</th>
                <th className="text-left font-medium">Exchange</th>
                <th className="text-left font-medium">Asset Class</th>
                <th className="text-right font-medium">First Date</th>
                <th className="text-right font-medium pr-5">Last Date</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {symbols.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-[13px] text-fg-muted text-center">No symbols loaded yet</td></tr>
              ) : symbols.map(s => (
                <tr key={`${s.symbol}-${s.asset_class}`}>
                  <td className="pl-5 py-3">
                    <Link to={`/symbol/${s.symbol}`} className="font-sans font-semibold hover:underline">{s.symbol}</Link>
                  </td>
                  <td className="font-sans text-fg-muted">{s.exchange}</td>
                  <td className="font-sans text-fg-muted">{s.asset_class}</td>
                  <td className="text-right">{s.first_date}</td>
                  <td className="text-right pr-5">{s.last_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
