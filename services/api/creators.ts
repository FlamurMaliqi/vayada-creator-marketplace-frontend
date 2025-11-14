/**
 * Creator API service
 */

import { apiClient } from './client'
import type { Creator, PaginatedResponse } from '@/lib/types'

// Backend response format
interface CreatorsListResponse {
  data: Creator[]
  total: number
}

export const creatorService = {
  /**
   * Get all creators
   */
  getAll: async (params?: { 
    page?: number
    limit?: number
    niche?: string
    location?: string
    status?: string
  }): Promise<CreatorsListResponse> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.niche) queryParams.append('niche', params.niche)
    if (params?.location) queryParams.append('location', params.location)
    if (params?.status) queryParams.append('status', params.status)
    
    const query = queryParams.toString()
    return apiClient.get<CreatorsListResponse>(`/creators${query ? `?${query}` : ''}`)
  },

  /**
   * Get creator by ID
   */
  getById: async (id: string): Promise<Creator> => {
    return apiClient.get<Creator>(`/creators/${id}`)
  },

  /**
   * Create creator
   */
  create: async (data: Partial<Creator>): Promise<Creator> => {
    return apiClient.post<Creator>('/creators', data)
  },

  /**
   * Update creator
   */
  update: async (id: string, data: Partial<Creator>): Promise<Creator> => {
    return apiClient.put<Creator>(`/creators/${id}`, data)
  },

  /**
   * Delete creator
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/creators/${id}`)
  },
}

