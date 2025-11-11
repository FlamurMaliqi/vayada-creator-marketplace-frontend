/**
 * User-related types
 */

import { UserType, UserStatus } from './index'

export interface BaseUser {
  id: string
  email: string
  name: string
  type: UserType
  status: UserStatus
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface HotelUser extends BaseUser {
  type: 'hotel'
  hotelId: string
}

export interface CreatorUser extends BaseUser {
  type: 'creator'
  creatorId: string
}

export interface AdminUser extends BaseUser {
  type: 'admin'
  permissions: string[]
}

export type User = HotelUser | CreatorUser | AdminUser

