import { Link } from 'react-router-dom'
import type { SymbolInfo } from '@/api/types'
import { Table, THead, TH, TD, TR } from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import { SymbolIcon } from '@/components/common/SymbolIcon'

export function SymbolList({ symbols }: { symbols: SymbolInfo[] }) {
  return (
    <Table>
      <THead>
        <tr>
          <TH>Symbol</TH>
          <TH>Class</TH>
          <TH>Exchange</TH>
          <TH className="text-right">Last data</TH>
        </tr>
      </THead>
      <tbody>
        {symbols.map((s) => (
          <TR key={s.symbol}>
            <TD>
              <div className="flex items-center gap-2">
                <SymbolIcon symbol={s.symbol} assetClass={s.asset_class} size={18} />
                <Link to={`/symbol/${s.symbol}`} className="font-medium text-emerald-400 hover:underline">
                  {s.symbol}
                </Link>
              </div>
            </TD>
            <TD className="text-zinc-400">{s.asset_class}</TD>
            <TD className="text-zinc-400">{s.exchange}</TD>
            <TD className="text-right text-zinc-500 tabular-nums">{formatDate(s.last_date)}</TD>
          </TR>
        ))}
      </tbody>
    </Table>
  )
}
