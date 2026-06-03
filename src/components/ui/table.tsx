import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="text-xs uppercase tracking-wide text-zinc-500">{children}</thead>
}

export function TH({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        'border-b border-zinc-800 px-3 py-2 text-left font-medium',
        onClick && 'cursor-pointer select-none hover:text-zinc-300',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function TD({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('border-b border-zinc-900 px-3 py-2', className)}>{children}</td>
}

export function TR({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('hover:bg-zinc-800/40', className)}>{children}</tr>
}
