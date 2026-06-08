import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client'
import type { Watchlist } from '@/api/types'

const KEY = ['watchlists']

export function useWatchlists() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => apiGet<{ watchlists: Watchlist[] | null }>('/watchlists'),
    select: (data) => data.watchlists ?? [],
    staleTime: 30_000,
  })
}

export function useCreateWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => apiPost<Watchlist>('/watchlists', { name, symbols: [] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, symbols }: { id: string; symbols: string[] }) =>
      apiPut<Watchlist>(`/watchlists/${id}`, { symbols }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiDelete<void>(`/watchlists/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
