'use client'

import { Input } from '@/components/ui'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: {
    // Hotel filters (for creators)
    accommodationType?: string
    collaborationType?: string
    availability?: string
    // Creator filters (for hotels)
    followerRange?: string
    platform?: string
  }
  onFiltersChange: (filters: {
    accommodationType?: string
    collaborationType?: string
    availability?: string
    followerRange?: string
    platform?: string
  }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

// Hotel filter options (for creators filtering hotels)
const ACCOMMODATION_TYPES = [
  'Alle Unterkunftstypen',
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Lodge',
  'Apartment',
  'Villa',
]

const COLLABORATION_TYPES = [
  'Alle Kollaborationstypen',
  'Kostenlos',
  'Bezahlt',
]

const MONTHS = [
  'Alle Monate',
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

// Creator filter options (for hotels filtering creators)
const FOLLOWER_RANGES = [
  'Alle Follower-Bereiche',
  '1.000 - 10.000',
  '10.000 - 50.000',
  '50.000 - 100.000',
  '100.000 - 500.000',
  '500.000 - 1.000.000',
  '1.000.000+',
]

const PLATFORMS = [
  'Alle Plattformen',
  'Instagram',
  'TikTok',
  'Facebook',
  'YT',
]

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  viewType,
}: MarketplaceFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = 
    filters.accommodationType || 
    filters.collaborationType || 
    filters.availability || 
    filters.followerRange || 
    filters.platform

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Hotels, Creator suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 w-full"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FunnelIcon className="w-5 h-5" />
          <span className="font-medium">Filter</span>
          {showFilters && hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
              Aktiv
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Hotel Filters (for creators filtering hotels) */}
            {(viewType === 'all' || viewType === 'hotels') && (
              <>
                {/* Accommodation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unterkunftstyp
                  </label>
                  <select
                    value={filters.accommodationType || ''}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, accommodationType: e.target.value === 'Alle Unterkunftstypen' ? '' : e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {ACCOMMODATION_TYPES.map((type) => (
                      <option key={type} value={type === 'Alle Unterkunftstypen' ? '' : type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Collaboration Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kollaborationstyp
                  </label>
                  <select
                    value={filters.collaborationType || ''}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, collaborationType: e.target.value === 'Alle Kollaborationstypen' ? '' : e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {COLLABORATION_TYPES.map((type) => (
                      <option key={type} value={type === 'Alle Kollaborationstypen' ? '' : type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verfügbarkeit
                  </label>
                  <select
                    value={filters.availability || ''}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, availability: e.target.value === 'Alle Monate' ? '' : e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month === 'Alle Monate' ? '' : month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Creator Filters (for hotels filtering creators) */}
            {(viewType === 'all' || viewType === 'creators') && (
              <>
                {/* Follower Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follower-Bereich
                  </label>
                  <select
                    value={filters.followerRange || ''}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, followerRange: e.target.value === 'Alle Follower-Bereiche' ? '' : e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {FOLLOWER_RANGES.map((range) => (
                      <option key={range} value={range === 'Alle Follower-Bereiche' ? '' : range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plattform
                  </label>
                  <select
                    value={filters.platform || ''}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, platform: e.target.value === 'Alle Plattformen' ? '' : e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform === 'Alle Plattformen' ? '' : platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}






