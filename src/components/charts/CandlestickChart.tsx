import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  ColorType,
} from 'lightweight-charts'
import type { IChartApi, Time } from 'lightweight-charts'
import type { OHLCVBar } from '@/api/types'

export interface LineOverlay {
  name: string
  color: string
  data: { time: string; value: number }[]
}

interface Props {
  bars: OHLCVBar[]
  overlays?: LineOverlay[]
  height?: number
}

const day = (t: string): Time => t.slice(0, 10) as Time

/** TradingView Lightweight Charts wrapper: candles + volume + optional SMA overlays. */
export function CandlestickChart({ bars, overlays = [], height = 420 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = createChart(container, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      rightPriceScale: { borderColor: '#3f3f46' },
      timeScale: { borderColor: '#3f3f46', timeVisible: false },
      autoSize: true,
    })
    chartRef.current = chart

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })
    candles.setData(
      bars.map((b) => ({ time: day(b.time), open: b.open, high: b.high, low: b.low, close: b.close })),
    )

    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
    volume.setData(
      bars.map((b) => ({
        time: day(b.time),
        value: b.volume,
        color: b.close >= b.open ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
      })),
    )

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

  return <div ref={containerRef} className="w-full" />
}
