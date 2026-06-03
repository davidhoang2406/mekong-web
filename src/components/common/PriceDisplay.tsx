import { changeColor, formatPercent, formatVND } from '@/lib/format'
import { cn } from '@/lib/cn'

interface Props {
  price: number | null | undefined
  change?: number | null
  pctChange?: number | null
  className?: string
}

export function PriceDisplay({ price, change, pctChange, className }: Props) {
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className="text-2xl font-semibold tabular-nums">{formatVND(price)}</span>
      {(change != null || pctChange != null) && (
        <span className={cn('text-sm font-medium tabular-nums', changeColor(pctChange ?? change))}>
          {change != null && `${change > 0 ? '+' : ''}${formatVND(change)} `}
          {pctChange != null && `(${formatPercent(pctChange)})`}
        </span>
      )}
    </div>
  )
}
