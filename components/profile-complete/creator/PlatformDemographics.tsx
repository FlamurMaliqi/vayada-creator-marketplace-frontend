'use client'

import { Input } from '@/components/ui'
import { XMarkIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { AGE_GROUP_OPTIONS } from '@/lib/constants'
import type { PlatformFormData } from '@/lib/types'

interface PlatformDemographicsProps {
  platform: PlatformFormData
  platformIndex: number
  isExpanded: boolean
  onToggleExpanded: () => void
  countryInput: string
  onCountryInputChange: (value: string) => void
  availableCountries: string[]
  onAddCountry: (country?: string) => void
  onRemoveCountry: (countryIndex: number) => void
  onUpdateCountryPercentage: (countryIndex: number, percentage: number) => void
  onToggleAgeGroup: (ageRange: string) => void
  onUpdateGenderSplit: (field: 'male' | 'female', value: string) => void
}

export function PlatformDemographics({
  platform,
  platformIndex,
  isExpanded,
  onToggleExpanded,
  countryInput,
  onCountryInputChange,
  availableCountries,
  onAddCountry,
  onRemoveCountry,
  onUpdateCountryPercentage,
  onToggleAgeGroup,
  onUpdateGenderSplit,
}: PlatformDemographicsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-gray-800">Audience Demographics (Optional)</span>
        {isExpanded ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Top Countries */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Top Countries</p>
                <p className="text-xs text-gray-500">Select up to 3 countries with their audience percentage</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => onCountryInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onAddCountry()
                    }
                  }}
                  placeholder="Search countries..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                />
                {/* Dropdown suggestions */}
                {availableCountries.length > 0 && (
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    {availableCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => onAddCountry(country)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {platform.top_countries?.length ? (
                <div className="space-y-2">
                  {platform.top_countries.map((country, countryIndex) => (
                    <div
                      key={`${country.country}-${countryIndex}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-primary-50/60 px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{country.country || 'Country'}</p>
                        <p className="text-xs text-gray-500">Audience percentage</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={country.percentage && country.percentage > 0 ? country.percentage : ''}
                            onChange={(e) => {
                              const raw = e.target.value
                              const parsed = raw === '' ? 0 : parseFloat(raw)
                              onUpdateCountryPercentage(countryIndex, parsed)
                            }}
                            placeholder="0"
                            className="w-16 bg-transparent text-sm text-gray-800 outline-none"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveCountry(countryIndex)}
                          className="p-1 text-gray-500 hover:text-primary-700"
                          aria-label={`Remove ${country.country}`}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Add up to 3 countries and set the audience % for each.</p>
              )}
            </div>
          </div>

          {/* Top Age Groups */}
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">Age Groups</p>
              <p className="text-xs text-gray-500">Select up to 3 age groups with their audience percentage</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUP_OPTIONS.map((range) => {
                const isSelected = platform.top_age_groups?.some((a) => a.ageRange === range)
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => onToggleAgeGroup(range)}
                    className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 border-primary-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-700'
                    }`}
                  >
                    {range}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gender Split */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">Gender Split</p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Male %"
                type="number"
                value={platform.gender_split?.male && platform.gender_split.male > 0 ? platform.gender_split.male : ''}
                onChange={(e) => {
                  const val = e.target.value
                  const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                  onUpdateGenderSplit('male', cleanVal)
                }}
                placeholder="45"
                min={0}
                max={100}
                step="0.1"
                className="bg-gray-50"
              />
              <Input
                label="Female %"
                type="number"
                value={platform.gender_split?.female && platform.gender_split.female > 0 ? platform.gender_split.female : ''}
                onChange={(e) => {
                  const val = e.target.value
                  const cleanVal = val === '' ? '' : val.replace(/^0+(?=\d)/, '') || val
                  onUpdateGenderSplit('female', cleanVal)
                }}
                placeholder="55"
                min={0}
                max={100}
                step="0.1"
                className="bg-gray-50"
              />
            </div>
            {platform.gender_split && (platform.gender_split.male + platform.gender_split.female) > 100 && (
              <p className="text-xs text-red-600 mt-1">Warning: Total &gt; 100%</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
