export const TIME_RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: 3650 },
] as const

export type TimeRangeLabel = (typeof TIME_RANGES)[number]['label']

export const DEFAULT_RANGE_DAYS = 90

export const DIGEST_CATEGORIES = ['gainers', 'losers', 'volume'] as const
export type DigestCategory = (typeof DIGEST_CATEGORIES)[number]
