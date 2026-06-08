import { useState } from 'react'

// https://github.com/ErikThiart/cryptocurrency-icons — slugs verified against 32/ folder
const CRYPTO_SLUG: Record<string, string> = {
  BTC:  'bitcoin',
  ETH:  'ethereum',
  BNB:  'bnb',
  SOL:  'solana',
  XRP:  'xrp',
  DOGE: 'dogecoin',
  ADA:  'cardano',
  AVAX: 'avalanche',
  SHIB: 'shiba-inu',
  DOT:  'polkadot-new',
  MATIC:'polygon',
  LINK: 'chainlink',
  LTC:  'litecoin',
  TRX:  'tron',
  UNI:  'uniswap',
  ATOM: 'cosmos',
  TON:  'toncoin',
  BCH:  'bitcoin-cash',
  NEAR: 'near-protocol',
  APT:  'aptos',
}

const CDN = 'https://cdn.jsdelivr.net/gh/ErikThiart/cryptocurrency-icons@master/32'

const STOCK_COLORS = [
  '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981',
  '#ef4444', '#06b6d4', '#f97316', '#6366f1',
]

function stockColor(symbol: string): string {
  let h = 0
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) & 0xffff
  return STOCK_COLORS[h % STOCK_COLORS.length]
}

function baseTicker(symbol: string): string {
  return symbol.split('/')[0].toUpperCase()
}

function isCrypto(symbol: string, assetClass?: string): boolean {
  return assetClass === 'crypto' || symbol.includes('/')
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

  if (isCrypto(symbol, assetClass) && !errored) {
    const ticker = baseTicker(symbol)
    const slug = CRYPTO_SLUG[ticker]
    if (slug) {
      return (
        <img
          src={`${CDN}/${slug}.png`}
          alt={ticker}
          width={size}
          height={size}
          onError={() => setErrored(true)}
          className="rounded-full shrink-0"
          style={{ width: size, height: size }}
        />
      )
    }
  }

  const label = baseTicker(symbol).slice(0, 2)
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
