export interface Watchlist {
  id: string
  user_id: string
  name: string
  symbols: string[]
  created_at: string
  updated_at: string
}

// TypeScript interfaces matching the mekong-api JSON responses.
// Nullable numeric fields (indicators, screener ratios) are `number | null`
// because the API serialises Go *float64 as JSON null when absent.

export interface SymbolInfo {
  symbol: string
  asset_class: string
  exchange: string
  first_date: string
  last_date: string
}

export interface SymbolsResponse {
  symbols: SymbolInfo[]
}

export interface OHLCVBar {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OHLCVResponse {
  symbol: string
  asset_class: string
  exchange: string
  bars: OHLCVBar[]
}

export interface IndicatorRow {
  time: string
  close: number
  sma20: number | null
  sma50: number | null
  sma200: number | null
  rsi14: number | null
  macd: number | null
  macd_signal: number | null
  macd_hist: number | null
  bb_upper: number | null
  bb_mid: number | null
  bb_lower: number | null
}

export interface IndicatorsResponse {
  symbol: string
  indicators: IndicatorRow[]
}

export interface DigestEntry {
  category: string
  rank: number
  symbol: string
  exchange: string
  asset_class: string
  open: number
  close: number
  volume: number
  pct_change: number
}

export interface DigestResponse {
  date: string
  digest: DigestEntry[]
  fallback?: boolean
}

export interface LiveDigestResponse {
  live: true
  as_of: string
  digest: DigestEntry[]
}

export interface ScreenerResult {
  symbol: string
  pe_ratio: number | null
  pb_ratio: number | null
  roe: number | null
  de_ratio: number | null
  current_ratio: number | null
}

export interface ScreenerResponse {
  year: string
  week: string
  results: ScreenerResult[]
}

// Phase 3 (WebSocket) — defined now so the live UI stubs can type against it.
export interface PriceSnapshot {
  symbol: string
  exchange: string
  price: number
  change: number
  pct_change: number
  volume: number
  bid: number
  ask: number
  timestamp: string
}

export interface ApiError {
  error: string
  code: string
  status: number
}
