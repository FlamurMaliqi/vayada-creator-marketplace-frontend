'use client'

import { MutableRefObject } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { HotelFormState, ListingFormData } from '@/lib/types'
import { FormNavigationButtons } from '../FormNavigationButtons'
import { HotelBasicInfoStep } from './HotelBasicInfoStep'
import { HotelListingsStep } from './HotelListingsStep'

interface HotelProfileFormProps {
  // Form state
  form: HotelFormState
  listings: ListingFormData[]

  // Step management
  currentStep: number
  totalSteps: number

  // UI state
  error: string
  submitting: boolean
  canProceed: boolean
  collapsedCards: Set<number>
  countryInputs: Record<number, string>
  countries: string[]

  // Refs
  imageInputRefs: MutableRefObject<(HTMLInputElement | null)[]>

  // Form handlers
  onFormChange: (updates: Partial<HotelFormState>) => void

  // Listing handlers
  onAddListing: () => void
  onRemoveListing: (index: number) => void
  onToggleCollapse: (index: number) => void
  onUpdateListing: (index: number, field: keyof ListingFormData, value: ListingFormData[keyof ListingFormData]) => void
  onImageChange: (listingIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (listingIndex: number, imageIndex: number) => void
  onCountryInputChange: (index: number, value: string) => void

  // Navigation handlers
  onPrevStep: () => void
  onNextStep: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function HotelProfileForm({
  form,
  listings,
  currentStep,
  totalSteps,
  error,
  submitting,
  canProceed,
  collapsedCards,
  countryInputs,
  countries,
  imageInputRefs,
  onFormChange,
  onAddListing,
  onRemoveListing,
  onToggleCollapse,
  onUpdateListing,
  onImageChange,
  onRemoveImage,
  onCountryInputChange,
  onPrevStep,
  onNextStep,
  onSubmit,
}: HotelProfileFormProps) {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === totalSteps) {
      onSubmit(e)
    } else {
      onNextStep()
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6"
      >
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <HotelBasicInfoStep
            form={form}
            onFormChange={onFormChange}
            error={error}
          />
        )}

        {/* Step 2: Property Listings Section */}
        {currentStep === 2 && (
          <HotelListingsStep
            listings={listings}
            collapsedCards={collapsedCards}
            countryInputs={countryInputs}
            countries={countries}
            imageInputRefs={imageInputRefs}
            onAddListing={onAddListing}
            onRemoveListing={onRemoveListing}
            onToggleCollapse={onToggleCollapse}
            onUpdateListing={onUpdateListing}
            onImageChange={onImageChange}
            onRemoveImage={onRemoveImage}
            onCountryInputChange={onCountryInputChange}
          />
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium whitespace-pre-line">{error}</p>
          </div>
        )}

        <FormNavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          submitting={submitting}
          canProceed={canProceed}
          onPrevious={onPrevStep}
          onNext={onNextStep}
          submitLabel="Complete Profile"
        />
      </form>
    </div>
  )
}
