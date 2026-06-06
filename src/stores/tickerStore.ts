import { create } from 'zustand'

export interface Tick {
  type: string
  symbol: string
  exchange: string
  asset_class: string
  price: number
  change: number
  pct_change: number
  volume: number
  bid: number
  ask: number
  timestamp: string
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

interface TickerState {
  prices: Record<string, Tick>
  connectionState: ConnectionState
  subscribe: (symbols: string[]) => void
  unsubscribe: (symbols: string[]) => void
  _onTick: (tick: Tick) => void
  _setConnectionState: (s: ConnectionState) => void
}

// Stocks update every 30s — mark stale after 2 minutes (4 missed cycles).
// Crypto runs 24/7 at 5s so it stays fresh naturally.
const TICK_MAX_AGE_MS = 120_000

export function isFreshTick(tick: Tick): boolean {
  return Date.now() - new Date(tick.timestamp).getTime() < TICK_MAX_AGE_MS
}

const WS_URL = '/ws'
const RECONNECT_BASE_MS = 1000
const RECONNECT_MAX_MS = 30000

let ws: WebSocket | null = null
const subscriptions: Set<string> = new Set()
let reconnectDelay = RECONNECT_BASE_MS

function connect(store: TickerState) {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

  store._setConnectionState('connecting')
  ws = new WebSocket(WS_URL)

  ws.onopen = () => {
    reconnectDelay = RECONNECT_BASE_MS
    store._setConnectionState('connected')
    if (subscriptions.size > 0) {
      ws!.send(JSON.stringify({ action: 'subscribe', symbols: [...subscriptions] }))
    }
  }

  ws.onmessage = (e) => {
    try {
      const tick: Tick = JSON.parse(e.data)
      if (tick.type === 'tick') store._onTick(tick)
    } catch { /* ignore parse errors */ }
  }

  ws.onclose = () => {
    ws = null
    if (subscriptions.size > 0) {
      store._setConnectionState('reconnecting')
      setTimeout(() => {
        reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX_MS)
        connect(store)
      }, reconnectDelay)
    } else {
      store._setConnectionState('disconnected')
    }
  }

  ws.onerror = () => {
    ws?.close()
  }
}

export const useTickerStore = create<TickerState>((set, get) => ({
  prices: {},
  connectionState: 'disconnected',

  _onTick: (tick) => set((s) => ({ prices: { ...s.prices, [tick.symbol]: tick } })),
  _setConnectionState: (connectionState) => set({ connectionState }),

  subscribe(symbols) {
    const store = get()
    symbols.forEach((s) => subscriptions.add(s))
    connect(store)
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'subscribe', symbols }))
    }
  },

  unsubscribe(symbols) {
    symbols.forEach((s) => subscriptions.delete(s))
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'unsubscribe', symbols }))
    }
    // Keep the connection open — closing on empty subscriptions causes a
    // reconnect on every route navigation since components unmount briefly.
  },
}))
