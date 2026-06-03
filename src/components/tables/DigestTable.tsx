import { Link } from 'react-router-dom'
import type { DigestEntry } from '@/api/types'
import { Table, THead, TH, TD, TR } from '@/components/ui/table'
import { changeColor, formatPercent, formatVND, formatVolume } from '@/lib/format'

export function DigestTable({ entries }: { entries: DigestEntry[] }) {
  return (
    <Table>
      <THead>
        <tr>
          <TH>#</TH>
          <TH>Symbol</TH>
          <TH className="text-right">Close</TH>
          <TH className="text-right">Change</TH>
          <TH className="text-right">Volume</TH>
        </tr>
      </THead>
      <tbody>
        {entries.map((e) => (
          <TR key={`${e.category}-${e.symbol}`}>
            <TD className="text-zinc-500">{e.rank}</TD>
            <TD>
              <Link to={`/symbol/${e.symbol}`} className="font-medium text-emerald-400 hover:underline">
                {e.symbol}
              </Link>
              <span className="ml-2 text-xs text-zinc-500">{e.exchange}</span>
            </TD>
            <TD className="text-right tabular-nums">{formatVND(e.close)}</TD>
            <TD className={`text-right tabular-nums ${changeColor(e.pct_change)}`}>
              {formatPercent(e.pct_change)}
            </TD>
            <TD className="text-right tabular-nums text-zinc-400">{formatVolume(e.volume)}</TD>
          </TR>
        ))}
      </tbody>
    </Table>
  )
}
