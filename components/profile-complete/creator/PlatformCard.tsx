'use client'

import { Input } from '@/components/ui'
import { PLATFORM_OPTIONS } from '@/lib/constants'
import type { PlatformFormData } from '@/lib/types'
import { PlatformDemographics } from './PlatformDemographics'

interface PlatformCardProps {
  platformName: string
  platforms: PlatformFormData[]
  allPlatforms: PlatformFormData[]
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

const platformColors: Record<string, string> = {
  Instagram: 'from-yellow-400 via-pink-500 to-purple-600',
  TikTok: 'from-gray-900 to-gray-800',
  YouTube: 'from-red-600 to-red-500',
  Facebook: 'from-blue-600 to-blue-500',
}

function PlatformIcon({ name }: { name: string }) {
  if (name === 'Instagram') {
    return (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
      </svg>
    )
  }
  if (name === 'TikTok') {
    return (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.96-.1z" />
      </svg>
    )
  }
  if (name === 'YouTube') {
    return (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }
  return (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function PlatformCard({
  platformName,
  platforms,
  allPlatforms,
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
}: PlatformCardProps) {
  // Get all platforms of this type
  const platformsOfThisType = platforms.filter((p) => p.name === platformName)
  const hasPlatforms = platformsOfThisType.length > 0

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
      {/* Platform Header */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-white bg-gradient-to-br ${platformColors[platformName] || 'from-gray-500 to-gray-400'}`}>
            <PlatformIcon name={platformName} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{platformName}</p>
            {hasPlatforms && (
              <p className="text-xs text-gray-500 mt-0.5">
                {platformsOfThisType.length} {platformsOfThisType.length === 1 ? 'account' : 'accounts'} added
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddPlatform(platformName)}
          className="px-4 py-2 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
        >
          Add Account
        </button>
      </div>

      {/* Show all platforms of this type */}
      {platformsOfThisType.length > 0 && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {platformsOfThisType.map((platform, idx) => {
            // Find the actual index in allPlatforms
            const allIndices = allPlatforms
              .map((p, i) => p.name === platformName ? i : -1)
              .filter(i => i !== -1)
            const actualIndex = allIndices[idx]

            return (
              <div key={`${platformName}-${idx}`} className="px-4 md:px-6 pb-5 pt-4">
                {/* Account Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {platform.handle || `Account ${idx + 1}`}
                    </p>
                    {platform.handle && platform.followers && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {platform.followers} followers
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // Find all platforms of this type and get the correct index
                      const allOfType = allPlatforms
                        .map((p, i) => ({ platform: p, index: i }))
                        .filter(({ platform }) => platform.name === platformName)
                      const platformToRemove = allOfType[idx]
                      if (platformToRemove) {
                        onRemovePlatform(platformToRemove.index)
                      }
                    }}
                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                {/* Account Form */}
                <div className="space-y-3 mb-4">
                  <Input
                    label="Username"
                    type="text"
                    value={actualIndex >= 0 ? allPlatforms[actualIndex].handle : ''}
                    onChange={(e) => onUpdatePlatform(actualIndex, 'handle', e.target.value)}
                    placeholder="@ username"
                    required
                    className="bg-gray-50"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Followers"
                      type="number"
                      value={actualIndex >= 0 ? allPlatforms[actualIndex].followers : ''}
                      onChange={(e) => onUpdatePlatform(actualIndex, 'followers', e.target.value === '' ? '' : parseInt(e.target.value))}
                      required
                      placeholder="0"
                      min={1}
                      className="bg-gray-50"
                    />
                    <Input
                      label="Engagement Rate (%)"
                      type="number"
                      value={actualIndex >= 0 ? allPlatforms[actualIndex].engagement_rate : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(',', '.')
                        onUpdatePlatform(actualIndex, 'engagement_rate', raw === '' ? '' : parseFloat(raw))
                      }}
                      required
                      placeholder="0.00"
                      min={0.01}
                      max={100}
                      step="0.01"
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <PlatformDemographics
                  platform={allPlatforms[actualIndex]}
                  platformIndex={actualIndex}
                  isExpanded={expandedPlatforms.has(actualIndex)}
                  onToggleExpanded={() => onTogglePlatformExpanded(actualIndex)}
                  countryInput={platformCountryInputs[actualIndex] || ''}
                  onCountryInputChange={(value) => onCountryInputChange(actualIndex, value)}
                  availableCountries={getAvailableCountries(actualIndex)}
                  onAddCountry={(country) => onAddCountry(actualIndex, country)}
                  onRemoveCountry={(countryIndex) => onRemoveCountry(actualIndex, countryIndex)}
                  onUpdateCountryPercentage={(countryIndex, percentage) => onUpdateCountryPercentage(actualIndex, countryIndex, percentage)}
                  onToggleAgeGroup={(ageRange) => onToggleAgeGroup(actualIndex, ageRange)}
                  onUpdateGenderSplit={(field, value) => onUpdateGenderSplit(actualIndex, field, value)}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
