/**
 * Collaborations API service
 */

import { apiClient } from './client'
import type { Collaboration, PaginatedResponse } from '@/lib/types'

// Platform deliverable types
export interface PlatformDeliverable {
  type: string
  quantity: number
}

export interface PlatformDeliverablesItem {
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook'
  deliverables: PlatformDeliverable[]
}

// Creator application request
export interface CreateCreatorCollaborationRequest {
  initiator_type: 'creator'
  listing_id: string
  creator_id: string
  why_great_fit: string
  consent: true
  travel_date_from?: string
  travel_date_to?: string
  preferred_months?: string[]
  platform_deliverables: PlatformDeliverablesItem[]
}

// Hotel invitation request
export interface CreateHotelCollaborationRequest {
  initiator_type: 'hotel'
  listing_id: string
  creator_id: string
  collaboration_type: 'Free Stay' | 'Paid' | 'Discount'
  free_stay_min_nights?: number
  free_stay_max_nights?: number
  paid_amount?: number
  discount_percentage?: number
  preferred_date_from?: string
  preferred_date_to?: string
  preferred_months?: string[]
  platform_deliverables: PlatformDeliverablesItem[]
  message?: string
}

export type CreateCollaborationRequest = CreateCreatorCollaborationRequest | CreateHotelCollaborationRequest

export const collaborationService = {
  /**
   * Get all collaborations
   */
  getAll: async (params?: {
    page?: number
    limit?: number
    status?: string
    hotelId?: string
    creatorId?: string
  }): Promise<PaginatedResponse<Collaboration>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.hotelId) queryParams.append('hotelId', params.hotelId)
    if (params?.creatorId) queryParams.append('creatorId', params.creatorId)
    
    const query = queryParams.toString()
    return apiClient.get<PaginatedResponse<Collaboration>>(`/collaborations${query ? `?${query}` : ''}`)
  },

  /**
   * Get collaboration by ID
   */
  getById: async (id: string): Promise<Collaboration> => {
    return apiClient.get<Collaboration>(`/collaborations/${id}`)
  },

  /**
   * Create collaboration request (creator application or hotel invitation)
   */
  create: async (data: CreateCollaborationRequest): Promise<Collaboration> => {
    return apiClient.post<Collaboration>('/collaborations', data)
  },

  /**
   * Update collaboration status
   */
  updateStatus: async (id: string, status: string): Promise<Collaboration> => {
    return apiClient.put<Collaboration>(`/collaborations/${id}`, { status })
  },

  /**
   * Delete collaboration
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/collaborations/${id}`)
  },
}

