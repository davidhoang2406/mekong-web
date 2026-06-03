import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CandlestickChart, type LineOverlay } from '@/components/charts/CandlestickChart'
import { RSIChart } from '@/components/charts/RSIChart'
import { MACDChart } from '@/components/charts/MACDChart'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/common/PriceDisplay'
import { QueryState } from '@/components/common/QueryState'
import { useOHLCV } from '@/hooks/useOHLCV'
import { useIndicators } from '@/hooks/useIndicators'
import type { IndicatorRow } from '@/api/types'
import { TIME_RANGES, DEFAULT_RANGE_DAYS, type TimeRangeLabel } from '@/lib/constants'
import { formatNumber, formatVND, formatVolume, isoDaysAgo, todayISO } from '@/lib/format'

function overlay(rows: IndicatorRow[], key: 'sma20' | 'sma50' | 'sma200', color: string, name: string): LineOverlay {
  return {
    name,
    color,
    data: rows.filter((r) => r[key] != null).map((r) => ({ time: r.time, value: r[key] as number })),
  }
}

export function SymbolDetail() {
  const { symbol = '' } = useParams()
  const [range, setRange] = useState<TimeRangeLabel>('3M')

  const days = TIME_RANGES.find((r) => r.label === range)?.days ?? DEFAULT_RANGE_DAYS
  const from = isoDaysAgo(days)
  const to = todayISO()

  const ohlcv = useOHLCV(symbol, from, to)
  const indicators = useIndicators(symbol, from, to)

  const bars = useMemo(() => ohlcv.data?.bars ?? [], [ohlcv.data])
  const rows = useMemo(() => indicators.data?.indicators ?? [], [indicators.data])
  const lastBar = bars[bars.length - 1]
  const lastInd = rows[rows.length - 1]

  const overlays = useMemo<LineOverlay[]>(
    () =>
      rows.length
        ? [
            overlay(rows, 'sma20', '#3b82f6', 'SMA20'),
            overlay(rows, 'sma50', '#a855f7', 'SMA50'),
            overlay(rows, 'sma200', '#f59e0b', 'SMA200'),
          ].filter((o) => o.data.length > 0)
        : [],
    [rows],
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{symbol}</h1>
            <span className="text-sm text-zinc-500">{ohlcv.data?.exchange ?? ''}</span>
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
              ● LIVE (Phase 3)
            </span>
          </div>
          <PriceDisplay price={lastBar?.close} className="mt-1" />
        </div>
        <div className="flex gap-1">
          {TIME_RANGES.map((r) => (
            <Button key={r.label} active={r.label === range} onClick={() => setRange(r.label)}>
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Candles */}
      <Card>
        <CardBody>
          <QueryState isLoading={ohlcv.isLoading} error={ohlcv.error} isEmpty={bars.length === 0}>
            <CandlestickChart bars={bars} overlays={overlays} />
          </QueryState>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Indicator sub-charts */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="RSI (14)" />
            <CardBody>
              <QueryState isLoading={indicators.isLoading} error={indicators.error} isEmpty={rows.length === 0}>
                <RSIChart rows={rows} />
              </QueryState>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="MACD (12/26/9)" />
            <CardBody>
              <QueryState isLoading={indicators.isLoading} error={indicators.error} isEmpty={rows.length === 0}>
                <MACDChart rows={rows} />
              </QueryState>
            </CardBody>
          </Card>
        </div>

        {/* Price info panel */}
        <Card>
          <CardHeader title="Latest" />
          <CardBody className="space-y-1 text-sm">
            <Row label="Open" value={formatVND(lastBar?.open)} />
            <Row label="High" value={formatVND(lastBar?.high)} />
            <Row label="Low" value={formatVND(lastBar?.low)} />
            <Row label="Close" value={formatVND(lastBar?.close)} />
            <Row label="Volume" value={formatVolume(lastBar?.volume)} />
            <div className="my-2 border-t border-zinc-800" />
            <Row label="SMA20" value={formatVND(lastInd?.sma20)} />
            <Row label="SMA50" value={formatVND(lastInd?.sma50)} />
            <Row label="SMA200" value={formatVND(lastInd?.sma200)} />
            <Row label="RSI14" value={formatNumber(lastInd?.rsi14)} />
            <Row label="MACD" value={formatNumber(lastInd?.macd)} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className="tabular-nums text-zinc-200">{value}</span>
    </div>
  )
}
