import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from '@/App'
import { Dashboard } from '@/routes/Dashboard'
import { SymbolDetail } from '@/routes/SymbolDetail'
import { Screener } from '@/routes/Screener'
import { Digest } from '@/routes/Digest'
import { Settings } from '@/routes/Settings'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'symbol/:symbol', element: <SymbolDetail /> },
      { path: 'screener', element: <Screener /> },
      { path: 'digest', element: <Digest /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)
