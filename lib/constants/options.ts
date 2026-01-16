/**
 * Centralized constants for the application
 * Import from here instead of defining locally to ensure consistency
 */

// Month names - full
export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const

// Month names - abbreviated
export const MONTHS_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const

// Platform options for creators (base platforms)
export const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'YouTube', 'Facebook'] as const

// Platform options including content packages (for collaborations)
export const PLATFORM_OPTIONS_WITH_CONTENT = [
  'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Content Package'
] as const

// Platform options including custom (for suggest changes modal)
export const PLATFORM_OPTIONS_ALL = [
  'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Content Package', 'Custom'
] as const

// Collaboration types
export const COLLABORATION_TYPES = ['Free Stay', 'Paid', 'Discount'] as const

// Platform to deliverables mapping
export const PLATFORM_DELIVERABLES: Record<string, readonly string[]> = {
  'Instagram': ['Instagram Post', 'Instagram Stories', 'Instagram Reel'],
  'Facebook': ['Facebook Post', 'Facebook Stories', 'Facebook Reel'],
  'TikTok': ['TikTok Video'],
  'YouTube': ['YouTube Video', 'YouTube Shorts'],
  'Content Package': ['Photos', 'Videos'],
  'Custom': ['Custom Deliverable'],
} as const

// Calendar constants
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1)

// Type exports for type-safe usage
export type Month = typeof MONTHS_FULL[number]
export type MonthAbbr = typeof MONTHS_ABBR[number]
export type PlatformOption = typeof PLATFORM_OPTIONS[number]
export type PlatformOptionWithContent = typeof PLATFORM_OPTIONS_WITH_CONTENT[number]
export type PlatformOptionAll = typeof PLATFORM_OPTIONS_ALL[number]
export type CollaborationType = typeof COLLABORATION_TYPES[number]
