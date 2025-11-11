/**
 * Core domain types for Vayada marketplace
 */

// User types
export type UserType = 'hotel' | 'creator' | 'admin'

export type UserStatus = 'pending' | 'verified' | 'rejected' | 'suspended'

// Navigation
export interface NavigationLink {
  label: string
  href: string
  external?: boolean
}

// UI Components
import type { ComponentType } from 'react'

export interface Feature {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  title: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
}

export interface Advantage {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  title: string
  description: string
}

export interface SectionContent {
  title: string
  subtitle: string
  advantages: Advantage[]
  steps: Step[]
  ctaText: string
  ctaHref: string
}

// Hotel types
export interface Hotel {
  id: string
  name: string
  location: string
  description: string
  images: string[]
  amenities: string[]
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

// Creator types
export interface Creator {
  id: string
  name: string
  niche: string[]
  platforms: Platform[]
  audienceSize: number
  location: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface Platform {
  name: string
  handle: string
  followers: number
  engagementRate: number
}

// Collaboration types
export interface Collaboration {
  id: string
  hotelId: string
  creatorId: string
  status: CollaborationStatus
  createdAt: Date
  updatedAt: Date
}

export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
