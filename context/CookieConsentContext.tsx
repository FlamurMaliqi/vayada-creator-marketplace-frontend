'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { consentService } from '@/services/api/consent'

// Cookie consent categories
export interface CookieConsent {
  necessary: boolean  // Always true, cannot be disabled
  functional: boolean
  analytics: boolean
  marketing: boolean
}

// Context value type
interface CookieConsentContextType {
  consent: CookieConsent | null
  hasConsented: boolean
  isLoading: boolean
  showBanner: boolean
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  acceptAll: () => Promise<void>
  acceptNecessaryOnly: () => Promise<void>
  updateConsent: (consent: Partial<CookieConsent>) => Promise<void>
  openSettings: () => void
  closeSettings: () => void
}

const VISITOR_ID_KEY = 'vayada_visitor_id'
const CONSENT_KEY = 'vayada_cookie_consent'

// Generate a unique visitor ID
function generateVisitorId(): string {
  return 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Get or create visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  let visitorId = localStorage.getItem(VISITOR_ID_KEY)
  if (!visitorId) {
    visitorId = generateVisitorId()
    localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }
  return visitorId
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [hasConsented, setHasConsented] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Load consent from localStorage on mount
  useEffect(() => {
    const loadConsent = async () => {
      try {
        // Check localStorage first
        const storedConsent = localStorage.getItem(CONSENT_KEY)
        if (storedConsent) {
          const parsed = JSON.parse(storedConsent) as CookieConsent
          setConsent(parsed)
          setHasConsented(true)
          setShowBanner(false)
        } else {
          // No stored consent, show banner
          setShowBanner(true)
        }

        // Try to sync with backend
        const visitorId = getVisitorId()
        if (visitorId) {
          try {
            const backendConsent = await consentService.getCookieConsent(visitorId)
            if (backendConsent) {
              const consentData: CookieConsent = {
                necessary: backendConsent.necessary,
                functional: backendConsent.functional,
                analytics: backendConsent.analytics,
                marketing: backendConsent.marketing,
              }
              setConsent(consentData)
              setHasConsented(true)
              setShowBanner(false)
              localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData))
            }
          } catch {
            // Backend not available, use localStorage
          }
        }
      } catch (error) {
        console.error('Error loading cookie consent:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConsent()
  }, [])

  // Save consent to localStorage and backend
  const saveConsent = useCallback(async (newConsent: CookieConsent) => {
    // Always ensure necessary is true
    const finalConsent = { ...newConsent, necessary: true }

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(finalConsent))
    setConsent(finalConsent)
    setHasConsented(true)
    setShowBanner(false)
    setShowSettings(false)

    // Save to backend
    try {
      const visitorId = getVisitorId()
      await consentService.saveCookieConsent({
        visitor_id: visitorId,
        ...finalConsent,
      })
    } catch (error) {
      console.error('Error saving cookie consent to backend:', error)
      // Don't throw - localStorage save is enough for functionality
    }
  }, [])

  const acceptAll = useCallback(async () => {
    await saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  }, [saveConsent])

  const acceptNecessaryOnly = useCallback(async () => {
    await saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  }, [saveConsent])

  const updateConsent = useCallback(async (partialConsent: Partial<CookieConsent>) => {
    const currentConsent = consent || {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    await saveConsent({
      ...currentConsent,
      ...partialConsent,
      necessary: true, // Always true
    })
  }, [consent, saveConsent])

  const openSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsented,
        isLoading,
        showBanner,
        showSettings,
        setShowSettings,
        acceptAll,
        acceptNecessaryOnly,
        updateConsent,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}
