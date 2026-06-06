import { create } from 'zustand'

interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('mekong-token'),
  user: (() => {
    try { return JSON.parse(localStorage.getItem('mekong-user') ?? 'null') } catch { return null }
  })(),

  setAuth(token, user) {
    localStorage.setItem('mekong-token', token)
    localStorage.setItem('mekong-user', JSON.stringify(user))
    set({ token, user })
  },

  clearAuth() {
    localStorage.removeItem('mekong-token')
    localStorage.removeItem('mekong-user')
    set({ token: null, user: null })
  },
}))
