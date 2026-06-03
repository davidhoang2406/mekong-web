import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/screener', label: 'Screener', end: false },
  { to: '/digest', label: 'Digest', end: false },
]

export function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <span className="text-lg font-bold text-emerald-400">Mekong</span>
        <nav className="flex gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
