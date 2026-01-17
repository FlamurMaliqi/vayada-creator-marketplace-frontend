/**
 * Hook for accessing authentication state from localStorage
 */

import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS } from '@/lib/constants/storage'
import type { UserType, UserStatus } from '@/lib/types'

export interface AuthState {
  isLoggedIn: boolean
  userId: string | null
  userEmail: string | null
  userName: string | null
  userType: UserType | null
  userStatus: UserStatus | null
  profileComplete: boolean
  hasProfile: boolean
  isLoading: boolean
}

export interface UseAuthReturn extends AuthState {
  setAuthState: (state: Partial<Omit<AuthState, 'isLoading'>>) => void
  clearAuth: () => void
  isHotel: boolean
  isCreator: boolean
  isAdmin: boolean
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [authState, setAuthStateInternal] = useState<Omit<AuthState, 'isLoading'>>({
    isLoggedIn: false,
    userId: null,
    userEmail: null,
    userName: null,
    userType: null,
    userStatus: null,
    profileComplete: false,
    hasProfile: false,
  })

  // Read auth state from localStorage after mount (SSR safety)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true'
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
      const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
      const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME)
      const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType | null
      const userStatus = localStorage.getItem(STORAGE_KEYS.USER_STATUS) as UserStatus | null
      const profileComplete = localStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE) === 'true'
      const hasProfile = localStorage.getItem(STORAGE_KEYS.HAS_PROFILE) === 'true'

      setAuthStateInternal({
        isLoggedIn,
        userId,
        userEmail,
        userName,
        userType,
        userStatus,
        profileComplete,
        hasProfile,
      })
    } catch (error) {
      console.warn('Error reading auth state from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (event: StorageEvent) => {
      const authKeys = Object.values(STORAGE_KEYS)
      if (event.key && authKeys.includes(event.key as typeof authKeys[number])) {
        // Re-read all auth state on any auth-related storage change
        const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true'
        const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
        const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)
        const userName = localStorage.getItem(STORAGE_KEYS.USER_NAME)
        const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE) as UserType | null
        const userStatus = localStorage.getItem(STORAGE_KEYS.USER_STATUS) as UserStatus | null
        const profileComplete = localStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETE) === 'true'
        const hasProfile = localStorage.getItem(STORAGE_KEYS.HAS_PROFILE) === 'true'

        setAuthStateInternal({
          isLoggedIn,
          userId,
          userEmail,
          userName,
          userType,
          userStatus,
          profileComplete,
          hasProfile,
        })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Update auth state in localStorage
  const setAuthState = useCallback((state: Partial<Omit<AuthState, 'isLoading'>>) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      if (state.isLoggedIn !== undefined) {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(state.isLoggedIn))
      }
      if (state.userId !== undefined) {
        if (state.userId) {
          localStorage.setItem(STORAGE_KEYS.USER_ID, state.userId)
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_ID)
        }
      }
      if (state.userEmail !== undefined) {
        if (state.userEmail) {
          localStorage.setItem(STORAGE_KEYS.USER_EMAIL, state.userEmail)
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
        }
      }
      if (state.userName !== undefined) {
        if (state.userName) {
          localStorage.setItem(STORAGE_KEYS.USER_NAME, state.userName)
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_NAME)
        }
      }
      if (state.userType !== undefined) {
        if (state.userType) {
          localStorage.setItem(STORAGE_KEYS.USER_TYPE, state.userType)
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
        }
      }
      if (state.userStatus !== undefined) {
        if (state.userStatus) {
          localStorage.setItem(STORAGE_KEYS.USER_STATUS, state.userStatus)
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_STATUS)
        }
      }
      if (state.profileComplete !== undefined) {
        localStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETE, String(state.profileComplete))
      }
      if (state.hasProfile !== undefined) {
        localStorage.setItem(STORAGE_KEYS.HAS_PROFILE, String(state.hasProfile))
      }

      setAuthStateInternal((prev) => ({ ...prev, ...state }))
    } catch (error) {
      console.warn('Error updating auth state in localStorage:', error)
    }
  }, [])

  // Clear all auth state
  const clearAuth = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      localStorage.removeItem(STORAGE_KEYS.USER_NAME)
      localStorage.removeItem(STORAGE_KEYS.USER_TYPE)
      localStorage.removeItem(STORAGE_KEYS.USER_STATUS)
      localStorage.removeItem(STORAGE_KEYS.PROFILE_COMPLETE)
      localStorage.removeItem(STORAGE_KEYS.HAS_PROFILE)
      localStorage.removeItem(STORAGE_KEYS.USER)

      setAuthStateInternal({
        isLoggedIn: false,
        userId: null,
        userEmail: null,
        userName: null,
        userType: null,
        userStatus: null,
        profileComplete: false,
        hasProfile: false,
      })
    } catch (error) {
      console.warn('Error clearing auth state from localStorage:', error)
    }
  }, [])

  return {
    ...authState,
    isLoading,
    setAuthState,
    clearAuth,
    isHotel: authState.userType === 'hotel',
    isCreator: authState.userType === 'creator',
    isAdmin: authState.userType === 'admin',
  }
}
