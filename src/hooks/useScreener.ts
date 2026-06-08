import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { ScreenerResponse } from '@/api/types'

export function useScreener(year?: string, week?: string) {
  return useQuery({
    queryKey: ['screener', year ?? 'latest', week ?? 'latest'],
    queryFn: () => apiGet<ScreenerResponse>('/screener', { year, week }),
    staleTime: Infinity,
  })
}
