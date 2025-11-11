/**
 * Hotel API service
 */

import { apiClient } from './client'
import type { Hotel, PaginatedResponse } from '@/lib/types'

export const hotelService = {
  /**
   * Get all hotels
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Hotel>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const query = queryParams.toString()
    return apiClient.get<PaginatedResponse<Hotel>>(`/hotels${query ? `?${query}` : ''}`)
  },

  /**
   * Get hotel by ID
   */
  getById: async (id: string): Promise<Hotel> => {
    return apiClient.get<Hotel>(`/hotels/${id}`)
  },

  /**
   * Create hotel
   */
  create: async (data: Partial<Hotel>): Promise<Hotel> => {
    return apiClient.post<Hotel>('/hotels', data)
  },

  /**
   * Update hotel
   */
  update: async (id: string, data: Partial<Hotel>): Promise<Hotel> => {
    return apiClient.put<Hotel>(`/hotels/${id}`, data)
  },

  /**
   * Delete hotel
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/hotels/${id}`)
  },
}

