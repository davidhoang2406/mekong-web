import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { DigestResponse } from '@/api/types'

export function useDigest(date: string, category?: string, limit = 10) {
  return useQuery({
    queryKey: ['digest', date, category ?? 'all', limit],
    queryFn: () => apiGet<DigestResponse>('/digest', { date, category, limit: String(limit) }),
    enabled: !!date,
    staleTime: Infinity,
  })
}
