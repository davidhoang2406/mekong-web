import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { DigestResponse, LiveDigestResponse } from '@/api/types'

export function useDigest(date: string, category?: string, limit = 10) {
  return useQuery({
    queryKey: ['digest', date, category ?? 'all', limit],
    queryFn: () => apiGet<DigestResponse>('/digest', { date, category, limit: String(limit) }),
    enabled: !!date,
    staleTime: Infinity,
  })
}

export function useDigestLive(category?: string, limit = 10) {
  return useQuery({
    queryKey: ['digest-live', category ?? 'all', limit],
    queryFn: () => apiGet<LiveDigestResponse>('/digest/live', { category, limit: String(limit) }),
    refetchInterval: 5000,
    staleTime: 0,
  })
}
