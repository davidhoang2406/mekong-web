import type { ApiError } from './types'

// Base URL is empty in dev (Vite proxies /api → mekong-api) and in prod
// (Kong proxies /api). Override with VITE_API_BASE_URL if ever needed.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiRequestError extends Error {
  status: number
  code: string
  constructor(message: string, status: number, code: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
  }
}

export async function apiGet<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}/api/v1${path}`, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    let code = 'HTTP_ERROR'
    let message = `${res.status} ${res.statusText}`
    try {
      const body = (await res.json()) as ApiError
      if (body?.error) message = body.error
      if (body?.code) code = body.code
    } catch {
      // non-JSON error body — keep the status text
    }
    throw new ApiRequestError(message, res.status, code)
  }

  return (await res.json()) as T
}
