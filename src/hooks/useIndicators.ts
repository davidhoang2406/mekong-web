import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { IndicatorsResponse } from '@/api/types'

export function useIndicators(symbol: string, from: string, to: string) {
  return useQuery({
    queryKey: ['indicators', symbol, from, to],
    queryFn: () => apiGet<IndicatorsResponse>('/indicators', { symbol, from, to }),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
