import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import type { OHLCVBar } from '@/api/types'

export function SparklineChart({ bars, height = 48 }: { bars: OHLCVBar[]; height?: number }) {
  const data = bars.map((b) => ({ close: b.close }))
  const up = data.length >= 2 && data[data.length - 1].close >= data[0].close
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="close"
          stroke={up ? '#10b981' : '#ef4444'}
          dot={false}
          strokeWidth={1.5}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
