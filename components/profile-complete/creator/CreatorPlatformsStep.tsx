'use client'

import { LinkIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { PLATFORM_OPTIONS } from '@/lib/constants'
import type { PlatformFormData } from '@/lib/types'
import { PlatformCard } from './PlatformCard'

interface CreatorPlatformsStepProps {
  platforms: PlatformFormData[]
  expandedPlatforms: Set<number>
  platformCountryInputs: Record<number, string>
  onAddPlatform: (name: string) => void
  onRemovePlatform: (index: number) => void
  onUpdatePlatform: (index: number, field: keyof PlatformFormData, value: PlatformFormData[keyof PlatformFormData]) => void
  onTogglePlatformExpanded: (index: number) => void
  onCountryInputChange: (platformIndex: number, value: string) => void
  onAddCountry: (platformIndex: number, country?: string) => void
  onRemoveCountry: (platformIndex: number, countryIndex: number) => void
  onUpdateCountryPercentage: (platformIndex: number, countryIndex: number, percentage: number) => void
  onToggleAgeGroup: (platformIndex: number, ageRange: string) => void
  onUpdateGenderSplit: (platformIndex: number, field: 'male' | 'female', value: string) => void
  getAvailableCountries: (platformIndex: number) => string[]
}

export function CreatorPlatformsStep({
  platforms,
  expandedPlatforms,
  platformCountryInputs,
  onAddPlatform,
  onRemovePlatform,
  onUpdatePlatform,
  onTogglePlatformExpanded,
  onCountryInputChange,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountryPercentage,
  onToggleAgeGroup,
  onUpdateGenderSplit,
  getAvailableCountries,
}: CreatorPlatformsStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center shadow-sm">
            <LinkIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Connect Your Platforms</h3>
            <p className="text-sm text-gray-600">
              Link your accounts and define your audience per platform
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700">
          Add at least one platform with audience demographics to help match you with the right properties.
        </p>

        {/* Platform Cards Grid */}
        <div className="space-y-3 mt-4">
          {PLATFORM_OPTIONS.map((platformName) => (
            <PlatformCard
              key={platformName}
              platformName={platformName}
              platforms={platforms}
              allPlatforms={platforms}
              expandedPlatforms={expandedPlatforms}
              platformCountryInputs={platformCountryInputs}
              onAddPlatform={onAddPlatform}
              onRemovePlatform={onRemovePlatform}
              onUpdatePlatform={onUpdatePlatform}
              onTogglePlatformExpanded={onTogglePlatformExpanded}
              onCountryInputChange={onCountryInputChange}
              onAddCountry={onAddCountry}
              onRemoveCountry={onRemoveCountry}
              onUpdateCountryPercentage={onUpdateCountryPercentage}
              onToggleAgeGroup={onToggleAgeGroup}
              onUpdateGenderSplit={onUpdateGenderSplit}
              getAvailableCountries={getAvailableCountries}
            />
          ))}
        </div>

        {/* Error Message */}
        {platforms.length === 0 && (
          <p className="text-center text-orange-700 font-medium text-sm mt-4">
            Connect at least one platform to complete your profile
          </p>
        )}

        {/* Info Box */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
          <InformationCircleIcon className="w-5 h-5 text-primary-600" />
          <p className="leading-snug">
            All data should be verifiable via platform insights (e.g., Instagram Insights, YouTube Analytics).
          </p>
        </div>
      </div>
    </div>
  )
}
