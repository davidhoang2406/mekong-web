import { useState } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Tabs } from '@/components/ui/tabs'
import { DigestTable } from '@/components/tables/DigestTable'
import { DateRangePicker } from '@/components/common/DateRangePicker'
import { QueryState } from '@/components/common/QueryState'
import { useDigest } from '@/hooks/useDigest'
import { DIGEST_CATEGORIES, type DigestCategory } from '@/lib/constants'
import { isoDaysAgo, todayISO } from '@/lib/format'

export function Digest() {
  const [date, setDate] = useState(isoDaysAgo(1))
  const [tab, setTab] = useState<DigestCategory>('gainers')
  const digest = useDigest(date)

  const entries = (digest.data?.digest ?? []).filter((e) => e.category === tab)

  return (
    <Card>
      <CardHeader
        title="Daily Digest"
        action={
          <div className="flex items-center gap-3">
            <Tabs tabs={DIGEST_CATEGORIES} active={tab} onChange={setTab} />
            <DateRangePicker value={date} max={todayISO()} onChange={setDate} />
          </div>
        }
      />
      <CardBody className="p-0">
        <QueryState
          isLoading={digest.isLoading}
          error={digest.error}
          isEmpty={entries.length === 0}
          emptyLabel="No digest data for this date"
        >
          <DigestTable entries={entries} />
        </QueryState>
      </CardBody>
    </Card>
  )
}
