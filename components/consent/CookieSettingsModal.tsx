'use client'

import { useState, useEffect } from 'react'
import { useCookieConsent, CookieConsent } from '@/context/CookieConsentContext'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

interface CookieCategoryProps {
  title: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  required?: boolean
}

function CookieCategory({
  title,
  description,
  enabled,
  onChange,
  disabled = false,
  required = false,
}: CookieCategoryProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {required && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Required
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => !disabled && onChange(!enabled)}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${enabled ? 'bg-primary-600' : 'bg-gray-200'}
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
              ${enabled ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  )
}

export function CookieSettingsModal() {
  const {
    consent,
    showSettings,
    closeSettings,
    updateConsent,
    acceptAll,
    acceptNecessaryOnly,
  } = useCookieConsent()

  // Local state for form
  const [localConsent, setLocalConsent] = useState<CookieConsent>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  // Initialize local state from context
  useEffect(() => {
    if (consent) {
      setLocalConsent(consent)
    }
  }, [consent])

  if (!showSettings) {
    return null
  }

  const handleSave = async () => {
    await updateConsent(localConsent)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeSettings}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Cookie Settings
            </h2>
            <button
              onClick={closeSettings}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to improve your experience on our website. You can choose which categories of cookies you want to allow.{' '}
              <Link
                href={ROUTES.PRIVACY}
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Learn more in our Privacy Policy
              </Link>
              .
            </p>

            <div className="space-y-1">
              <CookieCategory
                title="Necessary"
                description="Essential cookies required for basic website functionality. These cannot be disabled."
                enabled={true}
                onChange={() => {}}
                disabled={true}
                required={true}
              />

              <CookieCategory
                title="Functional"
                description="Cookies that enable enhanced features and personalization, such as remembering your preferences."
                enabled={localConsent.functional}
                onChange={(enabled) =>
                  setLocalConsent((prev) => ({ ...prev, functional: enabled }))
                }
              />

              <CookieCategory
                title="Analytics"
                description="Cookies that help us understand how visitors interact with our website, allowing us to improve our services."
                enabled={localConsent.analytics}
                onChange={(enabled) =>
                  setLocalConsent((prev) => ({ ...prev, analytics: enabled }))
                }
              />

              <CookieCategory
                title="Marketing"
                description="Cookies used to deliver personalized advertisements and measure the effectiveness of our marketing campaigns."
                enabled={localConsent.marketing}
                onChange={(enabled) =>
                  setLocalConsent((prev) => ({ ...prev, marketing: enabled }))
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 border-t border-gray-200 px-6 py-4">
            <button
              onClick={acceptNecessaryOnly}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Necessary Only
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieSettingsModal
