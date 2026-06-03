import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-zinc-950 text-zinc-300">
          <h1 className="text-lg font-semibold text-red-400">Something went wrong</h1>
          <p className="text-sm text-zinc-500">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
