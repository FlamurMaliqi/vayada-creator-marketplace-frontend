/**
 * Consent and GDPR API service
 */

import { apiClient } from './client'

// Types
export interface CookieConsentRequest {
  visitor_id: string
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export interface CookieConsentResponse {
  id: string
  visitor_id: string
  user_id: string | null
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  created_at: string
  updated_at: string
}

export interface ConsentStatusResponse {
  terms_accepted: boolean
  terms_accepted_at: string | null
  terms_version: string | null
  privacy_accepted: boolean
  privacy_accepted_at: string | null
  privacy_version: string | null
  marketing_consent: boolean
  marketing_consent_at: string | null
}

export interface UpdateMarketingConsentRequest {
  marketing_consent: boolean
}

export interface UpdateMarketingConsentResponse {
  marketing_consent: boolean
  marketing_consent_at: string
  message: string
}

export interface ConsentHistoryItem {
  id: string
  consent_type: string
  consent_given: boolean
  version: string | null
  created_at: string
}

export interface ConsentHistoryResponse {
  history: ConsentHistoryItem[]
  total: number
}

export interface GdprExportRequestResponse {
  id: string
  status: string
  requested_at: string
  expires_at: string | null
  message: string
}

export interface GdprRequestStatusResponse {
  id: string
  request_type: 'export' | 'deletion'
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'expired'
  requested_at: string
  processed_at: string | null
  expires_at: string | null
}

export interface GdprDeletionRequestResponse {
  id: string
  status: string
  requested_at: string
  scheduled_deletion_at: string
  message: string
}

export interface GdprDeletionCancelResponse {
  message: string
  cancelled: boolean
}

export const consentService = {
  // Cookie Consent
  saveCookieConsent: async (data: CookieConsentRequest): Promise<CookieConsentResponse> => {
    return apiClient.post<CookieConsentResponse>('/consent/cookies', data)
  },

  getCookieConsent: async (visitorId: string): Promise<CookieConsentResponse | null> => {
    try {
      return await apiClient.get<CookieConsentResponse>(`/consent/cookies?visitor_id=${encodeURIComponent(visitorId)}`)
    } catch {
      return null
    }
  },

  // User Consent Status
  getConsentStatus: async (): Promise<ConsentStatusResponse> => {
    return apiClient.get<ConsentStatusResponse>('/consent/me')
  },

  updateMarketingConsent: async (data: UpdateMarketingConsentRequest): Promise<UpdateMarketingConsentResponse> => {
    return apiClient.put<UpdateMarketingConsentResponse>('/consent/me', data)
  },

  getConsentHistory: async (limit = 50, offset = 0): Promise<ConsentHistoryResponse> => {
    return apiClient.get<ConsentHistoryResponse>(`/consent/history?limit=${limit}&offset=${offset}`)
  },

  // GDPR Data Export
  requestDataExport: async (): Promise<GdprExportRequestResponse> => {
    return apiClient.post<GdprExportRequestResponse>('/gdpr/export-request')
  },

  getExportStatus: async (): Promise<GdprRequestStatusResponse> => {
    return apiClient.get<GdprRequestStatusResponse>('/gdpr/export-status')
  },

  downloadExport: async (token: string): Promise<Blob> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gdpr/export-download?token=${encodeURIComponent(token)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to download export')
    }
    return response.blob()
  },

  // GDPR Account Deletion
  requestAccountDeletion: async (): Promise<GdprDeletionRequestResponse> => {
    return apiClient.post<GdprDeletionRequestResponse>('/gdpr/delete-request')
  },

  cancelAccountDeletion: async (): Promise<GdprDeletionCancelResponse> => {
    return apiClient.post<GdprDeletionCancelResponse>('/gdpr/delete-cancel')
  },

  getDeletionStatus: async (): Promise<GdprRequestStatusResponse> => {
    return apiClient.get<GdprRequestStatusResponse>('/gdpr/delete-status')
  },
}
