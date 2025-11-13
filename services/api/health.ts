/**
 * Health check API service
 * Used to test backend connection
 */

import { apiClient } from './client'

export interface HealthResponse {
  status: string
  service?: string
}

export interface DatabaseHealthResponse {
  status: string
  database: {
    connected: boolean
    version?: string
    tables?: number
    error?: string
  }
}

export const healthService = {
  /**
   * Check backend health
   */
  check: async (): Promise<HealthResponse> => {
    return apiClient.get<HealthResponse>('/health')
  },

  /**
   * Check database health
   */
  checkDatabase: async (): Promise<DatabaseHealthResponse> => {
    return apiClient.get<DatabaseHealthResponse>('/health/db')
  },
}

