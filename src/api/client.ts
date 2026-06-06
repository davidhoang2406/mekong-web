import type { ApiError } from './types'

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

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('mekong-token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let code = 'HTTP_ERROR'
    let message = `${res.status} ${res.statusText}`
    try {
      const body = (await res.json()) as ApiError
      if (body?.error) message = body.error
      if (body?.code) code = body.code
    } catch { /* non-JSON */ }
    throw new ApiRequestError(message, res.status, code)
  }
  return (await res.json()) as T
}

export async function apiGet<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}/api/v1${path}`, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json', ...authHeaders() },
  })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', ...authHeaders() },
  })
  return handleResponse<T>(res)
}
