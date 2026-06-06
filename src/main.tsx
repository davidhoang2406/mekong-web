import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout, AuthLayout } from '@/App'
import { Dashboard } from '@/routes/Dashboard'
import { Symbols } from '@/routes/Symbols'
import { SymbolDetail } from '@/routes/SymbolDetail'
import { Screener } from '@/routes/Screener'
import { Digest } from '@/routes/Digest'
import { Login } from '@/routes/Login'
import { Register } from '@/routes/Register'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'symbols', element: <Symbols /> },
      { path: 'symbol/:symbol', element: <SymbolDetail /> },
      { path: 'screener', element: <Screener /> },
      { path: 'digest', element: <Digest /> },
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
