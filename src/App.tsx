import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-bg text-fg">
      <Navbar />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className={`${collapsed ? 'ml-[56px]' : 'ml-[240px]'} pt-[60px] px-6 pb-12 min-h-screen transition-[margin] duration-200`}>
        <Outlet />
      </main>
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-bg-muted">
      <Outlet />
    </div>
  )
}
