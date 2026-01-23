'use client'

import type { ProfileCompletionProgressProps } from './types'

export function ProfileCompletionProgress({ percentage }: ProfileCompletionProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
        <span className="text-sm font-bold text-primary-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
