import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { OHLCVResponse } from '@/api/types'

export function useOHLCV(symbol: string, from: string, to: string) {
  return useQuery({
    queryKey: ['ohlcv', symbol, from, to],
    queryFn: () => apiGet<OHLCVResponse>('/ohlcv', { symbol, from, to }),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // OHLCV for past days is immutable
    gcTime: 30 * 60 * 1000,
  })
}
