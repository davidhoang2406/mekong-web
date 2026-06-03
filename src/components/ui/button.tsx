import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

export function Button({ active, className, ...props }: Props) {
  return (
    <button
      className={cn(
        'rounded px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'bg-emerald-600 text-white'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
        className,
      )}
      {...props}
    />
  )
}
