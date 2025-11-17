'use client'

import { useRef, useEffect } from 'react'
import { Input } from '@/components/ui'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface MarketplaceFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption?: string
  onSortChange?: (sort: string) => void
  filters: {
    hotelType?: string
    offering?: string
    availability?: string
    budget?: string
  }
  onFiltersChange: (filters: {
    hotelType?: string
    offering?: string
    availability?: string
    budget?: string
  }) => void
  viewType: 'all' | 'hotels' | 'creators'
}

// Filter options
const HOTEL_TYPES = [
  'All Hotel Types',
  'Hotel',
  'Resort',
  'Boutique Hotel',
  'Lodge',
  'Apartment',
  'Villa',
]

const OFFERINGS = [
  'All Offerings',
  'Free',
  'Paid',
]

const AVAILABILITY_OPTIONS = [
  'All Months',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const BUDGET_OPTIONS = [
  'All Budgets',
  'Free',
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000+',
]

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  sortOption = 'relevance',
  onSortChange,
  filters,
  onFiltersChange,
  viewType,
}: MarketplaceFiltersProps) {
  const hotelTypeRef = useRef<HTMLSelectElement>(null)
  const offeringRef = useRef<HTMLSelectElement>(null)
  const availabilityRef = useRef<HTMLSelectElement>(null)
  const budgetRef = useRef<HTMLSelectElement>(null)

  const adjustSelectWidth = (ref: React.RefObject<HTMLSelectElement>) => {
    if (ref.current) {
      const select = ref.current
      const selectedOption = select.options[select.selectedIndex]
      const text = selectedOption?.text || select.options[0]?.text || ''
      
      // Create a temporary span to measure text width
      const tempSpan = document.createElement('span')
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.fontSize = window.getComputedStyle(select).fontSize
      tempSpan.style.fontFamily = window.getComputedStyle(select).fontFamily
      tempSpan.style.fontWeight = window.getComputedStyle(select).fontWeight
      tempSpan.textContent = text
      document.body.appendChild(tempSpan)
      
      const textWidth = tempSpan.offsetWidth
      document.body.removeChild(tempSpan)
      
      // Set width: text width + padding (px-3 = 12px each side = 24px)
      select.style.width = `${Math.max(textWidth + 24, 80)}px`
    }
  }

  useEffect(() => {
    adjustSelectWidth(hotelTypeRef)
    adjustSelectWidth(offeringRef)
    adjustSelectWidth(availabilityRef)
    adjustSelectWidth(budgetRef)
  }, [filters])

  const handleFilterChange = (key: 'hotelType' | 'offering' | 'availability' | 'budget', value: string) => {
    const newFilters = { ...filters }
    if (!value || value === 'All Hotel Types' || value === 'All Offerings' || value === 'All Months' || value === 'All Budgets') {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    onFiltersChange(newFilters)
  }

  return (
    <div className="mb-8">
      {/* Search Bar and Sort - Same Line */}
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder={viewType === 'hotels' 
              ? 'Search hotels by name or location...'
              : viewType === 'creators'
              ? 'Search creators by name or location...'
              : 'Hotels, Creator suchen...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 w-full"
          />
        </div>
        {onSortChange && (
          <div className="flex-shrink-0">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[150px]"
            >
              <option value="relevance">Relevance</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        )}
      </div>

      {/* Filter Options - Beneath Search Bar */}
      {(viewType === 'all' || viewType === 'hotels') && (
        <div className="flex flex-wrap gap-2">
          {/* Hotel Type Filter */}
          <select
            ref={hotelTypeRef}
            value={filters.hotelType || ''}
            onChange={(e) => {
              handleFilterChange('hotelType', e.target.value)
              setTimeout(() => adjustSelectWidth(hotelTypeRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Hotel Type</option>
            {HOTEL_TYPES.slice(1).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Offering Filter */}
          <select
            ref={offeringRef}
            value={filters.offering || ''}
            onChange={(e) => {
              handleFilterChange('offering', e.target.value)
              setTimeout(() => adjustSelectWidth(offeringRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Offering</option>
            {OFFERINGS.slice(1).map((offering) => (
              <option key={offering} value={offering}>
                {offering}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            ref={availabilityRef}
            value={filters.availability || ''}
            onChange={(e) => {
              handleFilterChange('availability', e.target.value)
              setTimeout(() => adjustSelectWidth(availabilityRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Availability</option>
            {AVAILABILITY_OPTIONS.slice(1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Budget Filter */}
          <select
            ref={budgetRef}
            value={filters.budget || ''}
            onChange={(e) => {
              handleFilterChange('budget', e.target.value)
              setTimeout(() => adjustSelectWidth(budgetRef), 0)
            }}
            className="inline-block px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-gray-400 transition-colors appearance-none"
            style={{ backgroundImage: 'none' }}
          >
            <option value="">Budget</option>
            {BUDGET_OPTIONS.slice(1).map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}






