'use client'

import { useCookieConsent } from '@/context/CookieConsentContext'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function CookieBanner() {
  const {
    showBanner,
    isLoading,
    acceptAll,
    acceptNecessaryOnly,
    openSettings,
  } = useCookieConsent()

  // Don't render anything while loading or if user has already consented
  if (isLoading || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍪</span>
              <h3 className="text-base font-semibold text-gray-900">Cookie Settings</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            We use cookies to improve your experience on our website.{' '}
            <Link
              href={ROUTES.PRIVACY}
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 space-y-2">
          <button
            onClick={acceptAll}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Accept All
          </button>
          <div className="flex gap-2">
            <button
              onClick={acceptNecessaryOnly}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Necessary Only
            </button>
            <button
              onClick={openSettings}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
