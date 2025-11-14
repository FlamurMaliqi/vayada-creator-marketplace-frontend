'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthenticatedNavigation, Footer, ProfileWarningBanner } from '@/components/layout'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { HotelCard } from '@/components/marketplace/HotelCard'
import { CreatorCard } from '@/components/marketplace/CreatorCard'
import { Button } from '@/components/ui'
import { hotelService } from '@/services/api/hotels'
import { creatorService } from '@/services/api/creators'
import { ROUTES } from '@/lib/constants/routes'
import type { Hotel, Creator } from '@/lib/types'

export default function MarketplacePage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'hotel' | 'creator' | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    niche: '',
  })

  useEffect(() => {
    // Get user type from localStorage
    if (typeof window !== 'undefined') {
      const storedUserType = localStorage.getItem('userType') as 'hotel' | 'creator' | null
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      
      console.log('Marketplace - userType from localStorage:', storedUserType)
      console.log('Marketplace - isLoggedIn:', isLoggedIn)
      
      if (!isLoggedIn || !storedUserType) {
        // Redirect to login if not logged in
        router.push(ROUTES.LOGIN)
        return
      }
      
      setUserType(storedUserType)
    }
  }, [router])

  useEffect(() => {
    if (userType) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, userType])

  const loadData = async () => {
    if (!userType) {
      console.log('loadData: userType is null, skipping')
      return
    }
    
    console.log('loadData: Loading data for userType:', userType)
    setLoading(true)
    try {
      // If user is a creator, show hotels
      if (userType === 'creator') {
        console.log('loadData: Fetching hotels for creator')
        const response = await hotelService.getAll({ status: 'verified' })
        console.log('loadData: Hotels response:', response)
        // Map backend response to frontend format
        const hotelsData = response.data.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          description: hotel.description || '',
          images: hotel.images || [],
          amenities: hotel.amenities || [],
          status: hotel.status,
          createdAt: new Date(hotel.created_at),
          updatedAt: new Date(hotel.updated_at),
        }))
        console.log('loadData: Setting hotels, clearing creators')
        setHotels(hotelsData)
        setCreators([])
      }
      // If user is a hotel, show creators
      else if (userType === 'hotel') {
        console.log('loadData: Fetching creators for hotel')
        const params: { niche?: string; location?: string; status?: string } = {
          status: 'verified', // Only show verified creators
        }
        if (filters.niche) params.niche = filters.niche
        if (filters.location) params.location = filters.location
        
        const response = await creatorService.getAll(params)
        console.log('loadData: Creators response:', response)
        // Map backend response to frontend format
        const creatorsData = response.data.map((creator: any) => ({
          id: creator.id,
          name: creator.name,
          niche: creator.niche || [],
          platforms: (creator.platforms || []).map((p: any) => ({
            name: p.name,
            handle: p.handle,
            followers: p.followers || 0,
            engagementRate: p.engagement_rate || 0,
          })),
          audienceSize: creator.audience_size || 0,
          location: creator.location || '',
          status: creator.status,
          createdAt: new Date(creator.created_at),
          updatedAt: new Date(creator.updated_at),
        }))
        console.log('loadData: Setting creators, clearing hotels')
        setCreators(creatorsData)
        setHotels([])
      }
    } catch (error) {
      console.error('Failed to load marketplace data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      hotel.name.toLowerCase().includes(query) ||
      hotel.location.toLowerCase().includes(query) ||
      hotel.description.toLowerCase().includes(query)
    )
  })

  const filteredCreators = creators.filter((creator) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      creator.name.toLowerCase().includes(query) ||
      creator.location.toLowerCase().includes(query) ||
      creator.niche.some((n) => n.toLowerCase().includes(query))
    )
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      <div className="pt-16">
        <ProfileWarningBanner />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Marketplace
            </h1>
            <p className="text-lg text-gray-600">
              {userType === 'creator' 
                ? 'Discover hotels for authentic partnerships'
                : 'Discover creators and influencers for authentic partnerships'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          viewType={userType === 'creator' ? 'hotels' : 'creators'}
        />

        {/* Results */}
        {!userType ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Hotels Section - Only shown for creators */}
            {userType === 'creator' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hotels {filteredHotels.length > 0 && `(${filteredHotels.length})`}
                  </h2>
                </div>
                {filteredHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500">No hotels found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Creators Section - Only shown for hotels */}
            {userType === 'hotel' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Creators & Influencers {filteredCreators.length > 0 && `(${filteredCreators.length})`}
                  </h2>
                </div>
                {filteredCreators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCreators.map((creator) => (
                      <CreatorCard key={creator.id} creator={creator} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500">No creators found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}

