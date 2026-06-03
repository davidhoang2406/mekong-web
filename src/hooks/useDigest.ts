import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { DigestResponse } from '@/api/types'

export function useDigest(date: string, category?: string) {
  return useQuery({
    queryKey: ['digest', date, category ?? 'all'],
    queryFn: () => apiGet<DigestResponse>('/digest', { date, category, limit: '10' }),
    enabled: !!date,
    staleTime: Infinity, // a past day's digest never changes
  })
}
