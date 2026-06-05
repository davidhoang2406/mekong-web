// Number/date formatting helpers (VND prices, percentages, volume, dates).

const vnd = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

export function formatVND(value: number | null | undefined): string {
  if (value == null) return '—'
  return vnd.format(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—'
  return decimal.format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${decimal.format(value)}%`
}

export function formatVolume(value: number | null | undefined): string {
  if (value == null) return '—'
  return compact.format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  // API returns ISO timestamps or YYYY-MM-DD; show the date part.
  return value.slice(0, 10)
}

/** Short aliases used by redesigned route pages. */
export const fmtNum = (v: number | null | undefined) => v == null ? '—' : vnd.format(v)
export const fmtPct = (v: number | null | undefined) => v == null ? '—' : decimal.format(Math.abs(v))

/** ISO YYYY-MM-DD for `days` ago from today. */
export function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Tailwind text colour class for a signed change. */
export function changeColor(value: number | null | undefined): string {
  if (value == null || value === 0) return 'text-zinc-400'
  return value > 0 ? 'text-emerald-500' : 'text-red-500'
}
