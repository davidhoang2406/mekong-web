import { NavLink } from 'react-router-dom'

const NAV = [
  {
    to: '/', label: 'Dashboard', exact: true,
    icon: <><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></>,
  },
  {
    to: '/symbols', label: 'Symbols',
    icon: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
  },
  {
    to: '/screener', label: 'Screener',
    icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></>,
  },
  {
    to: '/digest', label: 'Digest',
    icon: <path d="M3 7h18M3 12h18M3 17h12"/>,
  },
]

export function Sidebar() {
  return (
    <aside className="fixed top-[60px] bottom-0 left-0 w-[240px] bg-bg border-r border-border flex flex-col z-20">
      <nav className="flex-1 py-3 px-2 space-y-0.5 text-[14px]">
        {NAV.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              isActive
                ? 'nav-active relative flex items-center gap-3 px-3 h-9 rounded-md font-medium'
                : 'flex items-center gap-3 px-3 h-9 rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors'
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3 flex items-center gap-2 text-[12px]">
        <span className="h-2 w-2 rounded-full bg-up live-dot" />
        <span className="text-fg-muted">connected</span>
      </div>
    </aside>
  )
}
