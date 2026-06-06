import { useEffect } from 'react'
import { useTickerStore, isFreshTick } from '@/stores/tickerStore'

export function LiveTickerBar() {
  const { prices, subscribe, unsubscribe, connectionState } = useTickerStore()

  useEffect(() => {
    subscribe(['*'])
    return () => unsubscribe(['*'])
  }, [subscribe, unsubscribe])

  const freshTicks = Object.values(prices).filter(isFreshTick)

  // Duplicate for seamless infinite scroll; fall back to static when all ticks are stale
  const items = freshTicks.length > 0 ? [...freshTicks, ...freshTicks] : STATIC_ITEMS

  return (
    <div className="ticker-mask my-5 h-12 overflow-hidden rounded-md border border-border bg-bg flex items-center">
      <div className="ticker-track whitespace-nowrap font-mono text-[13px]">
        {items.map((e, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <b className="font-semibold font-sans">{e.symbol}</b>
            <span className="num">{e.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            <span className={e.pct_change >= 0 ? 'text-up' : 'text-down'}>
              {e.pct_change >= 0 ? '▲' : '▼'} {Math.abs(e.pct_change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <span className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${
        connectionState === 'connected' ? 'bg-up live-dot' :
        connectionState === 'reconnecting' ? 'bg-yellow-400 live-dot' : 'bg-fg-muted'
      }`} />
    </div>
  )
}

const STATIC_ITEMS = [
  { symbol: 'VCB',      price: 85800,  pct_change:  0.59 },
  { symbol: 'FPT',      price: 128000, pct_change:  2.10 },
  { symbol: 'VNM',      price: 76500,  pct_change:  4.12 },
  { symbol: 'HPG',      price: 25400,  pct_change: -3.20 },
  { symbol: 'BTC-USDT', price: 68500,  pct_change:  1.78 },
  { symbol: 'ETH-USDT', price: 3210,   pct_change:  0.92 },
  { symbol: 'MWG',      price: 62400,  pct_change:  3.84 },
  { symbol: 'VCB',      price: 85800,  pct_change:  0.59 },
  { symbol: 'FPT',      price: 128000, pct_change:  2.10 },
  { symbol: 'VNM',      price: 76500,  pct_change:  4.12 },
  { symbol: 'HPG',      price: 25400,  pct_change: -3.20 },
  { symbol: 'BTC-USDT', price: 68500,  pct_change:  1.78 },
  { symbol: 'ETH-USDT', price: 3210,   pct_change:  0.92 },
  { symbol: 'MWG',      price: 62400,  pct_change:  3.84 },
]
