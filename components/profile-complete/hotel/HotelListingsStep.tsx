'use client'

import { MutableRefObject } from 'react'
import { HotelBadgeIcon } from '@/components/ui'
import { PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import type { ListingFormData } from '@/lib/types'
import { ListingCard } from './ListingCard'

interface HotelListingsStepProps {
  listings: ListingFormData[]
  collapsedCards: Set<number>
  countryInputs: Record<number, string>
  countries: string[]
  imageInputRefs: MutableRefObject<(HTMLInputElement | null)[]>
  onAddListing: () => void
  onRemoveListing: (index: number) => void
  onToggleCollapse: (index: number) => void
  onUpdateListing: (index: number, field: keyof ListingFormData, value: ListingFormData[keyof ListingFormData]) => void
  onImageChange: (listingIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: (listingIndex: number, imageIndex: number) => void
  onCountryInputChange: (index: number, value: string) => void
}

export function HotelListingsStep({
  listings,
  collapsedCards,
  countryInputs,
  countries,
  imageInputRefs,
  onAddListing,
  onRemoveListing,
  onToggleCollapse,
  onUpdateListing,
  onImageChange,
  onRemoveImage,
  onCountryInputChange,
}: HotelListingsStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <HotelBadgeIcon active />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Property Listings</h3>
            <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
              {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Add at least one property listing <span className="font-semibold text-red-600">(required)</span>
          </p>
        </div>
      </div>

      {listings.length === 0 && (
        <div className="border border-primary-200 rounded-xl p-6 text-center bg-white shadow-sm border-dashed">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center">
            <HotelBadgeIcon />
          </div>
          <p className="text-primary-800 font-semibold mb-1 text-sm">No listings added yet</p>
          <p className="text-xs text-gray-600">Add at least one property listing to complete your profile.</p>
        </div>
      )}

      {listings.map((listing, index) => (
        <ListingCard
          key={index}
          listing={listing}
          index={index}
          isCollapsed={collapsedCards.has(index)}
          countryInput={countryInputs[index] || ''}
          countries={countries}
          imageInputRef={{ current: imageInputRefs.current[index] } as any}
          canRemove={listings.length > 1}
          onToggleCollapse={() => onToggleCollapse(index)}
          onRemove={() => onRemoveListing(index)}
          onUpdateListing={onUpdateListing}
          onImageChange={(e) => onImageChange(index, e)}
          onRemoveImage={(imageIndex) => onRemoveImage(index, imageIndex)}
          onCountryInputChange={onCountryInputChange}
        />
      ))}

      <button
        type="button"
        onClick={onAddListing}
        className="w-full py-3 border-2 border-dashed border-primary-200 rounded-lg text-primary-700 hover:border-primary-400 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-semibold text-sm group"
      >
        <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Add Another Property Listing
      </button>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
        <InformationCircleIcon className="w-5 h-5 text-primary-600" />
        <p className="leading-snug">
          All property information will be verified by our team before your listings go live.
        </p>
      </div>
    </div>
  )
}
