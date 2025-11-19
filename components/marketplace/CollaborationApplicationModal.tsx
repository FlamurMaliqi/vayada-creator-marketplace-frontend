'use client'

import { useState } from 'react'
import { Button, Textarea } from '@/components/ui'
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface CollaborationApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CollaborationApplicationData) => void
  hotelName?: string
}

export interface CollaborationApplicationData {
  whyGreatFit: string
  travelDateFrom?: string
  travelDateTo?: string
  preferredMonths: string[]
  platforms: string[]
  deliverables: string[]
  consent: boolean
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube']
const DELIVERABLE_OPTIONS = [
  'Instagram Post',
  'Story Set (10+ stories)',
  'YouTube Video',
  'Instagram Reel',
  'TikTok Video',
  'Photo Pack (20+ images)',
]

export function CollaborationApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  hotelName,
}: CollaborationApplicationModalProps) {
  const [whyGreatFit, setWhyGreatFit] = useState('')
  const [travelDateFrom, setTravelDateFrom] = useState('')
  const [travelDateTo, setTravelDateTo] = useState('')
  const [preferredMonths, setPreferredMonths] = useState<string[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedDeliverable, setSelectedDeliverable] = useState<string>('')
  const [consent, setConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleMonthToggle = (month: string) => {
    setPreferredMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }

  const handleSubmit = () => {
    if (!whyGreatFit.trim() || !selectedPlatform || !selectedDeliverable || !consent) {
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        whyGreatFit,
        travelDateFrom: travelDateFrom || undefined,
        travelDateTo: travelDateTo || undefined,
        preferredMonths,
        platforms: [selectedPlatform],
        deliverables: [selectedDeliverable],
        consent,
      })
      // Reset form
      setWhyGreatFit('')
      setTravelDateFrom('')
      setTravelDateTo('')
      setPreferredMonths([])
      setSelectedPlatform('')
      setSelectedDeliverable('')
      setConsent(true)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const handleCancel = () => {
    setWhyGreatFit('')
    setTravelDateFrom('')
    setTravelDateTo('')
    setPreferredMonths([])
    setSelectedPlatform('')
    setSelectedDeliverable('')
    setConsent(true)
    onClose()
  }

  const characterCount = whyGreatFit.length
  const maxCharacters = 500

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-2xl font-bold text-gray-900">Apply for Collaboration</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8">
          {/* Why are you a great fit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-base font-medium text-gray-900">
                Why are you a great fit for this collaboration? <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                ({characterCount}/{maxCharacters})
              </span>
            </div>
            <Textarea
              value={whyGreatFit}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= maxCharacters) {
                  setWhyGreatFit(value)
                }
              }}
              rows={6}
              placeholder="Share your content style, audience demographics, and why you're excited about this hotel..."
              className="resize-y"
            />
          </div>

          {/* Preferred Travel Dates */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Preferred Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={travelDateFrom}
                    onChange={(e) => setTravelDateFrom(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={travelDateTo}
                    onChange={(e) => setTravelDateTo(e.target.value)}
                    min={travelDateFrom}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Or select preferred months</p>
              <div className="grid grid-cols-4 gap-2">
                {MONTHS.map((month) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthToggle(month)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      preferredMonths.includes(month)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Platforms where I'll post <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {PLATFORM_OPTIONS.map((platform) => (
                <label key={platform} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="platform"
                    value={platform}
                    checked={selectedPlatform === platform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-base font-medium text-gray-900 mb-3">
              Deliverables I can offer <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {DELIVERABLE_OPTIONS.map((deliverable) => (
                <label key={deliverable} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="deliverable"
                    value={deliverable}
                    checked={selectedDeliverable === deliverable}
                    onChange={(e) => setSelectedDeliverable(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700 text-sm">{deliverable}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                I consent to sharing my contact information with the hotel if my application is accepted
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={
                !whyGreatFit.trim() ||
                !selectedPlatform ||
                !selectedDeliverable ||
                !consent
              }
            >
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

