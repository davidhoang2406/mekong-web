import {
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { IndicatorRow } from '@/api/types'
import { formatDate } from '@/lib/format'

export function MACDChart({ rows }: { rows: IndicatorRow[] }) {
  const data = rows.map((r) => ({
    time: r.time.slice(0, 10),
    macd: r.macd,
    signal: r.macd_signal,
    hist: r.macd_hist,
  }))
  return (
    <ResponsiveContainer width="100%" height={140}>
      <ComposedChart data={data} margin={{ top: 5, right: 8, bottom: 5, left: -20 }}>
        <XAxis dataKey="time" hide />
        <YAxis stroke="#52525b" fontSize={10} />
        <Tooltip
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', fontSize: 12 }}
          labelFormatter={(l) => formatDate(String(l))}
        />
        <Bar dataKey="hist" fill="#3f3f46" />
        <Line type="monotone" dataKey="macd" stroke="#3b82f6" dot={false} strokeWidth={1.5} connectNulls />
        <Line type="monotone" dataKey="signal" stroke="#f97316" dot={false} strokeWidth={1.5} connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
