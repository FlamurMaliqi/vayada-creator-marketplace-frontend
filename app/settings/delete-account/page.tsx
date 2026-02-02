'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthenticatedNavigation, ProfileWarningBanner } from '@/components/layout'
import { useSidebar } from '@/components/layout/AuthenticatedNavigation'
import { ROUTES } from '@/lib/constants'
import { consentService, GdprRequestStatusResponse } from '@/services/api/consent'
import {
  ArrowLeftIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export default function DeleteAccountPage() {
  const { isCollapsed } = useSidebar()
  const [deletionStatus, setDeletionStatus] = useState<GdprRequestStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  // Load deletion status
  useEffect(() => {
    const loadDeletionStatus = async () => {
      try {
        setIsLoading(true)
        const status = await consentService.getDeletionStatus()
        setDeletionStatus(status)
      } catch {
        // No existing deletion request
        setDeletionStatus(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeletionStatus()
  }, [])

  const handleRequestDeletion = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    try {
      setIsRequesting(true)
      setError(null)
      setSuccessMessage(null)

      const result = await consentService.requestAccountDeletion()
      setSuccessMessage(result.message)
      setConfirmDelete(false)
      setConfirmText('')

      // Reload status
      const status = await consentService.getDeletionStatus()
      setDeletionStatus(status)
    } catch (err) {
      console.error('Failed to request account deletion:', err)
      setError('Failed to request account deletion. Please try again later.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleCancelDeletion = async () => {
    try {
      setIsCancelling(true)
      setError(null)
      setSuccessMessage(null)

      const result = await consentService.cancelAccountDeletion()
      setSuccessMessage(result.message)

      // Reload status
      try {
        const status = await consentService.getDeletionStatus()
        setDeletionStatus(status)
      } catch {
        setDeletionStatus(null)
      }
    } catch (err) {
      console.error('Failed to cancel account deletion:', err)
      setError('Failed to cancel account deletion. Please try again later.')
    } finally {
      setIsCancelling(false)
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

  const getDaysUntilDeletion = (expiresAt: string | null) => {
    if (!expiresAt) return 0
    const now = new Date()
    const deletionDate = new Date(expiresAt)
    const diffTime = deletionDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const hasPendingDeletion = deletionStatus?.status === 'pending' || deletionStatus?.status === 'processing'

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
              <TrashIcon className="h-8 w-8 text-red-600" />
              <h1 className="text-4xl font-extrabold text-gray-900">
                Delete Account
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Request permanent deletion of your account (GDPR Article 17 - Right to Erasure)
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
              {/* Warning Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900 mb-2">Important: This action is irreversible</h3>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• All your personal data will be permanently deleted</li>
                      <li>• Your profile and account will no longer be accessible</li>
                      <li>• Active collaborations will be cancelled</li>
                      <li>• You will lose access to chat history and messages</li>
                      <li>• Some data may be anonymized for legal record-keeping requirements</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pending Deletion Status */}
              {hasPendingDeletion && deletionStatus && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">Deletion Scheduled</h3>
                      <p className="text-sm text-yellow-800 mb-4">
                        Your account is scheduled for deletion. You have{' '}
                        <strong>{getDaysUntilDeletion(deletionStatus.expires_at)} days</strong> to cancel this request.
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-700">Requested:</span>
                          <span className="text-yellow-900 font-medium">{formatDate(deletionStatus.requested_at)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-yellow-700">Scheduled deletion:</span>
                          <span className="text-yellow-900 font-medium">{formatDate(deletionStatus.expires_at)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCancelDeletion}
                        disabled={isCancelling}
                        className={`
                          px-4 py-2 text-sm font-medium rounded-lg transition-colors
                          ${isCancelling
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                          }
                        `}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Deletion Request'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed/Cancelled Status */}
              {deletionStatus && deletionStatus.status === 'cancelled' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <XCircleIcon className="h-6 w-6 text-gray-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Previous Request Cancelled</h3>
                      <p className="text-sm text-gray-600">
                        Your previous deletion request was cancelled on {formatDate(deletionStatus.processed_at || deletionStatus.requested_at)}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {deletionStatus && deletionStatus.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-900">Account Deleted</h3>
                      <p className="text-sm text-green-800">
                        Your account was deleted on {formatDate(deletionStatus.processed_at)}.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Deletion Form */}
              {!hasPendingDeletion && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Request Account Deletion</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you request deletion, your account will be scheduled for permanent deletion after a 30-day grace period.
                    During this time, you can cancel the request if you change your mind.
                  </p>

                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Request Account Deletion
                    </button>
                  ) : (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 font-medium">
                        To confirm, please type DELETE below:
                      </p>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleRequestDeletion}
                          disabled={isRequesting || confirmText !== 'DELETE'}
                          className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition-colors
                            ${isRequesting || confirmText !== 'DELETE'
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                            }
                          `}
                        >
                          {isRequesting ? 'Processing...' : 'Confirm Deletion'}
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDelete(false)
                            setConfirmText('')
                            setError(null)
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GDPR Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">About Right to Erasure (GDPR Article 17)</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Under GDPR, you have the right to request the deletion of your personal data. However, please note:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We provide a 30-day grace period to prevent accidental data loss</li>
                  <li>• Some data may be retained for legal compliance (e.g., tax records in Germany)</li>
                  <li>• Data shared in collaborations may be anonymized rather than deleted</li>
                  <li>• This action cannot be undone after the grace period expires</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
