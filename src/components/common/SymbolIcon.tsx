import { useState } from 'react'

const STOCK_COLORS = [
  '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981',
  '#ef4444', '#06b6d4', '#f97316', '#6366f1',
]

function stockColor(symbol: string): string {
  let h = 0
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) & 0xffff
  return STOCK_COLORS[h % STOCK_COLORS.length]
}

function isCrypto(symbol: string, assetClass?: string): boolean {
  return assetClass === 'crypto' || symbol.includes('/')
}

function cryptoSlug(symbol: string): string {
  return symbol.split('/')[0].toLowerCase()
}

export function SymbolIcon({
  symbol,
  assetClass,
  size = 20,
}: {
  symbol: string
  assetClass?: string
  size?: number
}) {
  const [errored, setErrored] = useState(false)
  const crypto = isCrypto(symbol, assetClass)

  if (crypto && !errored) {
    const slug = cryptoSlug(symbol)
    return (
      <img
        src={`https://assets.coincap.io/assets/icons/${slug}@2x.png`}
        alt={slug}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className="rounded-full shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  const label = symbol.slice(0, 2).toUpperCase()
  const bg = stockColor(symbol)
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0 text-white font-bold"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      {label}
    </span>
  )
}
