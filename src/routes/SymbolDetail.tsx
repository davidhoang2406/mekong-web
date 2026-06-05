import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useOHLCV } from '@/hooks/useOHLCV'
import { useIndicators } from '@/hooks/useIndicators'
import { fmtNum, fmtPct } from '@/lib/format'

const RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
]

function isoDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-CA')
}

function CandleChart({ bars }: { bars: any[] }) {
  if (!bars.length) return <div className="h-[280px] flex items-center justify-center text-fg-muted text-[13px]">No data</div>
  const min = Math.min(...bars.map(b => b.low))
  const max = Math.max(...bars.map(b => b.high))
  const range = max - min || 1
  const W = 900, H = 280, padY = 20
  const bw = Math.max(2, (W / bars.length) * 0.6)
  const step = W / bars.length

  function scaleY(v: number) { return H - padY - ((v - min) / range) * (H - padY * 2) }

  return (
    <svg className="candle w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <g stroke="#e5e5e5" strokeWidth="0.5">
        {[0.2, 0.4, 0.6, 0.8].map(r => (
          <line key={r} x1="0" y1={scaleY(min + range * (1 - r))} x2={W} y2={scaleY(min + range * (1 - r))} />
        ))}
      </g>
      {bars.map((b, i) => {
        const x = i * step + step / 2
        const up = b.close >= b.open
        const color = up ? '#16a34a' : '#dc2626'
        const bodyY = scaleY(Math.max(b.open, b.close))
        const bodyH = Math.max(1, Math.abs(scaleY(b.open) - scaleY(b.close)))
        return (
          <g key={i}>
            <line x1={x} y1={scaleY(b.high)} x2={x} y2={scaleY(b.low)} stroke={color} strokeWidth="1" />
            <rect
              x={x - bw / 2} y={bodyY} width={bw} height={bodyH}
              fill={up ? '#ffffff' : color} stroke={color} strokeWidth={up ? '1.2' : '0'}
            />
          </g>
        )
      })}
    </svg>
  )
}

function RSIChart({ data }: { data: any[] }) {
  const vals = data.map(r => r.rsi14).filter(Boolean) as number[]
  if (!vals.length) return null
  const W = 900, H = 100
  const pts = vals.map((v, i) => {
    const x = (i / Math.max(vals.length - 1, 1)) * W
    const y = H - (v / 100) * H
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="rsi w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <line x1="0" y1={H * 0.3} x2={W} y2={H * 0.3} stroke="#dc2626" strokeWidth="0.6" strokeDasharray="3 3" />
      <line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="#e5e5e5" strokeWidth="0.5" />
      <line x1="0" y1={H * 0.7} x2={W} y2={H * 0.7} stroke="#16a34a" strokeWidth="0.6" strokeDasharray="3 3" />
      <polyline fill="none" stroke="#1e1e1e" strokeWidth="1.4" points={pts} />
    </svg>
  )
}

function MACDChartComp({ data }: { data: any[] }) {
  const macds = data.map(r => r.macd).filter(Boolean) as number[]
  const signals = data.map(r => r.macd_signal).filter(Boolean) as number[]
  if (!macds.length) return null
  const W = 900, H = 100, mid = H / 2
  const allVals = [...macds, ...signals]
  const minV = Math.min(...allVals), maxV = Math.max(...allVals)
  const rangeV = maxV - minV || 1
  function sy(v: number) { return mid - ((v - (minV + maxV) / 2) / rangeV) * (H * 0.8) }
  const macdPts = macds.map((v, i) => `${(i / Math.max(macds.length - 1, 1)) * W},${sy(v)}`).join(' ')
  const sigPts  = signals.map((v, i) => `${(i / Math.max(signals.length - 1, 1)) * W},${sy(v)}`).join(' ')
  return (
    <svg className="macd w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <line x1="0" y1={mid} x2={W} y2={mid} stroke="#e5e5e5" />
      <polyline fill="none" stroke="#1e1e1e" strokeWidth="1.4" points={macdPts} />
      <polyline fill="none" stroke="#737373" strokeWidth="1.2" strokeDasharray="4 3" points={sigPts} />
    </svg>
  )
}

export function SymbolDetail() {
  const { symbol = '' } = useParams<{ symbol: string }>()
  const [range, setRange] = useState(1)
  const from = isoDate(RANGES[range].days)
  const to = isoDate(0)

  const ohlcv = useOHLCV(symbol, from, to)
  const indicators = useIndicators(symbol, from, to)

  const bars = ohlcv.data?.bars ?? []
  const inds = indicators.data?.indicators ?? []
  const latest = bars[bars.length - 1]
  const latestInd = inds[inds.length - 1]
  const prev = bars[bars.length - 2]
  const pctChange = latest && prev ? ((latest.close - prev.close) / prev.close) * 100 : 0
  const up = pctChange >= 0

  return (
    <div>
      <nav className="mt-5 mb-2 text-[12px] text-fg-muted flex items-center gap-1.5">
        <Link to="/" className="hover:text-fg">← Dashboard</Link>
        <span>·</span>
        <span>{ohlcv.data?.exchange ?? '—'}</span>
        <span>·</span>
        <span>{ohlcv.data?.asset_class ?? '—'}</span>
      </nav>

      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[40px] font-bold tracking-tight leading-none">{symbol}</h1>
            <span className="text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded border border-border text-fg-muted uppercase">
              {ohlcv.data?.asset_class ?? 'Stock'}
            </span>
          </div>
        </div>
      </div>

      {latest && (
        <div className="mt-3 flex items-baseline gap-4 font-mono">
          <span className={`text-[36px] font-semibold num leading-none ${up ? 'text-up' : 'text-down'}`}>
            {fmtNum(latest.close)}
          </span>
          <span className={up ? 'text-up text-[16px]' : 'text-down text-[16px]'}>
            {up ? '▲' : '▼'} {fmtPct(Math.abs(pctChange))}%
          </span>
          <span className="ml-auto text-[12px] text-fg-muted font-sans">
            day high <b className="num">{fmtNum(latest.high)}</b> · day low <b className="num">{fmtNum(latest.low)}</b>
          </span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-[1fr_360px] gap-5">
        <div className="space-y-3">

          {/* Range tabs */}
          <div className="card bg-bg border border-border rounded-lg h-12 flex items-center px-2">
            <div className="flex items-center gap-1 text-[13px]">
              {RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setRange(i)}
                  className={i === range
                    ? 'h-8 px-3 rounded bg-fg text-bg font-semibold'
                    : 'h-8 px-3 rounded text-fg-muted hover:bg-bg-muted'
                  }
                >{r.label}</button>
              ))}
            </div>
          </div>

          {/* Candlestick */}
          <div className="card bg-bg border border-border rounded-lg p-4">
            <div className="flex items-center text-[11px] text-fg-muted mb-2 font-mono gap-4">
              {latest && <>
                <span>O <b className="text-fg num">{fmtNum(latest.open)}</b></span>
                <span>H <b className="text-up num">{fmtNum(latest.high)}</b></span>
                <span>L <b className="text-down num">{fmtNum(latest.low)}</b></span>
                <span>C <b className="text-fg num">{fmtNum(latest.close)}</b></span>
                <span>V <b className="text-fg num">{(latest.volume / 1_000_000).toFixed(2)}M</b></span>
              </>}
            </div>
            {ohlcv.isLoading
              ? <div className="h-[280px] flex items-center justify-center text-fg-muted text-[13px]">Loading…</div>
              : <CandleChart bars={bars} />
            }
          </div>

          {/* RSI */}
          <div className="card bg-bg border border-border rounded-lg p-4">
            <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
              <span className="text-fg-muted">RSI(14)</span>
              <span><b className="text-fg num">{latestInd?.rsi14?.toFixed(1) ?? '—'}</b></span>
            </div>
            <RSIChart data={inds} />
          </div>

          {/* MACD */}
          <div className="card bg-bg border border-border rounded-lg p-4">
            <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
              <span className="text-fg-muted">MACD (12, 26, 9)</span>
              <div className="flex gap-3">
                <span>MACD <b className="text-fg num">{latestInd?.macd?.toFixed(1) ?? '—'}</b></span>
                <span>Signal <b className="text-fg-muted num">{latestInd?.macd_signal?.toFixed(1) ?? '—'}</b></span>
              </div>
            </div>
            <MACDChartComp data={inds} />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-3">
          {latest && (
            <div className="card bg-bg border border-border rounded-lg">
              <header className="h-11 px-4 flex items-center justify-between border-b border-border">
                <h3 className="text-[13px] font-semibold">Latest Bar</h3>
                <span className="text-[11px] text-fg-muted font-mono">{latest.time}</span>
              </header>
              <div className="p-4 grid grid-cols-2 gap-y-3 text-[13px] font-mono">
                {[['Open', latest.open], ['Close', latest.close], ['High', latest.high], ['Low', latest.low]].map(([label, val]) => (
                  <div key={label as string}>
                    <div className="text-[11px] text-fg-muted uppercase tracking-wider font-sans">{label}</div>
                    <div className="num text-[15px]">{fmtNum(val as number)}</div>
                  </div>
                ))}
                <div className="col-span-2 pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-[11px] text-fg-muted uppercase tracking-wider font-sans">Volume</div>
                      <div className="num">{fmtNum(latest.volume)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {latestInd && (
            <div className="card bg-bg border border-border rounded-lg">
              <header className="h-11 px-4 flex items-center border-b border-border">
                <h3 className="text-[13px] font-semibold">Indicators</h3>
              </header>
              <div className="p-4 text-[13px] font-mono space-y-2.5">
                {[['SMA 20', latestInd.sma20], ['SMA 50', latestInd.sma50], ['SMA 200', latestInd.sma200]].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-fg-muted font-sans">{label}</span>
                    <span className="num">{val != null ? fmtNum(val as number) : '—'}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2.5 flex justify-between items-center">
                  <span className="text-fg-muted font-sans">RSI 14</span>
                  <span className="num">{latestInd.rsi14?.toFixed(1) ?? '—'}</span>
                </div>
                <div className="border-t border-border pt-2.5 space-y-1.5">
                  {[['MACD', latestInd.macd], ['Signal', latestInd.macd_signal], ['Histogram', latestInd.macd_hist]].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between">
                      <span className="text-fg-muted font-sans">{label}</span>
                      <span className={`num ${(val as number) > 0 ? 'text-up' : (val as number) < 0 ? 'text-down' : ''}`}>
                        {val != null ? (val as number).toFixed(2) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
                {(latestInd.bb_upper || latestInd.bb_mid || latestInd.bb_lower) && (
                  <div className="border-t border-border pt-2.5 space-y-1.5">
                    {[['BB Upper', latestInd.bb_upper], ['BB Mid', latestInd.bb_mid], ['BB Lower', latestInd.bb_lower]].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between">
                        <span className="text-fg-muted font-sans">{label}</span>
                        <span className="num">{val != null ? fmtNum(val as number) : '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
