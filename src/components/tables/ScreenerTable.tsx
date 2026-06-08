import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ScreenerResult } from '@/api/types'
import { formatNumber } from '@/lib/format'

type SortKey = keyof Omit<ScreenerResult, 'symbol'>

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'pe_ratio', label: 'P/E' },
  { key: 'pb_ratio', label: 'P/B' },
  { key: 'roe', label: 'ROE %' },
  { key: 'de_ratio', label: 'D/E' },
  { key: 'current_ratio', label: 'Current' },
]

export function ScreenerTable({ results }: { results: ScreenerResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('pe_ratio')
  const [asc, setAsc] = useState(true)

  const sorted = [...results].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (av == null) return 1
    if (bv == null) return -1
    return asc ? av - bv : bv - av
  })

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  return (
    <table className="tbl w-full text-[13px]">
      <thead className="bg-bg-muted text-[11px] uppercase tracking-wider text-fg-muted">
        <tr>
          <th className="text-left font-medium pl-5 py-3">Symbol</th>
          {COLUMNS.map((c) => (
            <th
              key={c.key}
              onClick={() => toggle(c.key)}
              className="text-right font-medium py-3 pr-5 cursor-pointer select-none hover:text-fg"
            >
              {c.label} {sortKey === c.key ? (asc ? '▲' : '▼') : '▾'}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-mono">
        {sorted.map((r) => (
          <tr key={r.symbol}>
            <td className="pl-5 py-3">
              <Link to={`/symbol/${r.symbol}`} className="font-sans font-semibold hover:underline">
                {r.symbol}
              </Link>
            </td>
            {COLUMNS.map((c) => (
              <td key={c.key} className="text-right num py-3 pr-5">
                {formatNumber(r[c.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
