/**
 * Centralized color and status style definitions.
 * These work alongside the Tailwind config semantic colors.
 */

import type { CollaborationStatus } from '@/lib/types'

/**
 * Status badge style configuration
 * Used for collaboration status badges throughout the app
 */
export const STATUS_STYLES = {
  pending: {
    bg: 'bg-warning-100',
    text: 'text-warning-700',
    border: 'border-warning-200',
    dot: 'bg-warning-500',
  },
  negotiating: {
    bg: 'bg-info-100',
    text: 'text-info-700',
    border: 'border-info-200',
    dot: 'bg-info-500',
  },
  accepted: {
    bg: 'bg-success-100',
    text: 'text-success-700',
    border: 'border-success-200',
    dot: 'bg-success-500',
  },
  staying: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  completed: {
    bg: 'bg-success-100',
    text: 'text-success-700',
    border: 'border-success-200',
    dot: 'bg-success-500',
  },
  declined: {
    bg: 'bg-error-100',
    text: 'text-error-700',
    border: 'border-error-200',
    dot: 'bg-error-500',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
} as const

export type StatusStyleKey = keyof typeof STATUS_STYLES

/**
 * Get status style classes for a given status
 * Returns combined bg and text classes for badges
 */
export function getStatusClasses(status: string): string {
  const style = STATUS_STYLES[status.toLowerCase() as StatusStyleKey]
  if (!style) return `${STATUS_STYLES.pending.bg} ${STATUS_STYLES.pending.text}`
  return `${style.bg} ${style.text}`
}

/**
 * Get full status style object for a given status
 */
export function getStatusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase() as StatusStyleKey] ?? STATUS_STYLES.pending
}

/**
 * Calendar event colors by status
 */
export const CALENDAR_STATUS_COLORS = {
  pending: 'bg-muted',
  negotiating: 'bg-info-500',
  accepted: 'bg-primary-500',
  staying: 'bg-purple-500',
  completed: 'bg-success-500',
  declined: 'bg-error-500',
  cancelled: 'bg-gray-400',
} as const

/**
 * System message style variants
 */
export const SYSTEM_MESSAGE_STYLES = {
  negotiation: {
    bg: 'bg-info-50/50',
    text: 'text-info-700',
    border: 'border-info-100',
    icon: 'text-info-500',
  },
  success: {
    bg: 'bg-success-50/50',
    text: 'text-success-700',
    border: 'border-success-100',
    icon: 'text-success-500',
  },
  warning: {
    bg: 'bg-warning-50/50',
    text: 'text-warning-700',
    border: 'border-warning-100',
    icon: 'text-warning-500',
  },
  default: {
    bg: 'bg-gray-100/50',
    text: 'text-gray-500',
    border: 'border-gray-200',
    icon: 'text-gray-400',
  },
} as const
