import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ScreenerResult } from '@/api/types'
import { Table, THead, TH, TD, TR } from '@/components/ui/table'
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
    <Table>
      <THead>
        <tr>
          <TH>Symbol</TH>
          {COLUMNS.map((c) => (
            <TH key={c.key} className="text-right" onClick={() => toggle(c.key)}>
              {c.label} {sortKey === c.key ? (asc ? '▲' : '▼') : ''}
            </TH>
          ))}
        </tr>
      </THead>
      <tbody>
        {sorted.map((r) => (
          <TR key={r.symbol}>
            <TD>
              <Link to={`/symbol/${r.symbol}`} className="font-medium text-emerald-400 hover:underline">
                {r.symbol}
              </Link>
            </TD>
            {COLUMNS.map((c) => (
              <TD key={c.key} className="text-right tabular-nums">
                {formatNumber(r[c.key])}
              </TD>
            ))}
          </TR>
        ))}
      </tbody>
    </Table>
  )
}
