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

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const connectionState = useTickerStore((s) => s.connectionState)
  const dotColor =
    connectionState === 'connected' ? 'bg-up live-dot' :
    connectionState === 'reconnecting' ? 'bg-yellow-400 live-dot' : 'bg-fg-muted'
  const connLabel =
    connectionState === 'connected' ? 'connected' :
    connectionState === 'reconnecting' ? 'reconnecting…' : 'disconnected'

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

      <div className="border-t border-border px-2 py-2 space-y-1">
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center gap-3 px-3 h-9 rounded-md text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            {collapsed
              ? <><path d="M13 17l5-5-5-5"/><path d="M6 17l5-5-5-5"/></>
              : <><path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/></>
            }
          </svg>
          {!collapsed && <span className="text-[13px]">Collapse</span>}
        </button>

        <div className={`flex items-center gap-2 px-3 py-1 text-[12px] ${collapsed ? 'justify-center' : ''}`}>
          <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
          {!collapsed && <span className="text-fg-muted truncate">{connLabel}</span>}
        </div>
      </div>
    </aside>
  )
}
