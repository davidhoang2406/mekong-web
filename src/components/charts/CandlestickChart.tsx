import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
} from 'lightweight-charts'
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts'
import type { OHLCVBar } from '@/api/types'
import type { Tick } from '@/stores/tickerStore'

export interface LineOverlay {
  name: string
  color: string
  data: { time: string; value: number }[]
}

interface Props {
  bars: OHLCVBar[]
  overlays?: LineOverlay[]
  height?: number
  liveTick?: Tick
}

const day = (t: string): Time => t.slice(0, 10) as Time

/** TradingView Lightweight Charts wrapper: candles + volume + optional SMA overlays. */
export function CandlestickChart({ bars, overlays = [], height = 420, liveTick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = createChart(container, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#737373',
      },
      grid: {
        vertLines: { color: '#e5e5e5' },
        horzLines: { color: '#e5e5e5' },
      },
      rightPriceScale: { borderColor: '#e5e5e5' },
      timeScale: { borderColor: '#e5e5e5', timeVisible: true },
      autoSize: true,
    })
    chartRef.current = chart

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#16a34a',
      downColor: '#dc2626',
      borderVisible: true,
      borderUpColor: '#16a34a',
      borderDownColor: '#dc2626',
      wickUpColor: '#16a34a',
      wickDownColor: '#dc2626',
    })
    candles.setData(
      bars.map((b) => ({ time: day(b.time), open: b.open, high: b.high, low: b.low, close: b.close })),
    )
    candleSeriesRef.current = candles

    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
    volume.setData(
      bars.map((b) => ({
        time: day(b.time),
        value: b.volume,
        color: b.close >= b.open ? 'rgba(22,163,74,0.4)' : 'rgba(220,38,38,0.4)',
      })),
    )
    volumeSeriesRef.current = volume

    for (const ov of overlays) {
      const line = chart.addSeries(LineSeries, { color: ov.color, lineWidth: 1, title: ov.name })
      line.setData(ov.data.map((d) => ({ time: day(d.time), value: d.value })))
    }

    chart.timeScale().fitContent()

    return () => {
      chart.remove()
      chartRef.current = null
    }
  }, [bars, overlays, height])

  // Update last candle on live tick
  useEffect(() => {
    if (!liveTick || !candleSeriesRef.current || !volumeSeriesRef.current) return
    const t = liveTick.timestamp.slice(0, 10) as Time
    candleSeriesRef.current.update({
      time: t,
      open: liveTick.price,   // use live price as close; open kept from last bar if available
      high: liveTick.price,
      low: liveTick.price,
      close: liveTick.price,
    })
    volumeSeriesRef.current.update({
      time: t,
      value: liveTick.volume,
      color: liveTick.change >= 0 ? 'rgba(22,163,74,0.4)' : 'rgba(220,38,38,0.4)',
    })
  }, [liveTick])

  return <div ref={containerRef} className="w-full" />
}
