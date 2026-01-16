/**
 * Status mapping utilities between backend and frontend
 *
 * Backend uses: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'
 * Frontend uses: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
 */

export type BackendStatus = 'pending' | 'accepted' | 'declined' | 'negotiating' | 'completed' | 'cancelled'
export type FrontendStatus = 'pending' | 'accepted' | 'rejected' | 'negotiating' | 'completed' | 'cancelled'

/**
 * Convert backend status to frontend status
 * Maps 'declined' → 'rejected'
 */
export function toFrontendStatus(backendStatus: string): FrontendStatus {
  if (backendStatus === 'declined') return 'rejected'
  return backendStatus as FrontendStatus
}

/**
 * Convert frontend status to backend status
 * Maps 'rejected' → 'declined'
 */
export function toBackendStatus(frontendStatus: string): BackendStatus {
  if (frontendStatus === 'rejected') return 'declined'
  return frontendStatus as BackendStatus
}

/**
 * Status map for transforming backend responses (backend → frontend)
 */
export const BACKEND_TO_FRONTEND_STATUS: Record<string, FrontendStatus> = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'rejected',
  negotiating: 'negotiating',
  completed: 'completed',
  cancelled: 'cancelled',
}

/**
 * Status map for API requests (frontend → backend)
 */
export const FRONTEND_TO_BACKEND_STATUS: Record<string, BackendStatus> = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'declined',
  negotiating: 'negotiating',
  completed: 'completed',
  cancelled: 'cancelled',
}
