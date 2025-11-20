/**
 * API client configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  detail: string | Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export class ApiErrorResponse extends Error {
  status: number
  data: ApiError

  constructor(status: number, data: ApiError) {
    super(data.detail as string || `API Error: ${status}`)
    this.name = 'ApiErrorResponse'
    this.status = status
    this.data = data
  }
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new ApiErrorResponse(response.status, data as ApiError)
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiErrorResponse) {
        throw error
      }
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

