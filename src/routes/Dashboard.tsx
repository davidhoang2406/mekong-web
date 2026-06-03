import { LiveTickerBar } from '@/components/layout/LiveTickerBar'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { DigestTable } from '@/components/tables/DigestTable'
import { SymbolList } from '@/components/tables/SymbolList'
import { QueryState } from '@/components/common/QueryState'
import { useDigest } from '@/hooks/useDigest'
import { useSymbols } from '@/hooks/useSymbols'
import { isoDaysAgo } from '@/lib/format'

export function Dashboard() {
  // Daily digest is computed for completed days; default to yesterday.
  const date = isoDaysAgo(1)
  const digest = useDigest(date)
  const symbols = useSymbols()

  const byCategory = (cat: string) =>
    (digest.data?.digest ?? []).filter((e) => e.category === cat)

  return (
    <div className="space-y-4">
      <LiveTickerBar />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={`Top Gainers — ${date}`} />
          <CardBody className="p-0">
            <QueryState
              isLoading={digest.isLoading}
              error={digest.error}
              isEmpty={byCategory('gainers').length === 0}
            >
              <DigestTable entries={byCategory('gainers')} />
            </QueryState>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`Top Losers — ${date}`} />
          <CardBody className="p-0">
            <QueryState
              isLoading={digest.isLoading}
              error={digest.error}
              isEmpty={byCategory('losers').length === 0}
            >
              <DigestTable entries={byCategory('losers')} />
            </QueryState>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Volume Leaders" />
          <CardBody className="p-0">
            <QueryState
              isLoading={digest.isLoading}
              error={digest.error}
              isEmpty={byCategory('volume').length === 0}
            >
              <DigestTable entries={byCategory('volume')} />
            </QueryState>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Symbols" />
          <CardBody className="p-0">
            <QueryState
              isLoading={symbols.isLoading}
              error={symbols.error}
              isEmpty={(symbols.data?.symbols ?? []).length === 0}
            >
              <SymbolList symbols={symbols.data?.symbols ?? []} />
            </QueryState>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
