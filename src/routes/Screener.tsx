import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScreenerTable } from '@/components/tables/ScreenerTable'
import { QueryState } from '@/components/common/QueryState'
import { useScreener } from '@/hooks/useScreener'

/** ISO week number (1–53) for a date. */
function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  const diff = (date.getTime() - firstThursday.getTime()) / 86400000
  return 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
}

const now = new Date()

export function Screener() {
  const [year, setYear] = useState(String(now.getFullYear()))
  const [week, setWeek] = useState(String(isoWeek(now)).padStart(2, '0'))

  const screener = useScreener(year, week)

  const step = (delta: number) => {
    const w = parseInt(week, 10) + delta
    if (w >= 1 && w <= 53) setWeek(String(w).padStart(2, '0'))
  }

  return (
    <Card>
      <CardHeader
        title="Weekly Screener"
        action={
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Button onClick={() => step(-1)}>‹</Button>
            <span className="tabular-nums">
              {year}-W{week}
            </span>
            <Button onClick={() => step(1)}>›</Button>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-16 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200"
            />
          </div>
        }
      />
      <CardBody className="p-0">
        <QueryState
          isLoading={screener.isLoading}
          error={screener.error}
          isEmpty={(screener.data?.results ?? []).length === 0}
          emptyLabel="No screener data for this week"
        >
          <ScreenerTable results={screener.data?.results ?? []} />
        </QueryState>
      </CardBody>
    </Card>
  )
}
