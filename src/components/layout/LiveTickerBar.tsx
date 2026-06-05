import { useDigest } from '@/hooks/useDigest'
import { isoDaysAgo } from '@/lib/format'

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

export function LiveTickerBar() {
  const date = isoDaysAgo(1)
  const { data } = useDigest(date)
  const entries = data?.digest ?? []

  // Duplicate for seamless loop
  const items = entries.length > 0 ? [...entries, ...entries] : STATIC_ITEMS

  return (
    <div className="ticker-mask my-5 h-12 overflow-hidden rounded-md border border-border bg-bg flex items-center">
      <div className="ticker-track whitespace-nowrap font-mono text-[13px]">
        {items.map((e, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <b className="font-semibold font-sans">{e.symbol}</b>
            <span className="num">{fmt(e.close)}</span>
            <span className={e.pct_change >= 0 ? 'text-up' : 'text-down'}>
              {e.pct_change >= 0 ? '▲' : '▼'} {Math.abs(e.pct_change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

const STATIC_ITEMS = [
  { symbol: 'VCB',     close: 85800,  pct_change:  0.59 },
  { symbol: 'FPT',     close: 128000, pct_change:  2.10 },
  { symbol: 'VNM',     close: 76500,  pct_change:  4.12 },
  { symbol: 'HPG',     close: 25400,  pct_change: -3.20 },
  { symbol: 'BTC-USDT',close: 68500,  pct_change:  1.78 },
  { symbol: 'ETH-USDT',close: 3210,   pct_change:  0.92 },
  { symbol: 'MWG',     close: 62400,  pct_change:  3.84 },
  { symbol: 'VCB',     close: 85800,  pct_change:  0.59 },
  { symbol: 'FPT',     close: 128000, pct_change:  2.10 },
  { symbol: 'VNM',     close: 76500,  pct_change:  4.12 },
  { symbol: 'HPG',     close: 25400,  pct_change: -3.20 },
  { symbol: 'BTC-USDT',close: 68500,  pct_change:  1.78 },
  { symbol: 'ETH-USDT',close: 3210,   pct_change:  0.92 },
  { symbol: 'MWG',     close: 62400,  pct_change:  3.84 },
]
