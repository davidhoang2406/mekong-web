import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { IndicatorRow } from '@/api/types'
import { formatDate } from '@/lib/format'

export function RSIChart({ rows }: { rows: IndicatorRow[] }) {
  const data = rows.map((r) => ({ time: r.time.slice(0, 10), rsi14: r.rsi14 }))
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 5, right: 8, bottom: 5, left: -20 }}>
        <XAxis dataKey="time" hide />
        <YAxis domain={[0, 100]} ticks={[30, 50, 70]} stroke="#52525b" fontSize={10} />
        <Tooltip
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', fontSize: 12 }}
          labelFormatter={(l) => formatDate(String(l))}
        />
        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
        <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="rsi14" stroke="#eab308" dot={false} strokeWidth={1.5} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}
