import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppLayout() {
  return (
    <div className="bg-bg text-fg">
      <Navbar />
      <Sidebar />
      <main className="ml-[240px] pt-[60px] px-6 pb-12 min-h-screen">
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
