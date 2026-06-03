import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/api/client'
import type { SymbolsResponse } from '@/api/types'

export function useSymbols(assetClass?: string) {
  return useQuery({
    queryKey: ['symbols', assetClass ?? 'all'],
    queryFn: () => apiGet<SymbolsResponse>('/symbols', { asset_class: assetClass }),
    staleTime: 10 * 60 * 1000,
  })
}
