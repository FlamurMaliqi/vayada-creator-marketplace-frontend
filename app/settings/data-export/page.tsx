'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { ROUTES } from '@/lib/constants'
import { consentService, GdprRequestStatusResponse } from '@/services/api/consent'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

export default function DataExportPage() {
  const { isCollapsed } = useSidebar()
  const [exportStatus, setExportStatus] = useState<GdprRequestStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load export status
  useEffect(() => {
    const loadExportStatus = async () => {
      try {
        setIsLoading(true)
        const status = await consentService.getExportStatus()
        setExportStatus(status)
      } catch {
        // No existing export request
        setExportStatus(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadExportStatus()
  }, [])

  const handleRequestExport = async () => {
    try {
      setIsRequesting(true)
      setError(null)
      setSuccessMessage(null)

      const result = await consentService.requestDataExport()
      setSuccessMessage(result.message)

      // Reload status
      const status = await consentService.getExportStatus()
      setExportStatus(status)
    } catch (err) {
      console.error('Failed to request data export:', err)
      setError('Failed to request data export. Please try again later.')
    } finally {
      setIsRequesting(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'processing':
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const canRequestNewExport = !exportStatus ||
    exportStatus.status === 'completed' ||
    exportStatus.status === 'expired' ||
    exportStatus.status === 'cancelled'

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <AuthenticatedNavigation />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16`}>
        <div className="pt-4">
          <ProfileWarningBanner />
        </div>

        <div className="max-w-4xl mx-auto pt-4 pb-8 px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href={ROUTES.SETTINGS_PRIVACY}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Privacy Settings</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <ArrowDownTrayIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-4xl font-extrabold text-gray-900">
                Export Your Data
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Download a copy of all your personal data (GDPR Article 20 - Right to Data Portability)
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">What data is included?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your profile information</li>
                  <li>• Social media connections and statistics</li>
                  <li>• Collaboration history</li>
                  <li>• Consent and privacy settings history</li>
                  <li>• Account activity logs</li>
                </ul>
              </div>

              {/* Current Export Status */}
              {exportStatus && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Export Request</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(exportStatus.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(exportStatus.status)}`}>
                          {exportStatus.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Requested</span>
                      <span className="text-sm text-gray-900">{formatDate(exportStatus.requested_at)}</span>
                    </div>

                    {exportStatus.processed_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Completed</span>
                        <span className="text-sm text-gray-900">{formatDate(exportStatus.processed_at)}</span>
                      </div>
                    )}

                    {exportStatus.expires_at && exportStatus.status === 'completed' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Download expires</span>
                        <span className="text-sm text-gray-900">{formatDate(exportStatus.expires_at)}</span>
                      </div>
                    )}
                  </div>

                  {exportStatus.status === 'completed' && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-4">
                        Your data export is ready for download. The download link will expire on {formatDate(exportStatus.expires_at)}.
                      </p>
                      <button
                        onClick={() => {
                          // In a real implementation, this would trigger the download
                          // with the download token from the backend
                          window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/gdpr/export-download?token=${localStorage.getItem('access_token')}`
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Download Export
                      </button>
                    </div>
                  )}

                  {(exportStatus.status === 'pending' || exportStatus.status === 'processing') && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Your export is being prepared. This may take a few minutes. You will be notified when it is ready.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Request New Export */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Request Data Export</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Request a copy of all your personal data in a machine-readable format (JSON).
                  The export will be available for download for 7 days.
                </p>

                <button
                  onClick={handleRequestExport}
                  disabled={isRequesting || !canRequestNewExport}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isRequesting || !canRequestNewExport
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                    }
                  `}
                >
                  {isRequesting ? 'Requesting...' : 'Request Export'}
                </button>

                {!canRequestNewExport && (
                  <p className="mt-2 text-sm text-yellow-600">
                    You already have a pending export request. Please wait for it to complete.
                  </p>
                )}
              </div>

              {/* GDPR Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">About Data Portability (GDPR Article 20)</h3>
                <p className="text-sm text-gray-600">
                  Under GDPR, you have the right to receive a copy of your personal data in a structured,
                  commonly used, and machine-readable format. This allows you to easily transfer your data
                  to another service provider if you choose.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
