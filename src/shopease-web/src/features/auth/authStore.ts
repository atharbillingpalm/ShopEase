import { create } from 'zustand'

type AuthUser = {
  userId:   number
  fullName: string
  email:    string
  role:     string
  token:    string
  expiresAt:string
}

type AuthStore = {
  user:    AuthUser | null
  isLoggedIn: boolean
  login:   (user: AuthUser) => void
  logout:  () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('shopease_user')
    ? JSON.parse(localStorage.getItem('shopease_user')!)
    : null,

  isLoggedIn: !!localStorage.getItem('shopease_user'),

  login: (user) => {
    localStorage.setItem('shopease_user', JSON.stringify(user))
    localStorage.setItem('token', user.token)
    set({ user, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('shopease_user')
    localStorage.removeItem('token')
    set({ user: null, isLoggedIn: false })
  },
}))