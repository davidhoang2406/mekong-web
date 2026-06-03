import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
