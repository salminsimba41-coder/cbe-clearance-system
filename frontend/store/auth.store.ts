import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Student, DepartmentOfficer } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  student: Student | null
  officer: DepartmentOfficer | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (
    token: string,
    user: User,
    student?: Student,
    officer?: DepartmentOfficer
  ) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      student: null,
      officer: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (token, user, student, officer) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cbe_token', token)
          localStorage.setItem('cbe_user', JSON.stringify(user))
        }
        set({
          token,
          user,
          student: student || null,
          officer: officer || null,
          isAuthenticated: true,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cbe_token')
          localStorage.removeItem('cbe_user')
        }
        set({
          token: null,
          user: null,
          student: null,
          officer: null,
          isAuthenticated: false,
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'cbe-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        student: state.student,
        officer: state.officer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
