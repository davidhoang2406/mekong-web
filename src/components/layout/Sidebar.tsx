import { NavLink } from 'react-router-dom'
import { useTickerStore } from '@/stores/tickerStore'

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

const WS_DOT: Record<string, string> = {
  connected:    'bg-up live-dot',
  reconnecting: 'bg-yellow-400 live-dot',
  connecting:   'bg-yellow-400 live-dot',
  disconnected: 'bg-fg-muted',
}
const WS_LABEL: Record<string, string> = {
  connected:    'Live',
  reconnecting: 'Reconnecting',
  connecting:   'Connecting',
  disconnected: 'Offline',
}

export function Sidebar() {
  const connectionState = useTickerStore((s) => s.connectionState)

  return (
    <aside
      className={`fixed top-[60px] bottom-0 left-0 ${collapsed ? 'w-[56px]' : 'w-[240px]'} bg-bg border-r border-border flex flex-col z-20 transition-[width] duration-200`}
    >
      <nav className="flex-1 py-3 px-2 space-y-0.5 text-[14px] overflow-hidden">
        {NAV.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              isActive
                ? 'nav-active relative flex items-center gap-3 px-3 h-9 rounded-md font-medium'
                : 'flex items-center gap-3 px-3 h-9 rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors'
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              {icon}
            </svg>
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border px-4 py-3 flex items-center gap-2 text-[11px] font-mono">
        <span className={`h-1.5 w-1.5 rounded-full ${WS_DOT[connectionState] ?? 'bg-fg-muted'}`} />
        <span className="text-fg-muted">{WS_LABEL[connectionState] ?? 'Offline'}</span>
      </div>
    </aside>
  )
}
