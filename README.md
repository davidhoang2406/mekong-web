# mekong-web

React dashboard for the Mekong market-data platform (Phase 2). Renders historical
charts and tables from `mekong-api`; live data (WebSocket) arrives in Phase 3.

## Stack

- React 19 + TypeScript, Vite
- React Router v7, TanStack Query (REST caching)
- TradingView Lightweight Charts (candles) + Recharts (RSI/MACD/sparklines)
- Tailwind CSS v4

## Pages

| Route | Content |
|---|---|
| `/` | Dashboard — top gainers/losers/volume + symbol list |
| `/symbol/:symbol` | Candlestick + SMA overlays, RSI & MACD sub-charts, price panel |
| `/screener` | Sortable weekly fundamental screener (week selector) |
| `/digest` | Daily gainers/losers/volume tabs (date picker) |
| `/settings` | Placeholder |

Live ticker / live price are stubbed pending the Phase 3 WebSocket server (`mekong-ws`).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173 — Vite proxies /api → :8090, /ws → :8091
npm run lint
npm run type-check
npm run build
```

Requires `mekong-api` running on `:8090` (see `mekong-infra` docker-compose, or run it directly).

## Configuration

| Env | Default | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | _(empty)_ | API origin. Empty = same-origin; dev uses the Vite proxy, prod uses Kong. |

## Production

Built to static files and served by nginx (`Dockerfile` + `nginx.conf`). Kong proxies
`/` to this container and `/api` to `mekong-api`. See `mekong-infra`.
