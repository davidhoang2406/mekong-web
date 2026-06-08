import { useState, useEffect, useRef } from 'react'
import { useScreener } from '@/hooks/useScreener'
import { SkeletonTable } from '@/components/common/SkeletonTable'
import { ScreenerTable } from '@/components/tables/ScreenerTable'

function currentISOWeek(): number {
  const d = new Date()
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function WeekDropdown({
  year,
  week,
  onChange,
}: {
  year: string
  week: string
  onChange: (y: string, w: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const maxWeek = currentISOWeek()
  const weeks = Array.from({ length: maxWeek }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 rounded-md border border-border text-[13px] hover:bg-bg-muted flex items-center gap-1.5"
      >
        Week <b>{week}</b>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-28 rounded-md border border-border bg-bg shadow-md overflow-auto max-h-56">
          {weeks.map(w => (
            <button
              key={w}
              onClick={() => { onChange(year, w); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-bg-muted ${w === week ? 'font-semibold text-accent' : ''}`}
            >
              Week {w}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Screener() {
  const [selectedYear, setSelectedYear] = useState<string | undefined>()
  const [selectedWeek, setSelectedWeek] = useState<string | undefined>()

  const { data, isLoading } = useScreener(selectedYear, selectedWeek)

  useEffect(() => {
    if (data && !selectedYear && !selectedWeek) {
      setSelectedYear(data.year)
      setSelectedWeek(data.week)
    }
  }, [data, selectedYear, selectedWeek])

  const displayYear = selectedYear ?? data?.year ?? '—'
  const displayWeek = selectedWeek ?? data?.week ?? '—'
  const results = data?.results ?? []

  function handleWeekChange(y: string, w: string) {
    setSelectedYear(y)
    setSelectedWeek(w)
  }

  return (
    <div>
      <div className="flex items-end justify-between mt-5 mb-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Fundamental Screener</h1>
          <p className="text-[13px] text-fg-muted mt-1">
            Weekly P/E, P/B, ROE, D/E filter — refreshed every Monday 09:00 ICT
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 mb-4">
        <button className="h-9 px-3 rounded-md border border-border text-[13px] hover:bg-bg-muted flex items-center gap-1.5">
          Year <b>{displayYear}</b>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {displayYear !== '—' && displayWeek !== '—' && (
          <WeekDropdown
            year={displayYear}
            week={displayWeek}
            onChange={(y, w) => { setSelectedYear(y); setSelectedWeek(w) }}
          />
        )}
      </div>

      <div className="card bg-bg border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <SkeletonTable rows={8} cols={6} />
        ) : results.length === 0 ? (
          <p className="p-6 text-[13px] text-fg-muted text-center">
            No screener data for week {displayYear}-W{displayWeek}
          </p>
        ) : (
          <ScreenerTable results={results} />
        )}
      </div>
    </div>
  )
}
