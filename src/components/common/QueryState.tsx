import type { ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { ApiRequestError } from '@/api/client'

interface Props {
  isLoading: boolean
  error: unknown
  isEmpty?: boolean
  emptyLabel?: string
  children: ReactNode
}

/** Shared loading / error / empty wrapper for query-backed views. */
export function QueryState({ isLoading, error, isEmpty, emptyLabel = 'No data', children }: Props) {
  if (isLoading) return <LoadingSpinner />
  if (error) {
    const msg =
      error instanceof ApiRequestError
        ? error.status === 404
          ? 'No data found.'
          : error.message
        : 'Something went wrong.'
    return <div className="py-8 text-center text-sm text-red-400">{msg}</div>
  }
  if (isEmpty) return <div className="py-8 text-center text-sm text-zinc-500">{emptyLabel}</div>
  return <>{children}</>
}
